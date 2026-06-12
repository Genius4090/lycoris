import { SocialImg1, SocialImg2, SocialImg3 } from "../../assets/images"
import Title from "../Title"
import { useTranslation } from "react-i18next"
import { motion } from "motion/react"

const ease = [0.22, 1, 0.36, 1] as const

const HomeSocial = () => {
  const { t } = useTranslation()
  const imageList: string[] = [SocialImg1, SocialImg2, SocialImg3]
  return (
    <section className="w-full my-20 flex flex-col  md:my-40 items-center justify-center px-4">
      <motion.p
        className="text-base md:text-lg text-textish font-medium"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease }}
      >
        {t("social.handle")}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.85, ease, delay: 0.1 }}
      >
        <Title extraClass="font-light w-full max-w-[90vw] md:w-160">{t("social.title")}</Title>
      </motion.div>
      <div className="flex flex-wrap justify-center gap-4 md:gap-7 mt-10">
        {imageList.map((item, i) => (
          <motion.img
            key={i}
            src={item}
            alt="social-img"
            className="hover:scale-105 duration-300 w-full sm:w-[130px] md:w-[320px]"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease, delay: i * 0.1 }}
          />
        ))}
      </div>
    </section>
  )
}

export default HomeSocial
