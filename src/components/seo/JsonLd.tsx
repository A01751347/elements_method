/**
 * Emite un bloque `<script type="application/ld+json">` con datos
 * estructurados (schema.org). Server component: se renderiza en el HTML
 * inicial, que es lo que Google lee para los resultados enriquecidos.
 *
 * `<` se escapa como `<` para que ningún texto de la BD pueda cerrar el
 * script.
 */
export type JsonLdObject = Record<string, unknown>;

export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
