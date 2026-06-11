import FlowerImg from "../assets/icons/flower.svg";
import { HomeSection1, HomeSocial } from "../components/home";
import { HomeAd, HomeBanner1, HomeBanner2 } from "../components";
import { useTranslation } from "react-i18next";
const Home = () => {
  const { t } = useTranslation();
  return (
    <>
      {/* ── Noise texture overlay ── */}

      <section className="homepage relative h-screen  overflow-x-hidden flex flex-col items-center justify-center">
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 -mt-16">
          {/* ── FLOWERS title row ── */}
          <div className="relative flex items-center justify-center ">
            {/* Radial glow behind the rose — sits at the "O" position */}
            {/* "FL" */}
            <span
              className="relative z-10 font-liter font-light text-white select-none tracking-wider leading-none"
              style={{
                fontSize: "clamp(80px, 14vw, 168px)",
                textShadow: "0 2px 40px rgba(0,0,0,0.6)",
              }}
            >
              FL
            </span>

            {/* Rose image — replaces the "O" */}
            <div
              className="relative z-10 flex items-center justify-center"
              style={{
                width: "clamp(140px, 21vw, 260px)",
                height: "clamp(140px, 21vw, 260px)",
                marginTop: "clamp(8px, 2vw, 24px)",
                marginLeft: "clamp(-60px, -7.5vw, -95px)",
                marginRight: "clamp(-60px, -7.5vw, -95px)",
              }}
            >
              <img
                src={FlowerImg}
                alt="rose"
                className="w-full h-full object-contain z-10 drop-shadow-[0_0_32px_rgba(200,110,10,0.7)]"
                style={{
                  filter:
                    "drop-shadow(0 0 24px rgba(200,100,5,0.65)) drop-shadow(0 0 6px rgba(240,160,30,0.4))",
                }}
              />
        
            </div>

            {/* "WERS" */}
            <span
              className="relative z-10 font-liter font-light text-white select-none tracking-wide leading-none"
              style={{
                fontSize: "clamp(80px, 14vw, 168px)",
                textShadow: "0 2px 40px rgba(0,0,0,0.6)",
              }}
            >
              WERS
            </span>
          </div>

          {/* ── Subtitle ── */}
          <p className=" text-white/50 font-liter font-light text-center mt-5 leading-relaxed max-w-70">
            {t("home.subtitle")}
          </p>

          {/* ── CTA ── */}
          <span className="font-liter mt-20 text-white border-b group-hover:text-white text-[40px] transition-colors duration-300">
            {t("home.cta")}
          </span>
        </div>
        
        {/* ══════════ SIDE DECORATIVE SPANS ══════════ */}
        {/* Left side — vertical text + glow */}{" "}
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
        {/* Right side — vertical text + glow */}
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
      <HomeBanner1 />
      <HomeSection1 />
      <HomeSocial />
      <HomeBanner2 />
      <HomeAd />
    </>
  );
};

export default Home;
