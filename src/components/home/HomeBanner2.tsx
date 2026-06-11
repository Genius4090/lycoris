import Title from "../Title"
import "./home.css"
import { useTranslation } from "react-i18next"

const HomeBanner2 = () => {
  const { t } = useTranslation()
  return (
    <section className="w-full h-screen home-banner-2 flex flex-col items-center justify-center gap-10">
        <Title extraClass="text-white font-light max-w-[530px]">{t("banner2.title")}</Title>
        <p className="font-liter text-white max-w-[820px] text-center text-lg">{t("banner2.description")}</p>
    </section>
  )
}

export default HomeBanner2
