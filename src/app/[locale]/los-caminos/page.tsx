import { redirect } from "next/navigation";

/**
 * /los-caminos quedó fusionada con /retiros: las dos listaban las mismas tres
 * Executive Experiences. La ruta se conserva solo para no romper enlaces
 * antiguos ni el tráfico ya indexado.
 */
export default async function LosCaminosRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale === "en" ? "en" : "es"}/${locale === "en" ? "retreats" : "retiros"}`);
}
