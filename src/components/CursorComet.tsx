import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const HOVER_SELECTOR =
  'a, button, [role="button"], [role="link"], input, select, textarea, label, [data-cursor="hover"]';

// How fast the ring chases the cursor (0 = never, 1 = instant)
const RING_EASE = 0.12;

/**
 * Warm-toned custom cursor:
 *  • A crisp dot that follows the pointer exactly
 *  • A softly-trailing ring that eases behind and blooms on hover
 *
 * Hidden on touch devices and under prefers-reduced-motion.
 */
export default function CursorComet() {
  const [mounted, setMounted] = useState(false);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  // Track whether media query says reduced motion
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Detect touch-primary device
  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: none)").matches;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || reduced || isTouch) return;

    let mx = -200;
    let my = -200;
    let rx = -200;
    let ry = -200;
    let visible = false;
    let hover = false;

    const setVisible = (v: boolean) => {
      if (visible === v) return;
      visible = v;
      const op = v ? "1" : "0";
      if (dotRef.current) dotRef.current.style.opacity = op;
      if (ringRef.current) ringRef.current.style.opacity = op;
    };

    const setHover = (v: boolean) => {
      if (hover === v) return;
      hover = v;
      // Dot: slightly larger + brighter on hover
      if (dotRef.current) {
        dotRef.current.style.width = v ? "10px" : "7px";
        dotRef.current.style.height = v ? "10px" : "7px";
        dotRef.current.style.backgroundColor = v ? "#e8e0d5" : "#DBCCBA";
      }
      // Ring: bloom outward + warm fill on hover
      if (ringRef.current) {
        ringRef.current.style.width = v ? "56px" : "36px";
        ringRef.current.style.height = v ? "56px" : "36px";
        ringRef.current.style.borderColor = v
          ? "rgba(219,204,186,0.85)"
          : "rgba(219,204,186,0.55)";
        ringRef.current.style.backgroundColor = v
          ? "rgba(219,204,186,0.07)"
          : "transparent";
      }
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      setHover(!!(e.target as Element | null)?.closest?.(HOVER_SELECTOR));
    };

    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) setVisible(false);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);

    let raf = 0;
    const tick = () => {
      // Dot — snaps exactly to cursor
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`;
      }
      // Ring — eased trailing
      rx += (mx - rx) * RING_EASE;
      ry += (my - ry) * RING_EASE;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.body.classList.remove("custom-cursor-active");
    };
  }, [mounted, reduced, isTouch]);

  if (!mounted || reduced || isTouch) return null;

  return createPortal(
    <div aria-hidden className="pointer-events-none fixed inset-0 z-9999">
      {/* Dot — exact position */}
      <div
        ref={dotRef}
        className="absolute left-0 top-0 opacity-0"
        style={{
          width: "7px",
          height: "7px",
          borderRadius: "9999px",
          backgroundColor: "#DBCCBA",
          transform: "translate3d(-200px,-200px,0) translate(-50%,-50%)",
          transition: "opacity 150ms, width 220ms cubic-bezier(0.22,1,0.36,1), height 220ms cubic-bezier(0.22,1,0.36,1), background-color 220ms",
          willChange: "transform",
        }}
      />
      {/* Ring — trailing */}
      <div
        ref={ringRef}
        className="absolute left-0 top-0 opacity-0"
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "9999px",
          border: "1.5px solid rgba(219,204,186,0.55)",
          transform: "translate3d(-200px,-200px,0) translate(-50%,-50%)",
          transition:
            "opacity 200ms, width 320ms cubic-bezier(0.22,1,0.36,1), height 320ms cubic-bezier(0.22,1,0.36,1), border-color 320ms, background-color 320ms",
          willChange: "transform",
        }}
      />
    </div>,
    document.body
  );
}
