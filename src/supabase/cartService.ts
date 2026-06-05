import { supabase } from "./supabase-client";
import type { CartItemFull } from "../@types";

/**
 * Fetch all cart rows for the current user, joined with product data.
 * Returns an empty array when the user has no items.
 */
export const fetchCart = async (): Promise<CartItemFull[]> => {
  const { data, error } = await supabase
    .from("cart_items")
    .select("*, product:products(*)")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as CartItemFull[];
};

/**
 * Add a product to the cart or increment its quantity by 1.
 * Uses a single upsert + Postgres function to avoid multiple round-trips.
 */
export const addToCart = async (productId: number): Promise<void> => {
  const { error } = await supabase.rpc("upsert_cart_item", {
    p_product_id: productId,
  });
  if (error) throw error;
};

/**
 * Decrement a cart item's quantity by 1, or delete it when quantity reaches 0.
 */
export const removeFromCart = async (productId: number): Promise<void> => {
  const { error } = await supabase.rpc("decrement_cart_item", {
    p_product_id: productId,
  });
  if (error) throw error;
};

/**
 * Remove a cart item entirely regardless of quantity.
 */
export const deleteCartItem = async (cartRowId: string): Promise<void> => {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", cartRowId);
  if (error) throw error;
};

/**
 * Delete all cart items for the current user.
 */
export const clearCart = async (): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id);
  if (error) throw error;
};
