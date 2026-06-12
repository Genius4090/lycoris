import { Banner, Button, Numbers, PopularBanner, Title } from "../../components"
import AboutInfo from "./AboutInfo"
import { useTranslation } from "react-i18next"
import { motion } from "motion/react"
import SideDecor from "../../components/SideDecor"

const About = () => {
  const { t } = useTranslation()

  return (
    <section className="pt-28 md:pt-50 flex flex-col items-center relative px-4">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <Title extraClass="max-w-[90vw] md:max-w-[810px]">{t("about.title")}</Title>
      </motion.div>
      <motion.p
        className="text-textish max-w-[613px] text-center leading-6.5 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      >
        {t("about.description")}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.28 }}
      >
        <Button extraClass="mt-8">{t("about.catalogBtn")}</Button>
      </motion.div>
      <Numbers/>
      <Banner/>
      <AboutInfo/>
      <PopularBanner/>

      <SideDecor alwaysVisible />
    </section>
  )
}

export default About
