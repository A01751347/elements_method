export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-xl font-medium tracking-tight">Revisa tu correo</h1>
        <p className="mt-3 text-sm text-zinc-600">
          Te enviamos un enlace para entrar al panel. Expira en 15 minutos. Si no lo ves,
          revisa la carpeta de spam.
        </p>
      </div>
    </div>
  );
}
