import { useTranslation } from "react-i18next";

const verticalTextStyle: React.CSSProperties = {
  writingMode: "vertical-rl",
  textOrientation: "mixed",
  fontSize: "10px",
  letterSpacing: "0.28em",
};

/**
 * Decorative vertical-text labels shown on both sides of full-screen sections.
 * Hidden on mobile by default (pass `alwaysVisible` to override).
 */
const SideDecor = ({ alwaysVisible = false }: { alwaysVisible?: boolean }) => {
  const { t } = useTranslation();
  const visibility = alwaysVisible ? "flex" : "hidden sm:flex";

  return (
    <section className="hidden lg:flex">
      {/* Left */}
      <div
        aria-hidden
        className={`pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 z-10 ${visibility} flex-col items-center justify-center`}
        style={{ width: "52px" }}
      >
        <span
          className="font-sora text-white/20 font-light tracking-[0.28em] select-none"
          style={{ ...verticalTextStyle, transform: "rotate(180deg)" }}
        >
          {t("home.leftDecor")}
        </span>
      </div>

      {/* Right */}
      <div
        aria-hidden
        className={`pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 z-10 ${visibility} flex-col items-center justify-center`}
        style={{ width: "52px" }}
      >
        <span
          className="font-sora text-white/20 font-light tracking-[0.28em] select-none"
          style={verticalTextStyle}
        >
          {t("home.rightDecor")}
        </span>
      </div>
    </section>
  );
};

export default SideDecor;
