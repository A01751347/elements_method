"use client";

/**
 * Filas dinámicas para editar tramos numéricos (tramos de personas, descuentos
 * por volumen…). Mantiene el estado en el cliente y lo serializa a un input
 * oculto (`name`) como JSON, que es lo que llega al server action al enviar
 * el formulario que lo envuelve.
 */
import { useState } from "react";
import { Input } from "../../_components/ui";

interface Columna {
  key: string;
  label: string;
  step?: number;
}

interface TramosEditorProps {
  name: string;
  columnas: Columna[];
  filasIniciales: Record<string, number>[];
  agregarLabel?: string;
}

export function TramosEditor({ name, columnas, filasIniciales, agregarLabel = "+ Agregar tramo" }: TramosEditorProps) {
  const [filas, setFilas] = useState<Record<string, number>[]>(filasIniciales);

  function actualizar(indice: number, clave: string, valor: number) {
    setFilas((prev) => prev.map((fila, i) => (i === indice ? { ...fila, [clave]: valor } : fila)));
  }

  function quitar(indice: number) {
    setFilas((prev) => prev.filter((_, i) => i !== indice));
  }

  function agregar() {
    const vacia = Object.fromEntries(columnas.map((c) => [c.key, 0]));
    setFilas((prev) => [...prev, vacia]);
  }

  const plantillaColumnas = `${columnas.map(() => "1fr").join(" ")} auto`;

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 items-center" style={{ gridTemplateColumns: plantillaColumnas }}>
        {columnas.map((c) => (
          <span key={c.key} className="etiqueta">
            {c.label}
          </span>
        ))}
        <span />
      </div>
      {filas.map((fila, i) => (
        <div key={i} className="grid gap-3 items-center" style={{ gridTemplateColumns: plantillaColumnas }}>
          {columnas.map((c) => (
            <Input
              key={c.key}
              type="number"
              step={c.step ?? 1}
              value={fila[c.key] ?? 0}
              onChange={(ev) => actualizar(i, c.key, Number(ev.target.value))}
              aria-label={c.label}
            />
          ))}
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
        {agregarLabel}
      </button>
      <input type="hidden" name={name} value={JSON.stringify(filas)} />
    </div>
  );
}
