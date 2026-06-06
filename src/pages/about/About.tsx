import {Banner, Button, Numbers, PopularBanner, Title } from "../../components"
import AboutInfo from "./AboutInfo"


const About = () => {

 
  return (
    <section className="pt-50 flex flex-col items-center">
      <Title extraClass="max-w-[810px]">Discover Our Flower Shop's Delightful Collection</Title>
      <p className="text-[#898989] max-w-[613px] text-center leading-6.5 mt-6">Discover beautifully crafted arrangements made with love and care. Let us help you create moments that bloom with joy and elegance.</p>
      <Button extraClass="mt-6">Our Catalog</Button>
      <Numbers/>
      <Banner/>
      <AboutInfo/>
      <PopularBanner/>

    </section>
  )
}

export default About