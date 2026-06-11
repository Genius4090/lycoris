import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../supabase/productService";
import { PATH } from "../constants/paths";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

export default function Popularproducts() {
  const PAGE_SIZE = 4;
  const navigate = useNavigate();

  const { data: Popularproduct } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts({ PAGE_SIZE }),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <ul className="flex items-center gap-10 mt-9">
      {Popularproduct?.products.map((product, i) => (
        <motion.div
          key={product.id}
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
        >
          <div className="w-[250px] h-[280px] overflow-hidden bg-brownish/30">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 cursor-pointer"
                onClick={() => navigate(`${PATH.products}/${product.id}`)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">
                🌸
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className="font-liter text-title">{product.title}</p>
            <p className="font-liter text-title">{product.price} Euro</p>
          </div>
        </motion.div>
      ))}
    </ul>
  );
}
