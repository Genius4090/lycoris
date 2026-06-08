import Title from "../Title"
import "./home.css"
const HomeBanner1 = () => {
  return (
    <section className="w-full h-screen home-banner-1 flex flex-col items-center justify-center gap-10">
        <Title extraClass="text-white font-light max-w-[700px]">A Fragrant Tale: Weaving Memories with Flowers</Title>
        <p className="font-liter text-white max-w-[820px] text-center text-lg">Be the first to know about our exciting events, exclusive offers, and new arrivals. Join our floral community and let us fill your feed with beauty and botanical wonders. Follow us today and embark on a blooming journey that will ignite your passion for all things floral.</p>
    </section>
  )
}

export default HomeBanner1