import Title from "../Title"
import "./home.css"
import { useTranslation } from "react-i18next"
import { motion } from "motion/react"

const ease = [0.22, 1, 0.36, 1] as const

const HomeBanner2 = () => {
  const { t } = useTranslation()
  return (
    <section className="w-full h-screen home-banner-2 flex flex-col items-center justify-center gap-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease }}
      >
        <Title extraClass="text-white font-light max-w-[530px]">{t("banner2.title")}</Title>
      </motion.div>
      <motion.p
        className="font-liter text-white max-w-[820px] text-center text-lg"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.85, ease, delay: 0.15 }}
      >
        {t("banner2.description")}
      </motion.p>
    </section>
  )
}

export default HomeBanner2
