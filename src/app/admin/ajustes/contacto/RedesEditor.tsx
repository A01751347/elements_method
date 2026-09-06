"use client";

/**
 * Filas dinámicas para las redes sociales de contact_socials. Mantiene el
 * estado en el cliente (Plataforma / Usuario / URL) y lo serializa a un
 * input oculto `socialsJson` que llega al server action al enviar el
 * formulario que lo envuelve.
 */
import { useState } from "react";
import { Input } from "../../_components/ui";

export interface RedSocial {
  platform: string;
  handle: string;
  url: string;
}

export function RedesEditor({ filasIniciales }: { filasIniciales: RedSocial[] }) {
  const [filas, setFilas] = useState<RedSocial[]>(filasIniciales);

  function actualizar(indice: number, clave: keyof RedSocial, valor: string) {
    setFilas((prev) => prev.map((fila, i) => (i === indice ? { ...fila, [clave]: valor } : fila)));
  }

  function quitar(indice: number) {
    setFilas((prev) => prev.filter((_, i) => i !== indice));
  }

  function agregar() {
    setFilas((prev) => [...prev, { platform: "", handle: "", url: "" }]);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3" style={{ gridTemplateColumns: "1.4fr 1fr 1.4fr auto" }}>
        <span className="etiqueta">Plataforma</span>
        <span className="etiqueta">Usuario</span>
        <span className="etiqueta">URL</span>
        <span />
      </div>
      {filas.map((fila, i) => (
        <div key={i} className="grid gap-3 items-center" style={{ gridTemplateColumns: "1.4fr 1fr 1.4fr auto" }}>
          <Input
            value={fila.platform}
            onChange={(ev) => actualizar(i, "platform", ev.target.value)}
            placeholder="Instagram"
            aria-label="Plataforma"
          />
          <Input
            value={fila.handle}
            onChange={(ev) => actualizar(i, "handle", ev.target.value)}
            placeholder="@elementsmethod"
            aria-label="Usuario"
          />
          <Input
            value={fila.url}
            onChange={(ev) => actualizar(i, "url", ev.target.value)}
            placeholder="https://instagram.com/elementsmethod"
            aria-label="URL"
          />
          <button type="button" className="boton boton-texto" style={{ fontSize: 12 }} onClick={() => quitar(i)}>
            Quitar
          </button>
        </div>
      ))}
      <button
        type="button"
        className="boton boton-texto"
        style={{ fontSize: 12, alignSelf: "flex-start" }}
        onClick={agregar}
      >
        + Agregar red
      </button>
      <input type="hidden" name="socialsJson" value={JSON.stringify(filas)} />
    </div>
  );
}
