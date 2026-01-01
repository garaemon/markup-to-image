import { URL_PARAMETERS, MarkupState } from "@/lib/url-state";
import { CodeBlock } from "@/components/code-block";
import {
  FileCode,
  Keyboard,
  Palette,
  Share2,
  Terminal,
  Copy,
  Check
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function Usage() {
  const [origin, setOrigin] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrigin(window.location.origin);
  }, []);

  const emacsCode = `(defun markup-share-region (start end)
  "Render the selected region using the markup service."
  (interactive "r")
  (let ((url-base "${origin || 'http://localhost:3000'}") ;; Change this to your deployed URL
        (content (url-hexify-string (buffer-substring-no-properties start end)))
        (lang (cond ((derived-mode-p 'markdown-mode) "markdown")
                    ((derived-mode-p 'latex-mode) "latex")
                    (t "code")))
        (code-lang (replace-regexp-in-string "-mode$" "" (symbol-name major-mode))))
    (browse-url (format "%s/?l=%s&cl=%s&txt=%s" url-base lang code-lang content))))`;

  const handleCopy = () => {
    navigator.clipboard.writeText(emacsCode);
    setCopied(true);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

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
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
          Emacs Integration
        </h2>
        <div className="border rounded-md bg-card text-card-foreground shadow-sm p-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-md text-primary shrink-0">
              <Terminal className="w-6 h-6" />
            </div>
            <div className="space-y-4 w-full min-w-0">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Add the following function to your Emacs configuration to share selected regions directly to this service.
                <br />
                <span className="text-xs text-muted-foreground/80">
                  Note: The code sends uncompressed text via the `txt` parameter. The application will automatically compress it upon loading.
                </span>
              </p>
              <div className="relative group">
                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={handleCopy}
                    className="p-2 bg-background/80 hover:bg-background border rounded-md shadow-sm text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="bg-muted p-4 rounded-md border overflow-hidden">
                  <CodeBlock
                    language="emacs-lisp"
                    code={emacsCode}
                  />
                </div>
              </div>
            </div>
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
              {/* Manual entry for the 'txt' parameter as it's not part of the state object but valid in URL */}
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="px-3 py-2 font-mono font-bold text-primary">txt</td>
                <td className="px-3 py-2 font-mono text-muted-foreground">content (alt)</td>
                <td className="px-3 py-2">
                  <span className="text-foreground">Uncompressed text content (alias for &apos;text&apos;). Falls back to this if &apos;c&apos; is missing.</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
