/**
 * Iconos propios del admin. Trazos simples, sin relleno, viewBox 24×24.
 * Nada de librerías de iconos (doc de marca §6.14): el admin usa glifos de
 * texto para casi todo; estos SVG solo cubren los pocos casos que lo piden
 * (buscar, salir, flechas de navegación, menú, cerrar, estados de resultado).
 */
import type { SVGProps } from "react";

interface IconoProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

function base({ size = 20, ...props }: IconoProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export function IconoBuscar(props: IconoProps) {
  return (
    <svg {...base(props)}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <line x1="20" y1="20" x2="15.4" y2="15.4" />
    </svg>
  );
}

export function IconoSalir(props: IconoProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4" />
      <line x1="21" y1="12" x2="10" y2="12" />
      <polyline points="16 7 21 12 16 17" />
    </svg>
  );
}

export function IconoFlecha(props: IconoProps) {
  return (
    <svg {...base(props)}>
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="13 5 20 12 13 19" />
    </svg>
  );
}

export function IconoMenu(props: IconoProps) {
  return (
    <svg {...base(props)}>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

export function IconoCerrar(props: IconoProps) {
  return (
    <svg {...base(props)}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

export function IconoListo(props: IconoProps) {
  return (
    <svg {...base(props)}>
      <polyline points="4.5 12.5 9.5 17.5 19.5 6.5" />
    </svg>
  );
}

export function IconoAviso(props: IconoProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5 21.5 20h-19L12 3.5Z" />
      <line x1="12" y1="10" x2="12" y2="14.5" />
      <line x1="12" y1="17.2" x2="12" y2="17.3" />
    </svg>
  );
}

export function IconoMas(props: IconoProps) {
  return (
    <svg {...base(props)}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
