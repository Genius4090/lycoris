import { supabase } from "./supabase-client";
import type { Product } from "../@types";

export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw error;
  return data as Product[];
};
