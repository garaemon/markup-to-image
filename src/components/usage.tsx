import { URL_PARAMETERS, MarkupState } from "@/lib/url-state";
import {
  FileCode,
  Keyboard,
  Palette,
  Share2
} from "lucide-react";

export function Usage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-6">
      <section>
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
          How to Use
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="border rounded-md p-3 bg-card text-card-foreground shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                <FileCode className="w-4 h-4" />
              </div>
              1. Select Language
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Choose from LaTeX, Mermaid, Markdown, or Code using the tabs.
            </p>
          </div>

          <div className="border rounded-md p-3 bg-card text-card-foreground shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                <Keyboard className="w-4 h-4" />
              </div>
              2. Enter Content
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Type code or markup. Preview updates in real-time.
            </p>
          </div>

          <div className="border rounded-md p-3 bg-card text-card-foreground shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                <Palette className="w-4 h-4" />
              </div>
              3. Customize
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Adjust padding, theme, and window controls to fit your needs.
            </p>
          </div>

          <div className="border rounded-md p-3 bg-card text-card-foreground shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                <Share2 className="w-4 h-4" />
              </div>
              4. Share / Download
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Copy URL with state or download as image/PDF.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">URL Parameters</h2>
        <div className="rounded-md border">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-3 py-2 w-16">Key</th>
                <th className="px-3 py-2 w-32">Prop</th>
                <th className="px-3 py-2">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(Object.entries(URL_PARAMETERS) as [keyof MarkupState, typeof URL_PARAMETERS[keyof MarkupState]][]).map(([name, info]) => (
                <tr key={info.key} className="hover:bg-muted/30 transition-colors">
                  <td className="px-3 py-2 font-mono font-bold text-primary">{info.key}</td>
                  <td className="px-3 py-2 font-mono text-muted-foreground">{name}</td>
                  <td className="px-3 py-2">
                    <span className="text-foreground">{info.description}</span>
                    {info.options && (
                      <div className="mt-0.5 text-[10px] text-muted-foreground">
                        <span className="font-medium">Options:</span> {info.options.join(', ')}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
