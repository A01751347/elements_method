"use client";

import { Boton, Etiqueta } from "./_components/ui";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="bloque-error">
      <Etiqueta tone="peligro">Algo falló</Etiqueta>
      <p className="bloque-error-frase">No pudimos completar la solicitud.</p>
      <p className="bloque-error-explicacion">
        Vuelve a cargar esta página. Si el problema sigue, comparte el código de abajo con quien
        administre el sistema.
      </p>
      {error.digest && <code className="bloque-error-codigo">{error.digest}</code>}
      <div className="bloque-error-acciones">
        <Boton tone="primario" type="button" onClick={reset}>
          Volver a intentar
        </Boton>
        <Boton tone="secundario" href="/admin">
          Ir al resumen
        </Boton>
      </div>
    </div>
  );
}
