import { HomeImg2 } from "../../assets/images"
import Title from "../Title"

const HomeSection1 = () => {
  const InfoList:string[] = [
    "Monday - 9am-5pm",
    "Tuesday - Friday 9am-7pm",
    "Sat - 9am-6pm",
    "Sun - Closed"
  ]
  return (
    <section className="w-full h-screen flex flex-col items-center justify-center pt-20">
      <Title extraClass="max-w-[780px]">Discover Our Flower Shop's Delightful Collection</Title>
      <div className="flex gap-10 mt-20">
        <img src={HomeImg2} alt="home-section-1-img"/>
       <div>
       <div className="py-4">
      <div className="relative w-full">
        <h3 className="font-liter text-3xl font-medium">OUR STORE</h3>
      <p className="text-textish mt-4 mb-2">Blossom Haven <br /> c/floral 523</p>
      <span className="bg-[#F7FF00] px-1.5 py-0.5 absolute -top-4.5 -right-3 font-liter">New</span>
      </div>            
        </div>
        
        <ul className="flex flex-col gap-2">
          {InfoList.map(item => <li key={item} className="text-textish">{item}</li>)}
        </ul>
       </div>
      </div>
    </section>
  )
}

export default HomeSection1