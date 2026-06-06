import { Flower1, Flower2, Flower3, Flower4 } from "../assets/images"
import Button from "./Button"
import Title from "./Title"



const PopularBanner = () => {
    const PopularList:{id:number,img:string}[] = [
    {
        id:1,
        img:Flower1
    },
    {
        id:2,
        img:Flower2
    },
    {
        id:3,
        img:Flower3
    },
    {
        id:4,
        img:Flower4
    }
]
  return (
   <section className="flex flex-col items-end mt-25">
    <Title extraClass="w-160 mx-auto">Unveiling Our Popular Bouquet Collection</Title>
     <div className="flex items-center gap-5 mt-15">
        {PopularList.map(item => <img key={item.id} src={item.img} alt="popular-image" className="w-[250px] h-[260px]" />)}
    </div>
    <p className="w-full mt-5 font-light">Catalog of Floral Delights for Every Occasion</p>
    <Button extraClass="mt-5">Open More</Button>
   </section>
  )
}

export default PopularBanner