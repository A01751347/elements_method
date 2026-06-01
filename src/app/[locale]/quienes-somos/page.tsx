import Image from "next/image";
import { notFound } from "next/navigation";
import { Instagram, Linkedin, BookMarked, Heart, Users, Sparkles } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return { title: locale === "en" ? "Who we are" : "Quiénes somos" };
}

export default async function AboutPage({
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
            src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=2400&q=85&auto=format&fit=crop"
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
            {dict.about.eyebrow}
          </div>
          <h1 className="display-1 text-balance text-[var(--color-paper)] max-w-[16ch]">
            {dict.about.title}
          </h1>
          <p className="lead mt-8 max-w-2xl text-[var(--color-paper)]/85">
            {dict.about.lead}
          </p>
        </Container>
      </section>

      {/* FOUNDERS */}
      <Section spacing="default" tone="warm" className="paper-grain">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <FounderCard
            name="Andrés Flores Pedroza"
            role={dict.about.andres.role}
            bio={dict.about.andres.bio}
            accent="var(--color-fire)"
            accentSoft="var(--color-fire-soft)"
            elementSymbol="fire"
            socials={[
              { kind: "linkedin", href: "https://linkedin.com" },
              { kind: "instagram", href: "https://instagram.com" },
            ]}
          />
          <FounderCard
            name="Ana Michelle"
            role={dict.about.michelle.role}
            bio={dict.about.michelle.bio}
            accent="var(--color-water)"
            accentSoft="var(--color-water-soft)"
            elementSymbol="water"
            socials={[
              { kind: "linkedin", href: "https://linkedin.com" },
              { kind: "instagram", href: "https://instagram.com" },
            ]}
          />
        </div>
      </Section>

      {/* ORIGIN STORY */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 items-start mb-16">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <BookMarked className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Origen" : "Origin"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Cómo nació el método."
                : "How the method was born."}
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-6 text-lg leading-relaxed text-[var(--color-ink-soft)] max-w-2xl">
            <p>
              {locale === "es"
                ? "Andrés y Ana Michelle se conocieron en 2017 en un retiro de respiración en Tepoztlán. Él venía de diez años en consultoría estratégica; ella, de doce en facilitación corporal y trabajo de voz. Ambos llegaron al mismo lugar por caminos opuestos: convencidos de que el liderazgo se enseña mal."
                : "Andrés and Ana Michelle met in 2017 at a breathing retreat in Tepoztlán. He came from ten years in strategy consulting; she from twelve in body facilitation and voice work. Both arrived at the same place from opposite paths: convinced that leadership is poorly taught."}
            </p>
            <p>
              {locale === "es"
                ? "El primer prototipo se hizo en 2019: ocho participantes, una casa rentada, tres días sin guion claro. El feedback fue brutal — y útil. Los siguientes dos años fueron de iteración cerrada: se quemaron muchas hipótesis."
                : "The first prototype happened in 2019: eight participants, a rented house, three days without a clear script. The feedback was brutal — and useful. The next two years were closed iteration: many hypotheses were burned."}
            </p>
            <p>
              {locale === "es"
                ? "Para 2022 el método tenía su forma actual: cuatro elementos como gramática, cuatro capas por elemento, sesiones semanales que sostienen los retiros, retiros que profundizan lo que las sesiones abren. Lo que ven hoy es el resultado de esa decantación."
                : "By 2022 the method had its current form: four elements as grammar, four layers per element, weekly sessions that sustain retreats, retreats that deepen what sessions open. What you see today is the result of that settling."}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="border-t border-b border-[var(--color-line)] divide-y divide-[var(--color-line)]">
          {(locale === "es"
            ? [
                { year: "2017", t: "Encuentro fundacional", b: "Andrés y Michelle se conocen en un retiro en Tepoztlán." },
                { year: "2019", t: "Primer prototipo", b: "Ocho participantes, una casa rentada, tres días sin guion fijo." },
                { year: "2021", t: "Marco simbólico", b: "Los cuatro elementos cristalizan como gramática del método." },
                { year: "2022", t: "Forma actual", b: "Caminos definidos, calendario sostenible, primera cohorte completa." },
                { year: "2024", t: "Programas corporativos", b: "Primer cliente B2B grande. Validamos que el método escala a equipos." },
                { year: "2026", t: "Plataforma digital", b: "Estás leyéndola." },
              ]
            : [
                { year: "2017", t: "Founding encounter", b: "Andrés and Michelle meet at a retreat in Tepoztlán." },
                { year: "2019", t: "First prototype", b: "Eight participants, rented house, three days without fixed script." },
                { year: "2021", t: "Symbolic framework", b: "The four elements crystallize as the method's grammar." },
                { year: "2022", t: "Current form", b: "Defined paths, sustainable calendar, first full cohort." },
                { year: "2024", t: "Corporate programs", b: "First large B2B client. We validated the method scales to teams." },
                { year: "2026", t: "Digital platform", b: "You're reading it." },
              ]
          ).map((row) => (
            <div
              key={row.year}
              className="grid grid-cols-[100px_1fr] md:grid-cols-[160px_1fr_2fr] gap-4 md:gap-8 py-7 md:py-9"
            >
              <div className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-[var(--color-moss-700)]">
                {row.year}
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-xl tracking-tight md:col-span-1 col-span-2">
                {row.t}
              </h3>
              <p className="text-[var(--color-ink-soft)] leading-relaxed col-span-2 md:col-span-1">
                {row.b}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* LINEAGE */}
      <Section spacing="default" tone="warm">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Heart className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Linaje" : "Lineage"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "A quién le aprendimos."
                : "From whom we learned."}
            </h2>
            <p className="mt-6 lead text-pretty">
              {locale === "es"
                ? "Nada de esto nació de la nada. Reconocemos las prácticas y tradiciones que nos dieron lenguaje."
                : "None of this came from nothing. We recognize the practices and traditions that gave us language."}
            </p>
          </div>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
            {(locale === "es"
              ? [
                  { k: "Cuerpo somático", v: "Wilhelm Reich, Alexander Lowen, Peter Levine. La bioenergética como lenguaje del sistema nervioso." },
                  { k: "Respiración consciente", v: "Tradición pranayama, Wim Hof Method, Stanislav Grof. Acceso directo al estado interno." },
                  { k: "Tradición mexicana", v: "Temazcal, círculos de palabra, plantas maestras. Recibido con respeto, sin apropiación." },
                  { k: "Trabajo simbólico", v: "Jung, Hillman, Robert Bly. El símbolo como organizador de la psique." },
                ]
              : [
                  { k: "Somatic body", v: "Wilhelm Reich, Alexander Lowen, Peter Levine. Bioenergetics as nervous-system language." },
                  { k: "Conscious breathing", v: "Pranayama tradition, Wim Hof Method, Stanislav Grof. Direct access to inner state." },
                  { k: "Mexican tradition", v: "Temazcal, word circles, master plants. Received with respect, without appropriation." },
                  { k: "Symbolic work", v: "Jung, Hillman, Robert Bly. Symbol as psyche organizer." },
                ]
            ).map((row) => (
              <div key={row.k} className="bg-[var(--color-paper)] p-7">
                <div className="eyebrow text-[var(--color-muted)] mb-3">{row.k}</div>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                  {row.v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* VALUES */}
      <Section spacing="default">
        <div className="max-w-3xl mb-16">
          <Eyebrow className="mb-6 flex items-center gap-3">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
            {locale === "es" ? "Principios" : "Principles"}
          </Eyebrow>
          <h2 className="display-2 text-balance">
            {locale === "es"
              ? "Cinco compromisos que sostienen el método."
              : "Five commitments that sustain the method."}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {(locale === "es"
            ? [
                { n: "01", t: "Honestidad", b: "Si algo no funciona, lo decimos. Si tú no encajas, lo decimos. Si te incomoda, lo decimos." },
                { n: "02", t: "No-prisa", b: "Sostenemos procesos largos. No vendemos transformación rápida porque no existe." },
                { n: "03", t: "Cuerpo primero", b: "Antes de la palabra, el sistema nervioso. Trabajamos desde ahí, no contra eso." },
                { n: "04", t: "Naturaleza viva", b: "El bosque, el agua y el fuego son maestros. Los tratamos como tales, no como decorado." },
                { n: "05", t: "Comunidad pequeña", b: "Cohortes íntimas. Conocemos a cada persona por nombre. El método requiere intimidad." },
              ]
            : [
                { n: "01", t: "Honesty", b: "If something doesn't work, we say so. If you don't fit, we say so. If it unsettles you, we say so." },
                { n: "02", t: "No rush", b: "We sustain long processes. We don't sell quick transformation because it doesn't exist." },
                { n: "03", t: "Body first", b: "Before language, the nervous system. We work from there, not against it." },
                { n: "04", t: "Living nature", b: "Forest, water and fire are teachers. We treat them as such, not as decor." },
                { n: "05", t: "Small community", b: "Intimate cohorts. We know each person by name. The method requires intimacy." },
              ]
          ).map((row) => (
            <div
              key={row.n}
              className="bg-[var(--color-paper)] p-7 md:p-8 hover:bg-[var(--color-paper-warm)] transition-colors min-h-[280px] flex flex-col"
            >
              <span className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-moss-700)]/40 mb-4">
                {row.n}
              </span>
              <h3 className="font-[family-name:var(--font-display)] text-xl tracking-tight mb-3">
                {row.t}
              </h3>
              <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed flex-1">
                {row.b}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* EXTENDED TEAM */}
      <Section spacing="default" tone="warm">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Users className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Equipo extendido" : "Extended team"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Facilitadores invitados."
                : "Invited facilitators."}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-3">
            <p className="lead text-pretty">
              {locale === "es"
                ? "En cada inmersión sumamos especialistas: terapeutas somáticos, facilitadores de temazcal, instructores de respiración, médicos del trabajo corporal."
                : "Each immersion includes specialists: somatic therapists, temazcal facilitators, breathing instructors, body-work doctors."}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {(locale === "es"
            ? [
                { n: "Patricia Cuevas", r: "Facilitadora de temazcal", d: "Veinte años de tradición. Acompaña los círculos de tierra." },
                { n: "Dr. Hernán López", r: "Médico somático", d: "Supervisión clínica de prácticas con frío y respiración intensa." },
                { n: "Iván Bautista", r: "Instructor de breathwork", d: "Formado en pranayama y método Wim Hof. Lidera las prácticas de aire." },
                { n: "Sofía Reyes", r: "Coach de cuerpo y voz", d: "Trabajo con presencia escénica y modulación emocional." },
              ]
            : [
                { n: "Patricia Cuevas", r: "Temazcal facilitator", d: "Twenty years of tradition. Holds the earth circles." },
                { n: "Dr. Hernán López", r: "Somatic doctor", d: "Clinical supervision of cold and intense-breathing practices." },
                { n: "Iván Bautista", r: "Breathwork instructor", d: "Trained in pranayama and Wim Hof method. Leads air practices." },
                { n: "Sofía Reyes", r: "Body and voice coach", d: "Work with stage presence and emotional modulation." },
              ]
          ).map((row) => (
            <div
              key={row.n}
              className="bg-[var(--color-paper)] p-7 hover:bg-[var(--color-paper-warm)] transition-colors min-h-[240px] flex flex-col"
            >
              <div className="h-14 w-14 rounded-full bg-[var(--color-moss-100)] flex items-center justify-center mb-5">
                <span className="font-[family-name:var(--font-display)] text-lg text-[var(--color-moss-700)]">
                  {row.n.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-lg tracking-tight">
                {row.n}
              </h3>
              <div className="text-xs uppercase tracking-wide text-[var(--color-muted)] mt-1 mb-3">
                {row.r}
              </div>
              <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed flex-1">
                {row.d}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* MANIFESTO */}
      <Section spacing="default" tone="ink">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Eyebrow inverted className="mb-6">
              {locale === "es" ? "Manifiesto" : "Manifesto"}
            </Eyebrow>
            <h2 className="display-2 text-[var(--color-paper)] text-balance">
              {locale === "es"
                ? "No enseñamos liderazgo. Lo entrenamos."
                : "We don't teach leadership. We train it."}
            </h2>
          </div>
          <div className="lg:col-span-7 lg:pt-4 space-y-6 text-lg leading-relaxed text-[var(--color-paper)]/80 max-w-2xl">
            <p>
              {locale === "es"
                ? "La industria del liderazgo confunde discurso con práctica. Hablamos mucho de \"presencia\" y \"escucha\" sin trabajar el cuerpo, la respiración, las decisiones que duelen."
                : "The leadership industry confuses speech with practice. We talk a lot about \"presence\" and \"listening\" without working the body, the breath, the decisions that hurt."}
            </p>
            <p>
              {locale === "es"
                ? "Los cuatro elementos nos dan una gramática concreta: cada uno es un terreno entrenable, con cuerpo, con prácticas, con frameworks. Lo simbólico no sustituye lo concreto; lo organiza."
                : "The four elements give us a concrete grammar: each one is a trainable terrain, with body, with practices, with frameworks. The symbolic doesn't replace the concrete; it organizes it."}
            </p>
            <p>
              {locale === "es"
                ? "Trabajamos con personas que toman decisiones cuyas consecuencias importan. Por eso nuestro método exige tiempo, presencia y, sobre todo, honestidad."
                : "We work with people whose decisions have consequences that matter. That's why our method demands time, presence, and above all, honesty."}
            </p>

            <div className="pt-8 flex flex-wrap gap-3">
              <Button
                href={`/${locale}/${locale === "es" ? "el-metodo" : "method"}`}
                trailingArrow
                className="bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-paper-warm)]"
              >
                {locale === "es" ? "Ver el método" : "See the method"}
              </Button>
              <Button
                href={`/${locale}/${locale === "es" ? "los-caminos" : "paths"}`}
                variant="outlineLight"
              >
                {locale === "es" ? "Los caminos" : "The paths"}
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

function FounderCard({
  name,
  role,
  bio,
  accent,
  accentSoft,
  elementSymbol,
  socials,
}: {
  name: string;
  role: string;
  bio: string;
  accent: string;
  accentSoft: string;
  elementSymbol: "fire" | "water";
  socials: { kind: "linkedin" | "instagram"; href: string }[];
}) {
  return (
    <article className="group">
      <div
        className="relative aspect-[4/5] mb-8 overflow-hidden"
        style={{
          background: `linear-gradient(140deg, ${accentSoft} 0%, var(--color-paper-warm) 100%)`,
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full mix-blend-multiply opacity-50"
          viewBox="0 0 100 125"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          {elementSymbol === "fire" ? (
            <path
              d="M50 20 C 40 35, 65 45, 50 60 C 35 50, 40 75, 50 95 C 65 80, 80 60, 75 40 C 70 30, 60 28, 50 20 Z"
              fill={accent}
              opacity="0.55"
            />
          ) : (
            <path
              d="M50 18 C 70 40, 78 60, 50 100 C 22 60, 30 40, 50 18 Z"
              fill={accent}
              opacity="0.55"
            />
          )}
        </svg>

        <div className="absolute bottom-5 left-5 text-[var(--color-ink)]">
          <div className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
            {name.split(" ")[0]}
          </div>
        </div>
      </div>

      <div className="eyebrow text-[var(--color-muted)] mb-3">{role}</div>
      <h3 className="display-3 mb-5">{name}</h3>
      <p className="text-[var(--color-ink-soft)] leading-relaxed max-w-md">
        {bio}
      </p>

      <div className="mt-6 flex items-center gap-4">
        {socials.map((s) => (
          <a
            key={s.kind}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
            aria-label={s.kind}
          >
            {s.kind === "linkedin" ? (
              <Linkedin className="h-4 w-4" />
            ) : (
              <Instagram className="h-4 w-4" />
            )}
          </a>
        ))}
      </div>
    </article>
  );
}
