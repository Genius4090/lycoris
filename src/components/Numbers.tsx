import { useTranslation } from "react-i18next"
import CountUp from "./CountUp"
import { motion } from "motion/react"

const Numbers = () => {
  const { t } = useTranslation()

  const InfoList = [
    { id: 1, quantity: 12500,from : 8000, labelKey: "about.numbers.bouquets" },
    { id: 2, quantity: 3400,from : 2000,  labelKey: "about.numbers.deliveries" },
    { id: 3, quantity: 2100,from : 1000,  labelKey: "about.numbers.reviews" },
  ]

  return (
    <section className="mt-10 mb-10 flex flex-col items-center">
      <motion.div
        className="relative mt-10"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-[40px] text-title font-liter italic text-center">{t("about.numbers.heading")}</p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-4 md:gap-10">
        {InfoList.map((item, i) => (
          <motion.div
            key={item.id}
            className="flex flex-col items-center justify-center py-10 gap-5 p-4"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: i * 0.13 }}
          >
            <span
              className="font-liter text-[56px] leading-none text-title"
              style={{ textShadow: '0 0 40px rgba(200,80,5,0.4)' }}
            >
              <CountUp
                from={item.from}
                to={item.quantity}
                separator=","
                direction="up"
                duration={0.5}
                className="count-up-text font-liter"
                delay={0}
              /> +
            </span>
            <span className="font-sora text-[11px] uppercase tracking-[0.2em] text-textish mt-1">
              {t(item.labelKey)}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default Numbers
