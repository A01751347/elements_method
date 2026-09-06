import { Boton, Etiqueta } from "./_components/ui";

export default function AdminNotFound() {
  return (
    <div className="bloque-error bloque-error-tinta">
      <Etiqueta tone="tinta">No existe</Etiqueta>
      <p className="bloque-error-frase">Esta página no existe o ya no está disponible.</p>
      <p className="bloque-error-explicacion">
        Revisa la dirección o vuelve al resumen del panel.
      </p>
      <div className="bloque-error-acciones">
        <Boton tone="primario" href="/admin">
          Ir al resumen
        </Boton>
      </div>
    </div>
  );
}
