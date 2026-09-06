import { Etiqueta, Volver } from "../../_components/ui";

export default function CheckEmailPage() {
  return (
    <div className="login-envoltorio">
      <div className="login-hoja">
        <Etiqueta>Revisa tu correo</Etiqueta>
        <h1 className="login-tagline chica">Te enviamos un enlace para entrar al panel.</h1>
        <p>
          Expira en 15 minutos. Si no lo ves, revisa la carpeta de spam antes de pedir uno nuevo.
        </p>
        <Volver href="/admin/signin">Volver a intentar</Volver>
      </div>
    </div>
  );
}
