import { supabase } from "./supabase-client";
import type { Product } from "../@types";

export type FetchProductsParams = {
  search?: string;
  sortAZ?: boolean;
  page?: number;
  PAGE_SIZE?: number;
};

export type FetchProductsResult = {
  products: Product[];
  total: number;
  pageSize: number;
};

export const fetchProductById = async (id: number): Promise<Product> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Product;
};

export const fetchProducts = async ({
  search = "",
  sortAZ = false,
  page = 1,
  PAGE_SIZE
}: FetchProductsParams = {}): Promise<FetchProductsResult> => {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .order(sortAZ ? "title" : "id", { ascending: true })
    .range(from, to);

  if (search.trim()) {
    query = query.ilike("title", `%${search.trim()}%`);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    products: data as Product[],
    total: count ?? 0,
    pageSize: PAGE_SIZE,
  };
};
