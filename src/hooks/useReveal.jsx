import { useEffect, useRef, useState } from "react";

/**
 * useReveal — reveal-on-scroll visibility via native IntersectionObserver.
 * Zero dependencies (no framer-motion). Pairs with the .reveal/.revealed
 * helper classes in src/index.css, which declare the hidden state only
 * inside @media (prefers-reduced-motion: no-preference) so content is
 * never invisible when JS or motion is unavailable.
 *
 * @param {Object}   [options]
 * @param {boolean}  [options.once=true]         - Stay revealed after first intersection.
 * @param {number}   [options.threshold=0.15]    - IntersectionObserver threshold.
 * @param {string}   [options.rootMargin='0px 0px -40px 0px'] - Root margin.
 * @returns {{ ref: import("react").RefObject, revealed: boolean }}
 */
export function useReveal({ once = true, threshold = 0.15, rootMargin = "0px 0px -40px 0px" } = {}) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    // Fallback: no IntersectionObserver (or JS-only edge cases) -> show immediately.
    if (typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return undefined;
    }

    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setRevealed(false);
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold, rootMargin]);

  return { ref, revealed };
}

/**
 * Reveal — tiny wrapper that wires useReveal to the .reveal helper class.
 *
 * @param {string}  [as="div"]      - Element/tag to render.
 * @param {number}  [delay=0]       - Stagger index -> style { "--i": delay } (70ms steps in CSS).
 * @param {string}  [className=""]  - Extra classes, merged with reveal/revealed.
 */
export function Reveal({ as = "div", delay = 0, className = "", children, ...rest }) {
  const { ref, revealed } = useReveal();
  const Tag = as;
  return (
    <Tag
      {...rest}
      ref={ref}
      className={className + " reveal" + (revealed ? " revealed" : "")}
      style={{ "--i": delay }}
    >
      {children}
    </Tag>
  );
}
