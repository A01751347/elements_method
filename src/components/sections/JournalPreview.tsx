"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, BookOpen, Clock } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";
import { blogPosts } from "@/data/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";
import { formatDate } from "@/lib/utils";

export function JournalPreview({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dict;
}) {
  return (
    <section className="py-24 md:py-36 bg-[var(--color-paper)]">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 items-end mb-16 md:mb-20">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6">{dict.blog.eyebrow}</Eyebrow>
            <h2 className="display-2 text-balance">{dict.blog.title}</h2>
          </div>
          <div className="lg:col-span-5 flex lg:justify-end">
            <Link
              href={`/${locale}/blog`}
              className="group inline-flex items-center gap-2 text-sm text-[var(--color-ink)] border-b border-[var(--color-ink)]/30 pb-1 hover:border-[var(--color-ink)] transition-colors"
            >
              {locale === "es" ? "Ver el diario completo" : "See the full journal"}
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {blogPosts.map((post, idx) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              className="group bg-[var(--color-paper)] hover:bg-[var(--color-paper-warm)] transition-colors duration-500"
            >
              <Link
                href={`/${locale}/blog/${post.slug}`}
                className="block p-8 md:p-10 h-full flex flex-col justify-between min-h-[420px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="eyebrow text-[var(--color-moss-700)]">
                      {post.tag}
                    </span>
                    <BookOpen
                      className="h-4 w-4 text-[var(--color-muted)]"
                      strokeWidth={1.5}
                    />
                  </div>

                  <h3 className="display-3 mb-4 group-hover:text-[var(--color-moss-700)] transition-colors text-balance">
                    {locale === "es" ? post.titleEs : post.titleEn}
                  </h3>

                  <p className="text-[var(--color-ink-soft)] text-sm leading-relaxed line-clamp-3">
                    {locale === "es" ? post.excerptEs : post.excerptEn}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-[var(--color-line)] flex items-center justify-between text-xs text-[var(--color-muted)]">
                  <span>{formatDate(post.date, locale)}</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3 w-3" strokeWidth={1.5} />
                    {post.readMinutes} min
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
