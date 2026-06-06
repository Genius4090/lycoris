import { supabase } from "./supabase-client";

export type OrderStatus = "pending" | "cancelled";

export interface OrderItem {
  id: string
  order_id: string
  product_id: number
  quantity: number
  unit_price: number
  product: {
    id: number
    title: string
    image_url: string | null
  }
}

export interface Order {
  id: string
  user_id: string
  total: number
  status: OrderStatus
  created_at: string
  items: OrderItem[]
}

/** Fetch all orders for the current user, newest first, with their line items. */
export const fetchOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items (
        *,
        product:products (id, title, image_url)
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Order[];
};

/**
 * Place an order atomically via Postgres function:
 * creates order → copies cart items → decrements stock → clears cart
 */
export const placeOrder = async (): Promise<void> => {
  const { error } = await supabase.rpc("place_order");
  if (error) throw error;
};

/**
 * Cancel an order atomically via Postgres function:
 * sets status = 'cancelled' → restores stock for each item
 */
export const cancelOrder = async (orderId: string): Promise<void> => {
  const { error } = await supabase.rpc("cancel_order", {
    p_order_id: orderId,
  });
  if (error) throw error;
};

/**
 * Delete all orders (and their items via cascade) for the current user.
 * This is permanent — no restore possible.
 */
export const clearOrderHistory = async (): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("orders")
    .delete()
    .eq("user_id", user.id);

  if (error) throw error;
};
