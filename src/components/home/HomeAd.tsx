import { Flower17, Flower16 } from "../../assets/images"
import Title from "../Title"
import { useTranslation } from "react-i18next"
import { motion } from "motion/react"

const ease = [0.22, 1, 0.36, 1] as const

type Flower = {
    id: number,
    contentKey: string,
    img: string,
    off: number
}

const HomeAd = () => {
  const { t } = useTranslation()

  const flowerList: Flower[] = [
    { id: 1, contentKey: "ad.item1", img: Flower17, off: 20 },
    { id: 2, contentKey: "ad.item2", img: Flower16, off: 17 },
  ]

  return (
    <section className="w-full min-h-screen relative flex flex-col items-center justify-center gap-6 md:gap-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease }}
      >
        <Title extraClass="max-w-[90vw] md:max-w-[720px]">{t("ad.title")}</Title>
      </motion.div>
      <motion.p
        className="max-w-[90vw] md:max-w-[700px] text-center font-liter text-title text-sm md:text-base"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease, delay: 0.12 }}
      >
        {t("ad.description")}
      </motion.p>
      <ul className="flex flex-wrap justify-center gap-8 md:gap-10 mt-6 md:mt-8">
        {flowerList.map((item, i) => (
          <motion.li
            key={item.id}
            className="relative"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease, delay: i * 0.14 }}
          >
            <span className="bg-[#F7FF00] px-2 py-0.5 absolute -top-4 -right-5 font-liter">{item.off}%</span>
            <img src={item.img} alt={t(item.contentKey)} className="w-[140px] sm:w-[180px] md:w-auto" />
            <p className="mt-5 text-center font-liter text-lg md:text-xl text-title">{t(item.contentKey)}</p>
          </motion.li>
        ))}
      </ul>

      {/* ══════════ SIDE DECORATIVE SPANS ══════════ */}
      {/* Left side */}
      <div
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center"
        style={{ width: "52px" }}
      >
        <span
          className="font-sora text-white/20 font-light tracking-[0.28em] select-none"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            transform: "rotate(180deg)",
            fontSize: "10px",
            letterSpacing: "0.28em",
          }}
        >
          {t("home.leftDecor")}
        </span>
      </div>
      {/* Right side */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center"
        style={{ width: "52px" }}
      >
        <span
          className="font-sora text-white/20 font-light tracking-[0.28em] select-none"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            fontSize: "10px",
            letterSpacing: "0.28em",
          }}
        >
          {t("home.rightDecor")}
        </span>
      </div>
    </section>
  )
}

export default HomeAd
