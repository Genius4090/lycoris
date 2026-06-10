import { Flower17, Flower16 } from "../../assets/images"
import Title from "../Title"

type Flower = {
    id:number,
    content:string,
    img:string,
    off:number
}

const HomeAd = () => {
    const flowerList:Flower[] = [
    {
        id:1,
        content: "Springtime Serenade",
        img: Flower17,
        off: 20
    },
    {
        id:2,
        content: "Blooming Splendor",
        img: Flower16,
        off: 17
    }
    ]
  return (
    <section className="w-full h-screen flex flex-col items-center justify-center gap-8">
        <Title extraClass="max-w-[650px]">20% Off Your First Purchase at Our Store!</Title>
        <p className="max-w-[880px] text-center text-title">At our store, we believe in celebrating new beginnings. That's why we're thrilled to offer an exclusive deal for first-time customers. Enjoy a remarkable 20% off on your inaugural purchase with us. Delight in selecting from our wide range of high-quality products, handpicked and crafted with utmost care.</p>
        <ul className="flex gap-10 mt-8">
            {
               flowerList.map(item =>
                <li key={item.id} className="relative">
                    <span className="bg-[#F7FF00] px-2 py-0.5 absolute -top-4 -right-5 font-liter">{item.off}%</span>
                     <img key={item.id} src={item.img} alt={item.content} />
                     <p className="mt-5 text-center font-liter text-xl text-title">{item.content}</p>
                </li>
               )
            }
        </ul>
    </section>
  )
}

export default HomeAd