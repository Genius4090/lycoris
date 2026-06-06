import { StarIcon } from "../assets/icons"

interface InfoType {
    id:number,
    quantity:string,
    text:string
}
    
const Numbers = () => {
    const InfoList:InfoType[] = [
        {
          id:1,
          quantity: "12,500",
          text: "Bouquets Delivered"
        },
        {
          id:2,
          quantity: "3,400",
          text: "Daily Deliveries"
        },
        {
          id:3,
          quantity: "2,100",
          text: "5-Star Reviews"
        }
      ]
  
      return (
    <section className="mt-20 mb-10">
           <div className="relative ">
        <img src={StarIcon} alt="star-icon" className="absolute left-10 -top-2" />
        <img src={StarIcon} alt="star-icon" className="absolute right-10 -bottom-2" />
        <p className="text-[40px] text-title text-center">Our story in numbers</p>
      </div>
      <ul className="flex gap-4 mt-10">
        {InfoList.map(item => <li className="flex flex-col items-center py-4 px-6  bg-pinkish text-white rounded-xl" key={item.id}>
          <p className="text-[32px] font-semibold tracking-wider">{item.quantity} +</p>
          <p>{item.text}</p>
        </li>)}
        
      </ul>
    </section>
  )
}

export default Numbers