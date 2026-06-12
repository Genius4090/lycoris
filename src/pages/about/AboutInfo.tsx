import { AboutFlower1, AboutFlower2, AboutFlower3, AboutInfo1, AboutInfo2 } from "../../assets/images"
import { Button, Title } from "../../components"
import { useTranslation } from "react-i18next"
import { motion } from "motion/react"

const ease = [0.22, 1, 0.36, 1] as const

const AboutInfo = () => {
  const { t } = useTranslation()

  const ImgList: { id: number; img: string }[] = [
    { id: 1, img: AboutFlower1 },
    { id: 2, img: AboutFlower2 },
    { id: 3, img: AboutFlower3 },
  ]

  return (
    <section className="flex flex-col items-center containers px-4 md:px-5">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.85, ease }}
      >
        <Title extraClass="max-w-[90vw] md:max-w-[900px] mt-20 md:mt-40">{t("about.info.title1")}</Title>
      </motion.div>

      <div className="flex flex-col items-start md:flex-row gap-8 md:gap-10 w-full mt-10 md:mt-25">
        <motion.img
          src={AboutInfo1}
          alt="about-info-img1"
          className="w-full max-w-[400px] mx-auto md:mx-0 md:w-auto"
          initial={{ opacity: 0, x: -48 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, ease }}
        />
        <motion.div
          className="flex flex-col justify-start items-start md:items-end max-w-full md:max-w-[600px]"
          initial={{ opacity: 0, x: 48 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, ease, delay: 0.1 }}
        >
          <p className="text-title">{t("about.info.body1a")}</p>
          <p className="mt-4 text-title">{t("about.info.body1b")}</p>
          <Button extraClass="mt-10 md:mt-20">{t("about.info.readMore")}</Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.85, ease }}
      >
        <Title extraClass="text-start text-3xl! md:text-5xl! mt-10 md:mt-20">{t("about.info.title2")}</Title>
      </motion.div>

      <div className="flex flex-col-reverse md:flex-row w-full justify-between items-start gap-8 md:gap-9 mt-10 md:mt-25">
        <motion.div
          className="max-w-full md:max-w-[800px]"
          initial={{ opacity: 0, x: -48 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease }}
        >
          <p className="text-title">{t("about.info.body2a")}</p>
          <p className="mt-5 text-title">{t("about.info.body2b")}</p>
        
        </motion.div>
        <motion.img
          src={AboutInfo2}
          alt="about-info-img2"
          className="w-full max-w-[400px] mx-auto md:mx-0 md:w-auto"
          initial={{ opacity: 0, x: 48 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease, delay: 0.1 }}
        />
        
      </div>
        <div className="flex flex-wrap gap-4 md:gap-7 mt-8 w-full">
            {ImgList.map((item, i) => (
              <motion.img
                key={item.id}
                src={item.img}
                alt="about-flower-img"
                className="w-[90px] sm:w-[100px] md:w-auto"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease, delay: i * 0.12 }}
              />
            ))}
          </div>
    </section>
  )
}

export default AboutInfo
