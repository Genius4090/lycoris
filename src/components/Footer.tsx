import { Social1, Social2, Social3, Social4, Social5 } from "../assets/icons"
import {Title } from "../components"

const Footer = () => {
  const SocialList:{id:number,img:string}[] = [
    {
      id:1,
      img: Social1
    },
    {
      id:2,
      img: Social2
    },
    {
      id:3,
      img: Social3
    },
    {
      id:4,
      img: Social4
    },
    {
      id:5,
      img: Social5
    }
  ]
  return (
    <section className="flex flex-col items-center pt-20 pb-4 max-w-[670px] mx-auto">
      <Title extraClass="max-w-200">Stay Connected: Follow Our Floral Journey</Title>
      <p className="max-w-120 text-center mt-10 font-light text-title">Stay updated with the latest floral trends, exclusive offers, and special deals delivered straight to your inbox.</p>
     <div className="flex items-center gap-4 mt-5">
      <input type="text" className="outline-none py-2 px-2 w-[386px] border border-brownish" placeholder=""/>
      <button className="bg-brownish py-2 px-6 border border-brownish text-title font-liter cursor-pointer">Send</button>
     </div>
     <div className="flex items-center gap-4 mt-12">
      {SocialList.map(item => 
        <div key={item.id} className=" rounded-lg bg-pinkish w-[36px] h-[36px] flex items-center justify-center cursor-pointer" >
          <img key={item.id} src={item.img} alt="social-icon" />
        </div>
      )} 
     </div>
     <div className="border border-brownish my-8 w-full"></div>
     <p className="text-title font-light text-[15px]">Lycoris ©Copyright 2026. All rights reserved. </p>
    </section>
  )
}

export default Footer