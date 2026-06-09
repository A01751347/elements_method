export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-medium tracking-tight">Dashboard</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Aquí van ingresos del mes y año, compras por camino, tasa de conversión,
        origen de tráfico, top páginas, suscriptores nuevos, cotizaciones recibidas,
        citas agendadas. (RF-ADM-03)
      </p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {["Ingresos del mes", "Órdenes pagadas", "Suscriptores nuevos", "Cotizaciones nuevas"].map(
          (label) => (
            <div
              key={label}
              className="rounded-lg border border-zinc-200 bg-white p-4"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                {label}
              </p>
              <p className="mt-2 text-2xl font-medium">—</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
