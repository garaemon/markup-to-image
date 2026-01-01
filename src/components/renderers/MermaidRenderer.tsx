import mermaid from 'mermaid';
import { useEffect, useState } from 'react';

// Initialize only once
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
});

export function MermaidRenderer({ content }: { content: string }) {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const render = async () => {
      try {
        const id = `mermaid-${Date.now()}`;
        // mermaid.render returns an object with svg property in newer versions, or string in older.
        // Checking types or assuming string based on recent versions.
        const result = await mermaid.render(id, content);
        if (isMounted) {
          setSvg(result.svg);
          setError(null);
        }
      } catch (e: unknown) {
        if (isMounted) {
          if (e instanceof Error) {
            setError(e.message);
          } else {
            setError(String(e));
          }
        }
      }
    };

    render();
    return () => {
      isMounted = false; 
    };
  }, [content]);

  if (error) {
    return <div className="text-red-500 font-mono text-sm p-4 whitespace-pre-wrap">{error}</div>;
  }

  return <div dangerouslySetInnerHTML={{ __html: svg }} className="flex justify-center" />;
}
