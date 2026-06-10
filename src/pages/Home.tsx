import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import { RoseImg } from "../assets/icons";
import { Trans, useTranslation } from "react-i18next";
import { HomeSection1, HomeSocial } from "../components/home";
import { HomeAd, HomeBanner1, HomeBanner2 } from "../components";
const Home = () => {
  const { t } = useTranslation()
  return (
<>

  

      {/* ── Noise texture overlay ── */}
    
<section className="homepage relative h-screen bg-[#100d0a] overflow-x-hidden flex flex-col items-center justify-center">
  <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.18]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

    <span className="font-liter text-title italic text-center leading-tight max-w-260 text-8xl">
  <Trans
  className="font-liter text-title italic text-center leading-tight max-w-260 text-8xl"
    i18nKey="home.title"
    components={[
      <img src={RoseImg} alt="rose-image" className="inline-block hover:rotate-360 duration-1000 p-1" width={83} height={83}/>
    ]}
  />
</span>
     
    <p className="text-title font-liter italic max-w-185 mt-5 leading-7.5 text-center text-xl">
   {t("home.description")}
      </p>
      <Link to={"/catalog"} className="flex flex-col items-center mt-8">
      <p className="text-title cursor-pointer py-2 font-liter italic text-xl">{t("home.button")}</p>
      <MoveRight className=""/>
      </Link>
    </section>
    <HomeBanner1/>
    <HomeSection1/>
    <HomeSocial/>
    <HomeBanner2/>
    <HomeAd/>

</>

    
  );
};

export default Home;
