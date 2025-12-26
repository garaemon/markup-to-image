import 'katex/dist/katex.min.css';
import katex from 'katex';
import { useMemo } from 'react';

export function LatexRenderer({ content }: { content: string }) {
  const result = useMemo(() => {
    try {
      const html = katex.renderToString(content, {
        throwOnError: true,
        displayMode: true,
      });
      return { html, error: null };
    } catch (e: unknown) {
      return { html: null, error: e instanceof Error ? e.message : String(e) };
    }
  }, [content]);

  if (result.error) {
    return <div className="text-red-500 font-mono text-sm p-4 whitespace-pre-wrap">{result.error}</div>;
  }

  return <div dangerouslySetInnerHTML={{ __html: result.html || '' }} className="text-2xl" />;
}