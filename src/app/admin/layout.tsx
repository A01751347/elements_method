import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/shared/auth/config";
import { LOGO_PNG } from "@/components/brand/Logo";

const NAV_GROUPS = [
  {
    label: "Operaciones",
    items: [
      { href: "/admin", label: "Dashboard" },
      { href: "/admin/retiros", label: "Retiros · 9" },
      { href: "/admin/locaciones", label: "Locaciones · 13" },
      { href: "/admin/proveedores", label: "Proveedores · 16" },
      { href: "/admin/inscripciones", label: "Inscripciones" },
    ],
  },
  {
    label: "Catálogo",
    items: [
      { href: "/admin/productos", label: "Productos" },
      { href: "/admin/documentos", label: "Documentos · 3" },
      { href: "/admin/formularios", label: "Formularios" },
    ],
  },
  {
    label: "Ventas",
    items: [
      { href: "/admin/compradores", label: "Compradores" },
      { href: "/admin/pagos", label: "Pagos" },
      { href: "/admin/transferencias", label: "Transferencias" },
      { href: "/admin/empresas", label: "Empresas" },
    ],
  },
  {
    label: "Contenido",
    items: [
      { href: "/admin/blog", label: "Blog" },
      { href: "/admin/comentarios", label: "Comentarios" },
      { href: "/admin/testimoniales", label: "Testimoniales" },
      { href: "/admin/logos", label: "Logos" },
      { href: "/admin/suscriptores", label: "Suscriptores" },
    ],
  },
  {
    label: "Configuración",
    items: [{ href: "/admin/analytics", label: "Analytics & Pixeles" }],
  },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    return <div className="min-h-screen bg-zinc-50 text-zinc-900">{children}</div>;
  }

  return (
    <div className="admin-shell min-h-screen bg-zinc-50 text-zinc-900">
      <div className="flex">
        <aside className="hidden md:flex w-72 shrink-0 flex-col border-r border-zinc-200 bg-white min-h-screen">
          <div className="px-5 py-5 border-b border-zinc-200">
            <Link href="/admin" className="inline-flex items-center gap-3 text-zinc-900">
              <Image
                src={LOGO_PNG}
                width={36}
                height={36}
                alt="Elements Method"
                priority
              />
              <span>
                <span className="block text-base font-semibold tracking-wide">
                  Elements Method
                </span>
                <span className="block text-xs uppercase tracking-[0.16em] text-zinc-600 font-medium mt-0.5">
                  Admin
                </span>
              </span>
            </Link>
          </div>
          <nav className="flex-1 overflow-y-auto px-2 py-5 space-y-6">
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                <div className="px-3 mb-2 text-[0.7rem] uppercase tracking-[0.16em] text-zinc-500 font-semibold">
                  {group.label}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded px-3 py-2 text-[0.95rem] text-zinc-800 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          <div className="border-t border-zinc-200 px-5 py-4 text-sm text-zinc-700">
            <p className="truncate font-medium text-zinc-900">{session.user.email}</p>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/signin" });
              }}
            >
              <button
                type="submit"
                className="mt-2 text-sm text-zinc-600 hover:text-zinc-900 underline-offset-2 hover:underline"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </aside>
        <main className="flex-1 min-h-screen">
          <div className="px-6 py-8 max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
