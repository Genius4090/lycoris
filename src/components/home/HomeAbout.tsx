import { MoveLeft, MoveRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SliderImg1, SliderImg2, SliderImg3, SliderImg4 } from "../../assets/images";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import SideDecor from "../SideDecor";

const ease = [0.22, 1, 0.36, 1] as const;
const imagesList = [SliderImg1, SliderImg2,SliderImg3,SliderImg4];

export default function Homeabout() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { t } = useTranslation();
  const goTo = (next: number, dir: "left" | "right") => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(next);
      setAnimating(false);
    }, 400);
  };

  const prev = () => goTo((current - 1 + imagesList.length) % imagesList.length, "left");
  const next = () => goTo((current + 1) % imagesList.length, "right");

  // Auto-advance every 3.5s
  useEffect(() => {
    timerRef.current = setTimeout(() => next(), 3500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current]);

  const slideClass = animating
    ? direction === "right"
      ? "opacity-0 -translate-x-6"
      : "opacity-0 translate-x-6"
    : "opacity-100 translate-x-0";

  return (
    <section className="w-full min-h-screen relative flex flex-col items-center gap-20 md:gap-40 mb-20 md:mb-60 px-4">
      {/* Title fades up */}
      <motion.span
        className="text-title max-w-[90vw] md:max-w-180 font-liter text-center text-xl md:text-3xl leading-[40px] md:leading-[50px] px-4"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease }}
      >
        {t("homeAbout.title")}
      </motion.span>

      {/* Slider fades in */}
      <motion.div
        className="flex items-center gap-6 md:gap-20"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.85, ease, delay: 0.1 }}
      >
        {/* Prev */}
        <button onClick={prev} aria-label="Previous image" className="cursor-pointer shrink-0">
          <MoveLeft className="text-title w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 hover:text-textish transition-colors duration-200" />
        </button>

        {/* Image */}
        <div className="w-[240px] h-[240px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] relative">
          <img
            key={current}
            src={imagesList[current]}
            alt={`slide-${current}`}
            className={`w-full h-full object-cover rotate-5 transition-all duration-400 ease-in-out ${slideClass}`}
          />
        </div>

        {/* Next */}
        <button onClick={next} aria-label="Next image" className="cursor-pointer shrink-0">
          <MoveRight className="text-title w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 hover:text-textish transition-colors duration-200" />
        </button>
      </motion.div>

      {/* Dots */}
      <motion.div
        className="flex items-center gap-2 -mt-16 sm:-mt-24 md:-mt-32"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease, delay: 0.25 }}
      >
        {imagesList.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? "right" : "left")}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              i === current
                ? "bg-brownish w-5 h-1.5"
                : "bg-brownish/30 w-1.5 h-1.5 hover:bg-brownish/60"
            }`}
          />
        ))}
      </motion.div>

      <SideDecor />
    </section>
  );
}
