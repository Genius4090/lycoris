import FlowerImg from "../assets/icons/flower.svg";
import { HomeSection1, HomeSocial } from "../components/home";
import { HomeAd, HomeBanner1, HomeBanner2 } from "../components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { PATH } from "../constants/paths";
import Homeabout from "../components/home/HomeAbout";
import { motion } from "motion/react";

// ── Shared easing curves ──────────────────────────────────────────────────────
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const;

const Home = () => {
  const { t } = useTranslation();

  return (
    <>
      <section className="homepage relative min-h-screen overflow-x-hidden flex flex-col items-center justify-center">
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 -mt-16">

          {/* ── FLOWERS title row ── */}
          <div className="relative flex items-center justify-center">

            {/* "FL" — slides in from the left */}
            <motion.span
              className="relative z-10 font-liter font-light text-white select-none tracking-wider leading-none"
              style={{
                fontSize: "clamp(80px, 14vw, 168px)",
                textShadow: "0 2px 40px rgba(0,0,0,0.6)",
              }}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.35, ease: EASE_OUT_EXPO }}
            >
              FL
            </motion.span>

            {/* ── Rose wrapper — bloom entrance ── */}
            <motion.div
              className="relative z-10 flex items-center justify-center"
              style={{
                width: "clamp(140px, 21vw, 260px)",
                height: "clamp(140px, 21vw, 260px)",
                marginTop: "clamp(8px, 2vw, 24px)",
                marginLeft: "clamp(-60px, -7.5vw, -95px)",
                marginRight: "clamp(-60px, -7.5vw, -95px)",
              }}
              initial={{ scale: 0.3, rotate: -18, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{
                // spring gives it that organic "bloom pop"
                type: "spring",
                stiffness: 90,
                damping: 14,
                delay: 0.1,
              }}
            >
              {/* Glow disc — fades in after the rose lands */}
              <motion.div
                aria-hidden
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(200,100,5,0.55) 0%, rgba(240,160,30,0.25) 45%, transparent 72%)",
                  filter: "blur(18px)",
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1.15 }}
                transition={{ duration: 1.4, delay: 0.65, ease: EASE_OUT_QUART }}
              />

              {/* Rose image */}
              <img
                src={FlowerImg}
                alt="rose"
                className="w-full h-full object-contain z-10"
                style={{
                  filter:
                    "drop-shadow(0 0 24px rgba(200,100,5,0.65)) drop-shadow(0 0 6px rgba(240,160,30,0.4))",
                }}
              />
            </motion.div>

            {/* "WERS" — slides in from the right */}
            <motion.span
              className="relative z-10 font-liter font-light text-white select-none tracking-wide leading-none"
              style={{
                fontSize: "clamp(80px, 14vw, 168px)",
                textShadow: "0 2px 40px rgba(0,0,0,0.6)",
              }}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.35, ease: EASE_OUT_EXPO }}
            >
              WERS
            </motion.span>
          </div>

          {/* ── Subtitle — fades up after title lands ── */}
          <motion.p
            className="text-white/50 font-liter font-light text-center mt-5 leading-relaxed max-w-73"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85, ease: EASE_OUT_QUART }}
          >
            {t("home.subtitle")}
          </motion.p>

          {/* ── CTA — fades up last with an underline wipe ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.15, ease: EASE_OUT_QUART }}
          >
            <Link
              to={PATH.products}
              className="relative font-liter font-light  mt-20 text-white text-[40px] transition-colors duration-300 group inline-block"
            >
              {t("home.cta")}
              {/* animated underline wipe */}
              <motion.span
                aria-hidden
                className="absolute bottom-0 left-0 h-px bg-white/70 block"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1.5, ease: EASE_OUT_EXPO }}
              />
            </Link>
          </motion.div>
        </div>

        {/* ══════════ SIDE DECORATIVE SPANS ══════════ */}
        {/* Left side */}
        <motion.div
          className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center"
          style={{ width: "52px" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.6, ease: "easeOut" }}
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
        </motion.div>

        {/* Right side */}
        <motion.div
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center"
          style={{ width: "52px" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.6, ease: "easeOut" }}
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
        </motion.div>
      </section>

      <Homeabout />
      <HomeBanner1 />
      <HomeSection1 />
      <HomeSocial />
      <HomeBanner2 />
      <HomeAd />
    </>
  );
};

export default Home;
