"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Droplets,
  Flame,
  Loader2,
  Mountain,
  RotateCcw,
  Wind,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import {
  fourElements,
  type ElementInfo,
  type ElementKey,
} from "@/data/content";
import { elementTest, elementVerdict, elementGap } from "@/data/elementTest";
import { getNextExperience, isEarlyAccessActive } from "@/data/experiences";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Elem = Exclude<ElementKey, "eter">;

const ICONS: Record<Elem, LucideIcon> = {
  agua: Droplets,
  fuego: Flame,
  aire: Wind,
  tierra: Mountain,
};

const ORDER: Elem[] = ["tierra", "fuego", "agua", "aire"];

export function ElementTest({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const [step, setStep] = React.useState(0); // 0…n-1 preguntas, n = resultado
  const [answers, setAnswers] = React.useState<(Elem | null)[]>(
    () => elementTest.map(() => null),
  );

  const total = elementTest.length;
  const done = step >= total;

  function choose(qIdx: number, key: Elem) {
    setAnswers((prev) => {
      const nextAnswers = [...prev];
      nextAnswers[qIdx] = key;
      return nextAnswers;
    });
    window.setTimeout(() => setStep((s) => s + 1), 160);
  }

  function restart() {
    setAnswers(elementTest.map(() => null));
    setStep(0);
  }

  const scores = React.useMemo(() => {
    const acc: Record<Elem, number> = { tierra: 0, fuego: 0, agua: 0, aire: 0 };
    for (const a of answers) if (a) acc[a] += 1;
    return acc;
  }, [answers]);

  const ranked = React.useMemo(
    () => [...ORDER].sort((a, b) => scores[b] - scores[a]),
    [scores],
  );

  if (done) {
    return (
      <Result
        locale={locale}
        scores={scores}
        ranked={ranked}
        total={total}
        onRestart={restart}
      />
    );
  }

  const q = elementTest[step];
  const progress = Math.round((step / total) * 100);

  return (
    <Container className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        {/* Progreso */}
        <div className="flex items-center gap-4 mb-10">
          <div className="text-[0.7rem] tracking-[0.2em] uppercase text-[var(--color-muted)] tabular-nums">
            {String(step + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
          <div className="flex-1 h-px bg-[var(--color-line)] relative">
            <motion.div
              className="absolute inset-y-0 left-0 bg-[var(--color-ink)]"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {es ? "Atrás" : "Back"}
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="display-3 text-balance mb-10">{es ? q.es : q.en}</h2>

            <div className="grid gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
              {q.options.map((o) => {
                const selected = answers[step] === o.key;
                return (
                  <button
                    key={o.key}
                    type="button"
                    onClick={() => choose(step, o.key)}
                    className={cn(
                      "group text-left bg-[var(--color-paper)] px-6 py-5 flex items-center justify-between gap-5 transition-colors",
                      selected
                        ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                        : "hover:bg-[var(--color-paper-warm)]",
                    )}
                  >
                    <span className="text-[1.02rem] leading-snug">
                      {es ? o.es : o.en}
                    </span>
                    <span
                      className={cn(
                        "h-6 w-6 shrink-0 border rounded-full flex items-center justify-center transition-colors",
                        selected
                          ? "border-[var(--color-paper)]"
                          : "border-[var(--color-line)] group-hover:border-[var(--color-ink)]",
                      )}
                    >
                      {selected && <Check className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <p className="mt-8 text-sm text-[var(--color-muted)]">
          {es
            ? "No hay respuestas correctas. Elige la que más se parece a cómo lideras hoy, no a como te gustaría liderar."
            : "There are no right answers. Pick the one closest to how you lead today, not how you'd like to lead."}
        </p>
      </div>
    </Container>
  );
}

function Result({
  locale,
  scores,
  ranked,
  total,
  onRestart,
}: {
  locale: Locale;
  scores: Record<Elem, number>;
  ranked: Elem[];
  total: number;
  onRestart: () => void;
}) {
  const es = locale === "es";
  const dominant = ranked[0];
  const support = ranked[1];
  const gap = ranked[ranked.length - 1];

  const info = (k: Elem) =>
    fourElements.find((e) => e.key === k) as ElementInfo;
  const dom = info(dominant);
  const Icon = ICONS[dominant];

  const next = getNextExperience();
  const early = next ? isEarlyAccessActive(next) : false;
  const experiencesBase = `/${locale}/${es ? "retiros" : "retreats"}`;
  const nextHref = next ? `${experiencesBase}/${next.slug}` : experiencesBase;

  return (
    <>
      {/* Veredicto */}
      <section
        className="py-20 md:py-28 text-[var(--color-paper)]"
        style={{ background: dom.accentInk }}
      >
        <Container>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <Icon className="h-5 w-5" strokeWidth={1.5} />
              <span className="text-[0.7rem] tracking-[0.22em] uppercase">
                {es ? "Tu elemento dominante" : "Your dominant element"}
              </span>
            </div>
            <h1 className="display-1 mb-6 text-[var(--color-paper)]">
              {es ? dom.nameEs : dom.nameEn}
            </h1>
            <p className="text-xl md:text-2xl font-[family-name:var(--font-display)] italic mb-8">
              {es ? dom.qualityEs : dom.qualityEn}
            </p>
            <p className="text-lg leading-relaxed text-[var(--color-paper)]/95">
              {es ? elementVerdict[dominant].es : elementVerdict[dominant].en}
            </p>

            {/* Reparto de los cuatro */}
            <div className="mt-12 grid sm:grid-cols-4 gap-px bg-[var(--color-paper)]/20 border border-[var(--color-paper)]/20">
              {ORDER.map((k) => {
                const El = ICONS[k];
                const pct = Math.round((scores[k] / total) * 100);
                return (
                  <div
                    key={k}
                    className="px-5 py-4"
                    style={{ background: dom.accentInk }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <El className="h-3.5 w-3.5 opacity-80" strokeWidth={1.5} />
                      <span className="text-[0.65rem] tracking-[0.18em] uppercase opacity-85">
                        {es ? info(k).nameEs : info(k).nameEn}
                      </span>
                    </div>
                    <div className="font-[family-name:var(--font-display)] text-2xl tabular-nums">
                      {pct}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* Lectura completa */}
      <Container className="py-16 md:py-24">
        <div className="max-w-3xl grid gap-10">
          <div>
            <div className="eyebrow text-[var(--color-muted)] mb-3">
              {es ? "Tu apoyo" : "Your support"}
            </div>
            <h2 className="display-3 mb-4">
              {es ? info(support).nameEs : info(support).nameEn}
            </h2>
            <p className="text-[var(--color-ink-soft)] leading-relaxed">
              {es ? info(support).cultivaEs : info(support).cultivaEn}
            </p>
          </div>

          <div className="border-t border-[var(--color-line)] pt-10">
            <div className="eyebrow text-[var(--color-muted)] mb-3">
              {es ? "Tu siguiente trabajo" : "Your next work"}
            </div>
            <h2 className="display-3 mb-4">
              {es ? info(gap).nameEs : info(gap).nameEn}
            </h2>
            <p className="text-[var(--color-ink-soft)] leading-relaxed">
              {es ? elementGap[gap].es : elementGap[gap].en}
            </p>
          </div>

          <ResultCapture locale={locale} dominant={dominant} />

          {/* Puente a la venta */}
          {next && (
            <div className="border border-[var(--color-line)] bg-[var(--color-paper-warm)] p-8 md:p-10">
              <div className="eyebrow text-[var(--color-muted)] mb-4">
                {es ? "Dónde se trabaja esto" : "Where this gets worked"}
              </div>
              <h3 className="display-3 mb-3">{next.title}</h3>
              <p className="text-[var(--color-ink-soft)] leading-relaxed mb-2">
                {es ? next.lead.es : next.lead.en}
              </p>
              <p className="text-sm text-[var(--color-muted)] mb-7">
                {es ? next.dateLabel.es : next.dateLabel.en} ·{" "}
                {es ? next.location.es : next.location.en} ·{" "}
                {es ? `${next.seats} lugares` : `${next.seats} seats`}
                {early && next.earlyLabel && (
                  <>
                    {" · "}
                    <span className="text-[var(--color-gold-deep)]">
                      {es ? next.earlyLabel.es : next.earlyLabel.en}
                    </span>
                  </>
                )}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button href={nextHref} size="md" variant="primary" trailingArrow>
                  {next.ctaMode === "checkout"
                    ? es
                      ? "Reserva tu lugar"
                      : "Reserve your seat"
                    : es
                      ? "Solicita tu invitación"
                      : "Request an invitation"}
                </Button>
                <Button href={experiencesBase} size="md" variant="secondary">
                  {es ? "Ver todas las experiencias" : "See all experiences"}
                </Button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {es ? "Repetir el test" : "Take it again"}
            </button>
            <Link
              href={`/${locale}/${es ? "el-metodo" : "method"}`}
              className="group inline-flex items-center gap-2 text-sm text-[var(--color-ink)] border-b border-[var(--color-ink)]/30 pb-1 hover:border-[var(--color-ink)] transition-colors"
            >
              {es ? "Estudiar el método completo" : "Study the full method"}
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}

/** Captura de correo — el resultado ya se vio; esto envía la lectura ampliada. */
function ResultCapture({
  locale,
  dominant,
}: {
  locale: Locale;
  dominant: Elem;
}) {
  const es = locale === "es";
  const [state, setState] = React.useState<"idle" | "sending" | "done" | "error">("idle");
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");

  async function submit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          firstName: name.trim() || undefined,
          source: `test-${dominant}`,
          locale,
        }),
      });
      const data = await res.json().catch(() => ({}));
      setState(res.ok && data.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="border border-[var(--color-line)] p-8 flex items-start gap-3">
        <Check className="h-5 w-5 mt-0.5 text-[var(--color-moss-700)] shrink-0" />
        <p className="text-[var(--color-ink-soft)] leading-relaxed">
          {es
            ? "Listo. Te llega la lectura ampliada de tu elemento y, una vez al mes, la nota con casos y estudios del método."
            : "Done. You'll get the extended read of your element and, once a month, the note with cases and research behind the method."}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="border border-[var(--color-line)] p-8 grid gap-4"
    >
      <div>
        <div className="eyebrow text-[var(--color-muted)] mb-2">
          {es ? "Recibe la lectura completa" : "Get the full read"}
        </div>
        <p className="text-[var(--color-ink-soft)] leading-relaxed">
          {es
            ? "Te enviamos la lectura ampliada de tu elemento dominante y las prácticas concretas para trabajar el que te falta."
            : "We'll send you the extended read of your dominant element and the concrete practices for the one you're missing."}
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={es ? "Nombre" : "First name"}
          className="w-full border-0 border-b border-[var(--color-line)] bg-transparent px-1 py-2 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ink)]"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={es ? "Tu correo" : "Your email"}
          className="w-full border-0 border-b border-[var(--color-line)] bg-transparent px-1 py-2 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ink)]"
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button size="sm" variant="primary" trailingArrow type="submit" disabled={state === "sending"}>
          {state === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {es ? "Enviando…" : "Sending…"}
            </>
          ) : es ? (
            "Enviarme mi lectura"
          ) : (
            "Send me my read"
          )}
        </Button>
        {state === "error" && (
          <span className="text-sm text-red-700">
            {es ? "No se pudo enviar. Reintenta." : "Couldn't send. Try again."}
          </span>
        )}
        <span className="text-[0.75rem] text-[var(--color-muted)]">
          {es
            ? "Una nota al mes. Puedes darte de baja cuando quieras."
            : "One note a month. Unsubscribe anytime."}
        </span>
      </div>
    </form>
  );
}
