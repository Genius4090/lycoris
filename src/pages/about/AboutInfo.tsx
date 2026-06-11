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
    <section className="flex flex-col items-center containers px-5">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.85, ease }}
      >
        <Title extraClass="max-w-[900px] mt-40">{t("about.info.title1")}</Title>
      </motion.div>

      <div className="flex gap-10 w-full mt-25">
        <motion.img
          src={AboutInfo1}
          alt="about-info-img1"
          initial={{ opacity: 0, x: -48 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, ease }}
        />
        <motion.div
          className="flex flex-col justify-start items-end max-w-[600px]"
          initial={{ opacity: 0, x: 48 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, ease, delay: 0.1 }}
        >
          <p className="text-title">{t("about.info.body1a")}</p>
          <p className="mt-4 text-title">{t("about.info.body1b")}</p>
          <Button extraClass="mt-20">{t("about.info.readMore")}</Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.85, ease }}
      >
        <Title extraClass="text-start text-5xl! mt-20">{t("about.info.title2")}</Title>
      </motion.div>

      <div className="flex w-full justify-between items-start gap-9 mt-25">
        <motion.div
          className="max-w-[800px]"
          initial={{ opacity: 0, x: -48 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease }}
        >
          <p className="text-title">{t("about.info.body2a")}</p>
          <p className="mt-5 text-title">{t("about.info.body2b")}</p>
          <div className="flex gap-7 mt-8">
            {ImgList.map((item, i) => (
              <motion.img
                key={item.id}
                src={item.img}
                alt="about-flower-img"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease, delay: i * 0.12 }}
              />
            ))}
          </div>
        </motion.div>
        <motion.img
          src={AboutInfo2}
          alt="about-info-img2"
          initial={{ opacity: 0, x: 48 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease, delay: 0.1 }}
        />
      </div>
    </section>
  )
}

export default AboutInfo
