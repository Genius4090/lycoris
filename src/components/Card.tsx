
import { useNavigate } from "react-router-dom";
import { PATH } from "../constants/paths";
import { Minus, Plus } from "lucide-react";

const Card = ({ product, user, addMutation, removeMutation, qty }) => {
  const navigate = useNavigate();
  return (
    <div>
      <li
        key={product.id}
      >
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-[250px] h-[248px] object-cover cursor-pointer"
          />
        )}

          <h3 className="font-liter text-lg text-title mt-2">{product.title}</h3>
        <div className="flex justify-between mt-4 items-center">
     <p className="text-sm">Stock: {product.stock}</p>
             <p className="text-sm">{product.price} Euro</p>  
        </div>
     
      <div className="mt-5 flex flex-col  items-center">
          {!user ? (
            <div className="border border-brownish p-2 w-full">
                 <button onClick={() => navigate(PATH.login)} className="cursor-pointer w-full font-liter flex justify-center gap-2 items-center text-title bg-brownish py-2 px-7 "> Log in to add to cart</button>
             </div>
        ) : product.stock === 0 ? (
       
            <div className={`border border-brownish p-2 w-full opacity-70`}>
                 <p className="cursor-pointer w-full font-liter flex justify-center gap-2 items-center text-title bg-brownish py-2 px-7 ">Out of stock</p>
             </div>
        ) : qty > 0 ? (
          <div className="w-full border border-brownish p-2">
            <div className="bg-brownish flex items-center justify-between w-full py-1">
              <button
              onClick={() => removeMutation.mutate(product.id)}
              className="bg-brownish text-title w-8 h-8 rounded-full text-lg flex items-center justify-center cursor-pointer"
            >
             <Minus className="w-4"/>
            </button>
            <button
              onClick={() => addMutation.mutate(product.id)}
              disabled={qty >= product.stock}
              className="bg-brownish text-title w-8 h-8 rounded-full text-lg disabled:opacity-40 flex items-center justify-center cursor-pointer"
            >
              <Plus  className="w-4"/>
            </button>
            </div>
          </div>
        ) : (
          <div className="border border-brownish p-2 w-full">
                 <button onClick={() => addMutation.mutate(product.id)} className="cursor-pointer w-full font-liter flex justify-center gap-2 items-center text-title bg-brownish py-2 px-7 ">Add to cart</button>
             </div>
        )}
           

      </div>
      </li>
    </div>
  );
};

export default Card;
