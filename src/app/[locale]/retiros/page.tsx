import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Sunrise,
  Coffee,
  Footprints,
  Utensils,
  Flame,
  Moon,
  Bed,
  Backpack,
  Soup,
  Car,
  ShieldCheck,
  Camera,
} from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { RetreatsShowcase } from "@/components/sections/RetreatsShowcase";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return { title: locale === "en" ? "Retreats" : "Retiros" };
}

export default async function RetreatsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden -mt-20 pt-20 text-[var(--color-paper)]">
        <div className="absolute inset-0 -z-20">
          <Image
            src="https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=2400&q=85&auto=format&fit=crop"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--color-ink)]/40 via-[var(--color-ink)]/55 to-[var(--color-ink)]" />
        <div className="absolute inset-0 -z-10 film-grain" />

        <Container className="relative pb-16 md:pb-24">
          <div className="eyebrow text-[var(--color-paper)]/80 mb-8 flex items-center gap-3">
            <span aria-hidden className="h-px w-12 bg-[var(--color-paper)]/40" />
            {dict.retreats.eyebrow}
          </div>
          <h1 className="display-1 text-balance text-[var(--color-paper)] max-w-[15ch]">
            {dict.retreats.title}
          </h1>
          <p className="lead mt-8 max-w-2xl text-[var(--color-paper)]/85">
            {dict.retreats.lead}
          </p>
        </Container>
      </section>

      {/* GRID OF RETREATS */}
      <RetreatsShowcase locale={locale} dict={dict} hideHeader />

      {/* DAY ANATOMY */}
      <Section spacing="default" tone="warm" className="paper-grain">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Sunrise className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Anatomía de un día" : "Anatomy of a day"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "De amanecer a fuego nocturno."
                : "From dawn to nightly fire."}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-4">
            <p className="lead text-pretty">
              {locale === "es"
                ? "Doce horas estructuradas con propósito. Sin tiempo muerto — y sin sobrecarga. Cada bloque tiene su elemento y su intención."
                : "Twelve structured hours with purpose. No dead time — and no overload. Each block has its element and intention."}
            </p>
          </div>
        </div>

        <div className="border border-[var(--color-line)] divide-y divide-[var(--color-line)] bg-[var(--color-paper)]">
          {(locale === "es"
            ? [
                { time: "05:30", icon: Sunrise, label: "Amanecer", body: "Breathwork en silencio. Cuerpo lento, cabeza abierta." },
                { time: "07:00", icon: Coffee, label: "Desayuno", body: "Comida ligera. Conversación con quien aparezca." },
                { time: "08:30", icon: Footprints, label: "Caminata", body: "Tres horas en silencio. Sin teléfonos, sin reloj." },
                { time: "12:30", icon: Utensils, label: "Comida", body: "Local, vegetariana, sin prisa. Un descanso real." },
                { time: "14:30", icon: Camera, label: "Sesión del día", body: "Trabajo del elemento de hoy. Práctica + integración." },
                { time: "17:30", icon: Flame, label: "Práctica de fuego", body: "Sauna, ceremonia o ejercicio de activación según día." },
                { time: "19:30", icon: Soup, label: "Cena", body: "Más lenta. Empezamos a bajar el ritmo." },
                { time: "21:00", icon: Moon, label: "Círculo nocturno", body: "Hoguera, preguntas, lectura. Cerramos el día." },
                { time: "22:30", icon: Bed, label: "Descanso", body: "Apagón colectivo. Sueño temprano, día largo mañana." },
              ]
            : [
                { time: "05:30", icon: Sunrise, label: "Dawn", body: "Silent breathwork. Slow body, open head." },
                { time: "07:00", icon: Coffee, label: "Breakfast", body: "Light food. Conversation with whoever appears." },
                { time: "08:30", icon: Footprints, label: "Hike", body: "Three hours in silence. No phones, no watch." },
                { time: "12:30", icon: Utensils, label: "Lunch", body: "Local, vegetarian, no rush. Real rest." },
                { time: "14:30", icon: Camera, label: "Day session", body: "Work on today's element. Practice + integration." },
                { time: "17:30", icon: Flame, label: "Fire practice", body: "Sauna, ceremony or activation exercise depending on the day." },
                { time: "19:30", icon: Soup, label: "Dinner", body: "Slower. We start winding down." },
                { time: "21:00", icon: Moon, label: "Nightly circle", body: "Bonfire, questions, reading. We close the day." },
                { time: "22:30", icon: Bed, label: "Rest", body: "Collective lights-out. Early sleep, long day tomorrow." },
              ]
          ).map((row) => {
            const Icon = row.icon;
            return (
              <div
                key={row.time}
                className="grid grid-cols-[80px_60px_1fr_2fr] md:grid-cols-[100px_80px_1fr_3fr] gap-4 md:gap-6 p-5 md:p-6 items-center hover:bg-[var(--color-paper-warm)] transition-colors"
              >
                <span className="font-[family-name:var(--font-display)] text-xl md:text-2xl text-[var(--color-moss-700)] tabular-nums">
                  {row.time}
                </span>
                <Icon className="h-5 w-5 text-[var(--color-muted)]" strokeWidth={1.5} />
                <span className="text-[var(--color-ink)] font-medium">{row.label}</span>
                <span className="text-sm text-[var(--color-ink-soft)]">{row.body}</span>
              </div>
            );
          })}
        </div>
      </Section>

      {/* WHAT'S INCLUDED */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Backpack className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Qué incluye" : "What's included"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Llegas con poco. Te ocupas de estar."
                : "You arrive with little. You take care of being."}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-4">
            <p className="lead text-pretty">
              {locale === "es"
                ? "El precio del retiro cubre alojamiento, todas las comidas, materiales, facilitación y traslados desde el punto de encuentro."
                : "The retreat price covers lodging, all meals, materials, facilitation and transport from the meeting point."}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          <div className="bg-[var(--color-paper)] p-8 md:p-10">
            <div className="eyebrow text-[var(--color-moss-700)] mb-6">
              {locale === "es" ? "Sí incluye" : "Included"}
            </div>
            <ul className="space-y-4">
              {[
                { icon: Bed, t: locale === "es" ? "Alojamiento en cabaña compartida" : "Shared cabin lodging" },
                { icon: Soup, t: locale === "es" ? "Tres comidas locales y meriendas" : "Three local meals and snacks" },
                { icon: Car, t: locale === "es" ? "Transporte desde CDMX (ida y vuelta)" : "Transport from CDMX (round trip)" },
                { icon: Camera, t: locale === "es" ? "Toda la facilitación y materiales" : "All facilitation and materials" },
                { icon: ShieldCheck, t: locale === "es" ? "Seguro médico durante el retiro" : "Medical insurance during retreat" },
              ].map((row) => {
                const Icon = row.icon;
                return (
                  <li key={row.t} className="flex items-start gap-3">
                    <Icon className="h-5 w-5 text-[var(--color-moss-700)] mt-0.5 shrink-0" strokeWidth={1.5} />
                    <span className="text-[var(--color-ink-soft)]">{row.t}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="bg-[var(--color-paper-warm)] p-8 md:p-10">
            <div className="eyebrow text-[var(--color-muted)] mb-6">
              {locale === "es" ? "Qué traer" : "What to bring"}
            </div>
            <ul className="space-y-3.5 text-[var(--color-ink-soft)]">
              {(locale === "es"
                ? [
                    "Ropa cómoda para clima cambiante",
                    "Tenis de trekking o caminata",
                    "Traje de baño o ropa para inmersión",
                    "Cuaderno y pluma",
                    "Botella de agua reutilizable",
                    "Lámpara de cabeza (linterna frontal)",
                    "Disposición a no usar el celular tres días",
                  ]
                : [
                    "Comfortable clothing for changing weather",
                    "Trekking or hiking shoes",
                    "Swimsuit or immersion clothing",
                    "Notebook and pen",
                    "Reusable water bottle",
                    "Headlamp",
                    "Willingness to not use your phone for three days",
                  ]
              ).map((row) => (
                <li key={row} className="flex items-start gap-3">
                  <span className="h-1 w-3 bg-[var(--color-earth)] mt-3 shrink-0" />
                  <span>{row}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* HOW TO CHOOSE */}
      <Section spacing="default" tone="ink">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-7">
            <Eyebrow inverted className="mb-6">
              {locale === "es" ? "Cómo elegir" : "How to choose"}
            </Eyebrow>
            <h2 className="display-2 text-[var(--color-paper)] text-balance">
              {locale === "es"
                ? "Tres preguntas que te aclaran cuál retiro."
                : "Three questions that clarify which retreat."}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-3">
            <p className="text-lg text-[var(--color-paper)]/75 leading-relaxed text-pretty">
              {locale === "es"
                ? "Cada retiro pesa distinto. No es lo mismo cuatro elementos en tres días que dos elementos en cuatro días."
                : "Each retreat weighs differently. Four elements in three days isn't the same as two elements in four days."}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-[var(--color-paper)]/15">
          {(locale === "es"
            ? [
                {
                  n: "01",
                  q: "¿Cuánto tiempo tienes?",
                  a: "Tres noches alcanzan para una inmersión completa con los cuatro elementos. Cuatro noches permiten profundizar en dos elementos.",
                },
                {
                  n: "02",
                  q: "¿Qué intensidad buscas?",
                  a: "Tepoztlán es contemplativo. Huasteca es físico. Valle de Bravo es reflexivo. Elige según el estado en que llegas, no en el que quieres llegar.",
                },
                {
                  n: "03",
                  q: "¿Es tu primera vez?",
                  a: "Recomendamos empezar con un retiro de los cuatro elementos. Da contexto. Después, las inmersiones por elemento tienen más sentido.",
                },
              ]
            : [
                {
                  n: "01",
                  q: "How much time do you have?",
                  a: "Three nights are enough for a full four-element immersion. Four nights let you go deeper into two elements.",
                },
                {
                  n: "02",
                  q: "What intensity?",
                  a: "Tepoztlán is contemplative. Huasteca is physical. Valle de Bravo is reflective. Choose by the state you arrive in, not where you want to.",
                },
                {
                  n: "03",
                  q: "Is it your first time?",
                  a: "We recommend starting with a four-element retreat. It gives context. Afterward, single-element immersions make more sense.",
                },
              ]
          ).map((row) => (
            <div
              key={row.n}
              className="bg-[var(--color-ink)] p-8 md:p-10 min-h-[300px] flex flex-col"
            >
              <span className="font-[family-name:var(--font-display)] text-4xl text-[var(--color-paper)]/30 mb-6">
                {row.n}
              </span>
              <h3 className="font-[family-name:var(--font-display)] text-xl tracking-tight text-[var(--color-paper)] mb-3">
                {row.q}
              </h3>
              <p className="text-sm text-[var(--color-paper)]/70 leading-relaxed flex-1">
                {row.a}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
