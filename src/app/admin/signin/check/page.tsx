import Image from "next/image";
import { LOGO_PNG } from "@/components/brand/Logo";

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="flex flex-col items-center mb-8">
          <Image
            src={LOGO_PNG}
            width={64}
            height={64}
            alt="Elements Method"
            priority
          />
          <h1 className="mt-5 text-xl font-semibold tracking-tight text-zinc-900">
            Revisa tu correo
          </h1>
        </div>
        <p className="text-sm text-zinc-700 leading-relaxed">
          Te enviamos un enlace para entrar al panel. Expira en 15 minutos. Si no lo
          ves, revisa la carpeta de spam.
        </p>
      </div>
    </div>
  );
}
