import { URL_PARAMETERS, MarkupState } from "@/lib/url-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Usage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      <section>
        <h2 className="text-2xl font-bold mb-4">How to Use</h2>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1. Select Language</CardTitle>
            </CardHeader>
            <CardContent>
              Choose from LaTeX, Mermaid, Markdown, or Code using the tabs at the top of the editor.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">2. Enter Content</CardTitle>
            </CardHeader>
            <CardContent>
              Type your code or markup in the editor. The preview will update in real-time on the right side.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">3. Customize Appearance</CardTitle>
            </CardHeader>
            <CardContent>
              Adjust settings like padding, border radius, themes, and window controls to fit your needs.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">4. Share and Download</CardTitle>
            </CardHeader>
            <CardContent>
              Use the Share button to copy the URL with your current state, or use the Download button to save the result as an image or PDF.
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">URL Parameters</h2>
        <p className="mb-4 text-muted-foreground">
          You can control the application state directly via URL parameters.
        </p>
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-4 py-3">Key</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(Object.entries(URL_PARAMETERS) as [keyof MarkupState, typeof URL_PARAMETERS[keyof MarkupState]][]).map(([name, info]) => (
                <tr key={info.key} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-primary">{info.key}</td>
                  <td className="px-4 py-3 font-mono text-xs">{name}</td>
                  <td className="px-4 py-3">
                    {info.description}
                    {info.options && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        <span className="font-semibold">Options:</span> {info.options.join(', ')}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">CLI Usage</h2>
        <p className="mb-4 text-muted-foreground">
          You can generate shareable URLs programmatically using Node.js and the <code>lz-string</code> library.
        </p>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Generate Link from Terminal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Run this command to compress a file and generate a shareable link:
              </p>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
{`# Compress a file and output the URL
node -e "
  const lz = require('lz-string');
  const fs = require('fs');
  const content = fs.readFileSync('example.ts', 'utf8');
  const compressed = lz.compressToEncodedURIComponent(content);
  console.log('https://markup-preview.vercel.app/?l=code&cl=typescript&c=' + compressed);
"`}
              </pre>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Using with Pipe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                You can also pipe content directly to generate a link:
              </p>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
{`echo "const hello = 'world';" | node -e "
  const lz = require('lz-string');
  process.stdin.on('data', data => {
    const compressed = lz.compressToEncodedURIComponent(data.toString());
    console.log('https://markup-preview.vercel.app/?l=code&cl=typescript&c=' + compressed);
  });
"`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
