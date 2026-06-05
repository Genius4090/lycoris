import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabase-client";
import { useQueryClient } from "@tanstack/react-query";

type Product = {
  id: number;
  title: string;
  price: number;
};
type Props = {
  productId: number | null;
  products: Product[];
  setProductId: (id: number | null) => void;
};

export const UpdateForm = ({
  productId,
  products,
  setProductId,
}: Props) => {
  const queryClient = useQueryClient();
  const foundItem = products.find((item) => item.id === productId);

  const [inpTitle, setInpTitle] = useState("");
  const [inpPrice, setInpPrice] = useState("");

  // sync form when product changes
  useEffect(() => {
    if (foundItem) {
      setInpTitle(foundItem.title);
      setInpPrice(String(foundItem.price));
    }
  }, [productId]);
  // UPDATE
  async function handleUpdateSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!productId || !foundItem) return;

    const { error } = await supabase
      .from("tasks")
      .update({
        title: inpTitle,
        price: Number(inpPrice),
      })
      .eq("id", productId);

    if (error) {
      console.log(error);
      return;
    }

  queryClient.invalidateQueries({ queryKey: ["products"] });

    // reset UI
    setInpTitle("");
    setInpPrice("");
    setProductId(null);
  }

  if (!productId) return null;

  return (
    <div className="mt-20">
      <form onSubmit={handleUpdateSubmit}>
        <input
          value={inpTitle}
          onChange={(e) => setInpTitle(e.target.value)}
          placeholder="title"
        />
        <input
          value={inpPrice}
          onChange={(e) => setInpPrice(e.target.value)}
          placeholder="price"
        />
        <button>update</button>
      </form>
    </div>
  );
};