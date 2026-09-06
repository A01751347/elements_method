import { permanentRedirect } from "next/navigation";

/**
 * /los-caminos quedó fusionada con /retiros: las dos listaban las mismas tres
 * Executive Experiences. La ruta se conserva solo para no romper enlaces
 * antiguos ni el tráfico ya indexado; la redirección es permanente (308) para
 * que los buscadores consoliden la señal en /retiros.
 */
export default async function LosCaminosRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  permanentRedirect(`/${locale === "en" ? "en" : "es"}/${locale === "en" ? "retreats" : "retiros"}`);
}
