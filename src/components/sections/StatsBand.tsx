"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "motion/react";
import type { Locale } from "@/i18n/config";
import { stats } from "@/data/content";
import { Container } from "@/components/ui/Container";

export function StatsBand({ locale }: { locale: Locale }) {
  return (
    <section className="bg-[var(--color-ink)] text-[var(--color-paper)] py-20 md:py-28 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 30% 50%, rgba(74,86,64,0.4) 0%, transparent 70%)",
        }}
      />

      <Container className="relative">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {stats.map((s, idx) => (
            <motion.div
              key={s.labelEs}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
              className="flex flex-col gap-3"
            >
              <CountUp value={s.value} suffix={s.suffix} />
              <div className="text-sm tracking-wide text-[var(--color-paper)]/85 uppercase">
                {locale === "es" ? s.labelEs : s.labelEn}
              </div>
              <div className="h-px w-12 bg-[var(--color-paper)]/30 mt-1" />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(v) {
        setDisplay(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <div className="flex items-baseline gap-1">
      <span
        ref={ref}
        className="font-[family-name:var(--font-display)] text-6xl md:text-7xl text-[var(--color-paper)] tabular-nums"
      >
        {display}
      </span>
      <span className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-paper)]/90">
        {suffix}
      </span>
    </div>
  );
}
