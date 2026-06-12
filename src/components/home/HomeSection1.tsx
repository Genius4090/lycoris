import { HomeImg2 } from "../../assets/images"
import Title from "../Title"
import { useTranslation } from "react-i18next"
import { motion } from "motion/react"
import SideDecor from "../SideDecor"

const ease = [0.22, 1, 0.36, 1] as const

const HomeSection1 = () => {
  const { t } = useTranslation()
  const hours: string[] = t("section1.hours", { returnObjects: true }) as string[]

  return (
    <section className="w-full  flex flex-col items-center relative justify-center mt-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease }}
      >
        <Title extraClass="max-w-[90vw] md:max-w-[900px]">{t("section1.title")}</Title>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-10 mt-10 md:mt-20 items-start">
        <motion.img
          src={HomeImg2}
          alt="home-section-1-img"
          className="w-full max-w-[400px] lg:max-w-none lg:w-auto shrink-0"
          initial={{ opacity: 0, x: -48 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, ease }}
        />
        <motion.div
          className="min-w-0 flex-1"
          initial={{ opacity: 0, x: 48 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, ease, delay: 0.1 }}
        >
          <div className="py-5">
            <div className="w-full">
              <h3 className="font-liter text-title text-2xl md:text-3xl font-medium wrap-break-word">{t("section1.storeLabel")}</h3>
              <p className="text-textish mt-4 mb-2 whitespace-pre-line text-sm md:text-base">{t("section1.storeAddress")}</p>
            </div>
          </div>
          <ul className="flex flex-col gap-2">
            {hours.map(item => <li key={item} className="text-textish text-sm md:text-base">{item}</li>)}
          </ul>
        </motion.div>
      </div>

      <SideDecor />
    </section>
  )
}

export default HomeSection1
