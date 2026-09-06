/**
 * Minimal markdown renderer for legal documents. Supports the subset the
 * texts in src/data/legalDocuments.ts use: headings (#, ##, ###), blockquotes
 * (>), unordered lists (-), bold (**), inline code (`), rules (---) and
 * paragraphs. Tokens should be filled before rendering; anything left as
 * ‹TOKEN› is shown as-is so a missing datum is visible.
 *
 * Intentionally no third-party MD lib — no hooks, so it renders on the server.
 */
export function LegalMarkdown({ body }: { body: string }) {
  const lines = body.split("\n");
  const out: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let key = 0;

  const flushList = () => {
    if (!listBuffer.length) return;
    out.push(
      <ul key={key++} className="list-disc pl-6 space-y-1">
        {listBuffer.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: inlineMd(item) }} />
        ))}
      </ul>,
    );
    listBuffer = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }
    if (line.startsWith("- ")) {
      listBuffer.push(line.slice(2));
      continue;
    }
    flushList();
    if (line.startsWith("> ")) {
      out.push(
        <blockquote
          key={key++}
          className="border-l-4 border-[var(--color-gold-deep)] bg-[var(--color-paper-warm)] not-italic px-5 py-3 text-sm"
          dangerouslySetInnerHTML={{ __html: inlineMd(line.slice(2)) }}
        />,
      );
    } else if (line.startsWith("### ")) {
      out.push(
        <h3 key={key++} className="text-lg" dangerouslySetInnerHTML={{ __html: inlineMd(line.slice(4)) }} />,
      );
    } else if (line.startsWith("## ")) {
      out.push(
        <h2 key={key++} className="text-2xl" dangerouslySetInnerHTML={{ __html: inlineMd(line.slice(3)) }} />,
      );
    } else if (line.startsWith("# ")) {
      out.push(
        <h1 key={key++} className="text-3xl" dangerouslySetInnerHTML={{ __html: inlineMd(line.slice(2)) }} />,
      );
    } else if (line === "---") {
      out.push(<hr key={key++} />);
    } else {
      out.push(<p key={key++} dangerouslySetInnerHTML={{ __html: inlineMd(line) }} />);
    }
  }
  flushList();
  return <>{out}</>;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inlineMd(s: string): string {
  return escapeHtml(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, '<code class="font-mono text-sm bg-[var(--color-paper-warm)] px-1.5 py-0.5">$1</code>')
    .replace(/‹([A-Za-z0-9_]+)›/g, '<span class="font-mono text-xs bg-amber-100 text-amber-900 px-1.5 py-0.5">‹$1›</span>')
    .replace(/\{\{([A-Za-z0-9_]+)\}\}/g, '<span class="font-mono text-xs bg-amber-100 text-amber-900 px-1.5 py-0.5">{{$1}}</span>');
}
