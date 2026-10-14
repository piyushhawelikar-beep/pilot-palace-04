import { Fragment } from "react";

const TOKEN =
  /(\/\/.*$|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b(?:import|export|from|const|let|return|function|default|interface|type|new|if|else)\b|<\/?[A-Za-z][\w.]*|\b\d+\b)/gm;

function classify(t: string) {
  if (t.startsWith("//")) return "text-muted-foreground italic";
  if (/^["'`]/.test(t)) return "text-success";
  if (t.startsWith("<")) return "text-cyan";
  if (/^\d/.test(t)) return "text-warning";
  return "text-primary";
}

export function CodeView({ code, errorLines = [] }: { code: string; errorLines?: number[] }) {
  return (
    <pre
      className="h-full overflow-auto bg-code py-3 font-mono text-[12.5px] leading-6"
      tabIndex={0}
      aria-label="Code editor (read-only sample)"
    >
      {code.split("\n").map((line, i) => {
        const parts = line.split(TOKEN);
        const err = errorLines.includes(i + 1);
        return (
          <div key={i} className={err ? "bg-destructive/10" : undefined}>
            <span className="inline-block w-10 select-none pr-3 text-right text-muted-foreground/50">
              {i + 1}
            </span>
            {parts.map((p, j) =>
              j % 2 ? (
                <span key={j} className={classify(p)}>
                  {p}
                </span>
              ) : (
                <Fragment key={j}>{p}</Fragment>
              ),
            )}
            {err && <span className="ml-3 text-destructive">● error</span>}
          </div>
        );
      })}
    </pre>
  );
}
