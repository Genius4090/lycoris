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
<section className="homepage relative h-screen flex flex-col items-center justify-center">


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
