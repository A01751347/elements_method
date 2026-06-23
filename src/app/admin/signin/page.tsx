import Image from "next/image";
import { signIn } from "@/shared/auth/config";
import { LOGO_PNG } from "@/components/brand/Logo";

export default function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <Image
            src={LOGO_PNG}
            width={64}
            height={64}
            alt="Elements Method"
            priority
          />
          <h1 className="mt-5 text-xl font-semibold tracking-tight text-zinc-900">
            Elements Method
          </h1>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500 font-medium">
            Admin
          </p>
        </div>
        <p className="text-sm text-zinc-700 leading-relaxed">
          Te enviamos un magic link a tu correo. El enlace expira en 15 minutos.
        </p>

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
      className="mt-6 space-y-3"
    >
      <label htmlFor="email" className="block text-xs uppercase tracking-[0.16em] text-zinc-500">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        className="w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-zinc-900"
      />
      <button
        type="submit"
        className="w-full rounded bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-800"
      >
        Enviarme el magic link
      </button>
      {error && (
        <p className="text-xs text-red-600">
          No pudimos enviarte el enlace. Verifica que tu email está en la lista de admins.
        </p>
      )}
    </form>
  );
}
