import FlowerImg from "../assets/icons/flower.png";

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
        <div className="relative z-10 flex flex-col items-center justify-center px-4 -mt-16 w-full">
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
              className="relative z-10 flex items-center justify-center select-none pointer-events-none"
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
                type: "spring",

                stiffness: 90,

                damping: 14,

                delay: 0.1,
              }}
            >
              {/* Glow disc */}

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
                transition={{
                  duration: 1.4,
                  delay: 0.65,
                  ease: EASE_OUT_QUART,
                }}
              />

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

          {/* ── Thin rule + subtitle ── */}

          <motion.div
            className="flex flex-col items-center gap-5 mt-8 md:mt-10"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85, ease: EASE_OUT_QUART }}
          >
            {/* decorative rule */}

            <div className="flex items-center gap-4 w-full max-w-sm md:max-w-md">
              <motion.span
                className="flex-1 h-px bg-white/15"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1.05, ease: EASE_OUT_EXPO }}
                style={{ originX: 1 }}
              />

              <motion.span
                className="w-1 h-1 rounded-full bg-brownish/60"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.35, delay: 0.95, ease: EASE_OUT_QUART }}
              />

              <motion.span
                className="flex-1 h-px bg-white/15"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1.05, ease: EASE_OUT_EXPO }}
                style={{ originX: 0 }}
              />
            </div>

            <p className="text-white/45 font-liter italic text-center text-sm sm:text-base md:text-lg max-w-[76vw] sm:max-w-xs md:max-w-lg leading-relaxed tracking-wide">
              {t("home.subtitle")}
            </p>
          </motion.div>

          {/* ── CTA ── */}

          <motion.div
            className="mt-10 sm:mt-12 md:mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1, ease: EASE_OUT_QUART }}
          >
            <Link
              to={PATH.products}
              className="group relative overflow-hidden inline-flex items-center gap-4 px-14 py-4  transition-all duration-500"
            >
              {/* top-left corner → expands to full top and left edges */}
              <span className="pointer-events-none absolute top-0 left-0 w-5 h-5 group-hover:w-full group-hover:h-full border-t border-l border-white/40 group-hover:border-brownish/80 transition-all duration-500 ease-out" />
              {/* bottom-right corner → expands to full bottom and right edges */}
              <span className="pointer-events-none absolute bottom-0 right-0 w-5 h-5 group-hover:w-full group-hover:h-full border-b border-r border-white/40 group-hover:border-brownish/80 transition-all duration-500 ease-out" />

              <span className="font-sora text-xs uppercase tracking-[0.28em] text-white/60 group-hover:text-white/95 transition-colors duration-300">
                {t("home.cta")}
              </span>
            </Link>
          </motion.div>

         
        </div>

        {/* ── Side decor ── */}

        <motion.div
          className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 z-10 hidden sm:flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.6, ease: "easeOut" }}
        >
          <span
            className="font-sora text-white/15 font-light select-none"
            style={{
              writingMode: "vertical-rl",

              textOrientation: "mixed",

              transform: "rotate(180deg)",

              fontSize: "9px",

              letterSpacing: "0.32em",
            }}
          >
            {t("home.leftDecor")}
          </span>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 z-10 hidden sm:flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.6, ease: "easeOut" }}
        >
          <span
            className="font-sora text-white/15 font-light select-none"
            style={{
              writingMode: "vertical-rl",

              textOrientation: "mixed",

              fontSize: "9px",

              letterSpacing: "0.32em",
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
