import { useNavigate } from "react-router-dom";
import { PATH } from "../constants/paths";
import { Minus, Plus } from "lucide-react";
import type { UseMutationResult } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import type { Product } from "../@types";

interface CardProps {
  product: Product;
  user: User | null;
  addMutation: UseMutationResult<void, Error, number>;
  removeMutation: UseMutationResult<void, Error, number>;
  qty: number;
}

const Card = ({ product, user, addMutation, removeMutation, qty }: CardProps) => {
  const navigate = useNavigate();


  return (
    <li className="flex flex-col w-[370px]">
     
      {/* Image */}
      <div className="w-[370px] h-[378px] overflow-hidden bg-brownish/30">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onClick={()=> navigate(`${PATH.products}/${product.id}`)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">
            🌸
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-3 pt-3 flex-1">
        <h3 className="font-liter text-lg leading-snug text-title">{product.title}</h3>
        <div className="flex items-center justify-between text-textish">
          <span className="font-liter">{product.price} Euro</span>
          <span
            className={`text-sm px-2  py-0.5 rounded-full font-liter ${
              product.stock === 0
                ? "bg-red-900/40 text-red-400"
                : product.stock <= 3
                ? "bg-amber-900/40 text-amber-400"
                : "bg-brownish/20 text-title"
            }`}
          >
            {product.stock === 0 ? "Out of stock" : `${product.stock} left`}
          </span>
        </div>

       

        {/* Action — buttons untouched */}
        <div className="flex flex-col items-center mt-4">
          {!user ? (
            <div className="border border-brownish p-2 w-full">
              <button
                onClick={() => navigate(PATH.login)}
                className="cursor-pointer w-full font-liter flex justify-center gap-2 items-center text-grayish bg-brownish py-2 px-7"
              >
                Log in to add to cart
              </button>
            </div>
          ) : product.stock === 0 ? (
            <div className="border border-brownish p-2 w-full opacity-70">
              <p className="cursor-pointer w-full font-liter flex justify-center gap-2 items-center text-title bg-brownish py-2 px-7">
                Out of stock
              </p>
            </div>
          ) : qty > 0 ? (
            <div className="w-full border border-brownish p-2">
              <div className="bg-brownish flex items-center justify-between w-full py-1">
                <button
                  onClick={() => removeMutation.mutate(product.id)}
                  className="bg-brownish  w-8 h-8 rounded-full text-lg flex items-center justify-center cursor-pointer"
                >
                  <Minus className="w-4 text-grayish" />
                </button>
                <p className="font-liter mb-0.5 text-grayish">{qty}</p>
                <button
                  onClick={() => addMutation.mutate(product.id)}
                  disabled={qty >= product.stock}
                  className="bg-brownish text-title w-8 h-8 rounded-full text-lg disabled:opacity-40 flex items-center justify-center cursor-pointer"
                >
                  <Plus className="w-4 text-grayish" />
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-brownish p-2 w-full">
              <button
                onClick={() => addMutation.mutate(product.id)}
                className="cursor-pointer w-full font-liter flex justify-center gap-2 items-center text-grayish bg-brownish py-2 px-7"
              >
                Add to cart
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

export default Card;
