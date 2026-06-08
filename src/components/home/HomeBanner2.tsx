import Title from "../Title"
import "./home.css"
const HomeHero = () => {
  return (
    <section className="w-full h-screen home-banner-2 flex flex-col items-center justify-center gap-10">
        <Title extraClass="text-white font-light max-w-[530px]">Flowers That Speak Your Emotions</Title>
        <p className="font-liter text-white max-w-[820px] text-center text-lg">Be the first to know about our exciting events, exclusive offers, and new arrivals. Join our floral community and let us fill your feed with beauty and botanical wonders. Follow us today and embark on a blooming journey that will ignite your passion for all things floral.</p>
    </section>
  )
}

export default HomeHero