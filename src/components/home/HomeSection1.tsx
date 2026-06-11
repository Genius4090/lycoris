import { HomeImg2 } from "../../assets/images"
import Title from "../Title"
import { useTranslation } from "react-i18next"
import { motion } from "motion/react"

const ease = [0.22, 1, 0.36, 1] as const

const HomeSection1 = () => {
  const { t } = useTranslation()
  const hours: string[] = t("section1.hours", { returnObjects: true }) as string[]

  return (
    <section className="w-full h-screen flex flex-col items-center relative justify-center mt-30">
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease }}
      >
        <Title extraClass="max-w-[900px]">{t("section1.title")}</Title>
      </motion.div>

      <div className="flex gap-10 mt-20">
        <motion.img
          src={HomeImg2}
          alt="home-section-1-img"
          initial={{ opacity: 0, x: -48 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, ease }}
        />
        <motion.div
          initial={{ opacity: 0, x: 48 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, ease, delay: 0.1 }}
        >
          <div className="py-5">
            <div className="w-full">
              <h3 className="font-liter text-title text-3xl font-medium">{t("section1.storeLabel")}</h3>
              <p className="text-textish mt-4 mb-2 whitespace-pre-line">{t("section1.storeAddress")}</p>
            </div>
          </div>
          <ul className="flex flex-col gap-2">
            {hours.map(item => <li key={item} className="text-textish">{item}</li>)}
          </ul>
        </motion.div>
      </div>

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

export default HomeSection1
