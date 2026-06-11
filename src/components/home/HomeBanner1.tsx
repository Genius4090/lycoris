import Title from "../Title"
import "./home.css"
import { useTranslation } from "react-i18next"

const HomeBanner1 = () => {
  const { t } = useTranslation()
  return (
    <section className="w-full h-screen home-banner-1 flex flex-col items-center justify-center gap-10">
        <Title extraClass="text-white font-light max-w-[700px]">{t("banner1.title")}</Title>
        <p className="font-liter text-white max-w-[820px] text-center text-lg">{t("banner1.description")}</p>
    </section>
  )
}

export default HomeBanner1
