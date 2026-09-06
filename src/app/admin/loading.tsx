/**
 * Armazón de carga del admin: mismo esqueleto que una página típica
 * (encabezado + 4 cifras + tabla de 5 filas). Debe sentirse instantáneo.
 */
export default function AdminLoading() {
  return (
    <div>
      <div className="page-header">
        <div>
          <span className="esqueleto" style={{ width: 220, height: 34 }} />
          <span className="esqueleto esqueleto-60" style={{ width: 320, height: 14, marginTop: 10, display: "block" }} />
        </div>
      </div>

      <div className="cifra-grid" style={{ marginBottom: 32 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="cifra">
            <span className="esqueleto esqueleto-70" style={{ width: 90, height: 10 }} />
            <span className="esqueleto" style={{ width: 110, height: 34, marginTop: 10, display: "block" }} />
          </div>
        ))}
      </div>

      <div className="tabla">
        <table>
          <tbody>
            {[0, 1, 2, 3, 4].map((i) => (
              <tr key={i}>
                <td style={{ padding: "15px 16px" }}>
                  <span className="esqueleto esqueleto-60" style={{ width: `${70 - i * 6}%`, height: 14 }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
