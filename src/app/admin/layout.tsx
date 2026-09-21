import Link from "next/link";
import { Inter } from "next/font/google";
import { count, eq, inArray } from "drizzle-orm";
import { auth, signOut } from "@/shared/auth/config";
import { db } from "@/shared/db/client";
import { orders, inscriptions, enterpriseQuotes, blogComments, testimonials, arcoRequests } from "@/shared/db/schema";
import { NavEnlace, Migas, MenuMovil, BusquedaGlobal } from "./_components/client";
import { IconoSalir } from "./_components/icons";
import "./admin.css";
import type { Metadata } from "next";

/** El admin nunca se indexa: robots.txt lo bloquea y esto lo refuerza. */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

/** Contadores de pendientes para la nav. Se degradan a 0 si la DB falla. */
async function cargarContadores() {
  try {
    const [transferencias, inscripcionesNuevas, cotizacionesNuevas, comentariosPendientes, testimonialesSinAprobar, arcoAbiertas] =
      await Promise.all([
        db.select({ n: count() }).from(orders).where(eq(orders.status, "pending_transfer_validation")),
        db.select({ n: count() }).from(inscriptions).where(eq(inscriptions.status, "new")),
        db.select({ n: count() }).from(enterpriseQuotes).where(eq(enterpriseQuotes.status, "nueva")),
        db.select({ n: count() }).from(blogComments).where(eq(blogComments.status, "pending")),
        db.select({ n: count() }).from(testimonials).where(eq(testimonials.approvedByAdmin, false)),
        db
          .select({ n: count() })
          .from(arcoRequests)
          .where(inArray(arcoRequests.status, ["nueva", "identidad_pendiente", "en_proceso"])),
      ]);
    return {
      transferencias: transferencias[0]?.n ?? 0,
      inscripciones: inscripcionesNuevas[0]?.n ?? 0,
      cotizaciones: cotizacionesNuevas[0]?.n ?? 0,
      comentarios: comentariosPendientes[0]?.n ?? 0,
      testimoniales: testimonialesSinAprobar[0]?.n ?? 0,
      arco: arcoAbiertas[0]?.n ?? 0,
    };
  } catch {
    return { transferencias: 0, inscripciones: 0, cotizaciones: 0, comentarios: 0, testimoniales: 0, arco: 0 };
  }
}

interface NavGrupo {
  titulo: string;
  items: { href: string; label: string; count?: number }[];
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    return <div className={`admin ${inter.variable}`}>{children}</div>;
  }

  const contadores = await cargarContadores();

  const grupos: NavGrupo[] = [
    {
      titulo: "Operación",
      items: [
        { href: "/admin", label: "Resumen" },
        { href: "/admin/pagos", label: "Órdenes" },
        { href: "/admin/transferencias", label: "Transferencias", count: contadores.transferencias },
        { href: "/admin/compradores", label: "Compradores" },
        { href: "/admin/inscripciones", label: "Inscripciones", count: contadores.inscripciones },
        { href: "/admin/empresas", label: "Cotizaciones", count: contadores.cotizaciones },
        { href: "/admin/arco", label: "Derechos ARCO", count: contadores.arco },
      ],
    },
    {
      titulo: "Catálogo",
      items: [
        { href: "/admin/retiros", label: "Retiros" },
        { href: "/admin/productos", label: "Productos" },
        // Ocultas del sidebar a petición del equipo: no se usan por ahora.
        // Las páginas siguen existiendo y funcionando en /admin/locaciones
        // y /admin/proveedores; para reactivarlas basta descomentar.
        // { href: "/admin/locaciones", label: "Locaciones" },
        // { href: "/admin/proveedores", label: "Proveedores" },
        { href: "/admin/documentos", label: "Documentos" },
        { href: "/admin/formularios", label: "Formularios" },
      ],
    },
    {
      titulo: "Contenido",
      items: [
        { href: "/admin/blog", label: "Blog" },
        { href: "/admin/comentarios", label: "Comentarios", count: contadores.comentarios },
        { href: "/admin/testimoniales", label: "Testimoniales", count: contadores.testimoniales },
        { href: "/admin/logos", label: "Logos" },
        { href: "/admin/suscriptores", label: "Suscriptores" },
      ],
    },
    {
      titulo: "Ajustes",
      items: [
        { href: "/admin/analytics", label: "Tráfico" },
        { href: "/admin/analytics/pixels", label: "Pixels y etiquetas" },
        { href: "/admin/ajustes/contacto", label: "Contacto" },
        { href: "/admin/ayuda", label: "Ayuda" },
      ],
    },
  ];

  const inicial = (session.user.email ?? "?").trim().charAt(0).toUpperCase();

  const nav = (
    <nav className="admin-nav" aria-label="Navegación principal">
      {grupos.map((grupo) => (
        <div key={grupo.titulo}>
          <p className="nav-grupo">{grupo.titulo}</p>
          {grupo.items.map((item) => (
            <NavEnlace key={item.href} href={item.href} count={item.count}>
              {item.label}
            </NavEnlace>
          ))}
        </div>
      ))}
    </nav>
  );

  return (
    <div className={`admin ${inter.variable}`}>
      <a href="#contenido" className="saltar">
        Saltar al contenido
      </a>
      <div className="admin-shell-layout">
        <aside className="admin-sidebar">
          <Link href="/admin" className="marca">
            <span className="marca-nombre">
              Elements <span className="acento">Method</span>
            </span>
            <span className="marca-sub">Liderazgo · Operación</span>
          </Link>
          <Link href="/admin/retiros/nuevo" className="boton boton-primario nav-accion">
            + Nuevo retiro
          </Link>
          <div className="hidden md:block">{nav}</div>
          <div className="md:hidden">
            <MenuMovil>{nav}</MenuMovil>
          </div>
          <div className="admin-sidebar-pie">
            <span className="avatar" aria-hidden="true">
              {inicial}
            </span>
            <span className="admin-sidebar-correo">{session.user.email}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/signin" });
              }}
            >
              <button type="submit" className="admin-signout" aria-label="Cerrar sesión">
                <IconoSalir size={18} />
              </button>
            </form>
          </div>
        </aside>
        <div className="flex flex-col min-w-0">
          <header className="admin-topbar">
            <Migas />
            <BusquedaGlobal />
          </header>
          <main id="contenido" className="admin-contenido">
            {children}
          </main>
          <footer className="admin-pie">
            <span>Elements Method · Operación</span>
            <span>Horarios de Ciudad de México</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
