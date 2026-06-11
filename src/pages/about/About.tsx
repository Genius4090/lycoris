import { Banner, Button, Numbers, PopularBanner, Title } from "../../components"
import AboutInfo from "./AboutInfo"
import { useTranslation } from "react-i18next"

const About = () => {
  const { t } = useTranslation()

  return (
    <section className="pt-50 flex flex-col items-center">
      <Title extraClass="max-w-[810px]">{t("about.title")}</Title>
      <p className="text-textish max-w-[613px] text-center leading-6.5 mt-6">{t("about.description")}</p>
      <Button extraClass="mt-6">{t("about.catalogBtn")}</Button>
      <Numbers/>
      <Banner/>
      <AboutInfo/>
      <PopularBanner/>
    </section>
  )
}

export default About
