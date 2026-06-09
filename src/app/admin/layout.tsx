import Link from "next/link";
import { auth, signOut } from "@/shared/auth/config";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/compradores", label: "Compradores" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/retiros", label: "Retiros" },
  { href: "/admin/pagos", label: "Pagos" },
  { href: "/admin/transferencias", label: "Transferencias" },
  { href: "/admin/documentos", label: "Documentos" },
  { href: "/admin/formularios", label: "Formularios" },
  { href: "/admin/empresas", label: "Empresas" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/comentarios", label: "Comentarios" },
  { href: "/admin/testimoniales", label: "Testimoniales" },
  { href: "/admin/logos", label: "Logos" },
  { href: "/admin/suscriptores", label: "Suscriptores" },
  { href: "/admin/calendario", label: "Calendario" },
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
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="flex">
        <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-zinc-200 bg-white min-h-screen">
          <div className="px-5 py-5 border-b border-zinc-200">
            <Link href="/admin" className="text-sm font-medium tracking-wide">
              Elements Method
            </Link>
            <p className="mt-0.5 text-[0.7rem] uppercase tracking-[0.18em] text-zinc-500">
              Admin
            </p>
          </div>
          <nav className="flex-1 overflow-y-auto px-2 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-zinc-200 px-5 py-4 text-xs text-zinc-500">
            <p className="truncate">{session.user.email}</p>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/signin" });
              }}
            >
              <button
                type="submit"
                className="mt-2 text-zinc-500 hover:text-zinc-900 underline-offset-2 hover:underline"
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
