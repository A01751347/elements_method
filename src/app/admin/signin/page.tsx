import { signIn } from "@/shared/auth/config";
import { Banner, Campo, Input } from "../_components/ui";
import { BotonPendiente } from "../_components/client";

export default function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  return (
    <div className="login-envoltorio">
      <div className="login-hoja">
        <div className="login-marca-fila">
          <span className="marca-nombre">
            Elements <span className="acento">Method</span>
          </span>
          <span className="marca-sub">Liderazgo · Operación</span>
        </div>
        <h1 className="login-tagline">La naturaleza no gestiona. La naturaleza lidera.</h1>
        <p>Te enviamos un enlace de acceso a tu correo. Expira en 15 minutos.</p>

        <SignInForm searchParams={searchParams} />
      </div>
    </div>
  );
}

async function SignInForm({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const error = params.error;

  return (
    <form
      action={async (formData: FormData) => {
        "use server";
        const email = String(formData.get("email") ?? "").trim();
        if (!email) return;
        await signIn("resend", {
          email,
          redirectTo: params.next ?? "/admin",
        });
      }}
      className="login-form"
    >
      <Campo label="Correo" htmlFor="email" required>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </Campo>
      <BotonPendiente pendingLabel="Enviando el enlace…" className="w-full">
        Enviarme el enlace de acceso
      </BotonPendiente>
      {error && (
        <Banner tone="error">
          No pudimos enviarte el enlace. Verifica que tu correo esté en la lista de administradores.
        </Banner>
      )}
      <p className="login-nota">Solo los correos autorizados pueden entrar al panel.</p>
    </form>
  );
}
