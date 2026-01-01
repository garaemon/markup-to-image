import { useEffect, useState } from 'react';
import { getHighlighter } from '@/lib/highlighter';
import { cn } from '@/lib/utils';

export function CodeRenderer({ content, language, theme, showLineNumbers }: { content: string, language: string, theme: string, showLineNumbers?: boolean }) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const targetTheme = theme === 'light' ? 'github-light' : 
      theme === 'dark' ? 'github-dark' :
        theme;

    getHighlighter().then(highlighter => {
      if (!isMounted) {
        return;
      }
      try {
        const out = highlighter.codeToHtml(content, {
          lang: language,
          theme: targetTheme
        });
        setHtml(out);
      } catch (e) {
        console.warn(e);
        try {
          const out = highlighter.codeToHtml(content, {
            lang: 'text',
            theme: targetTheme
          });
          setHtml(out);
        } catch (e2) {
          console.error(e2);
          // Fallback to basic rendering if even text fails
          setHtml(`<pre><code>${content}</code></pre>`);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, [content, language, theme]);

  if (!html) {
    return <pre className="font-mono text-sm p-4"><code>{content}</code></pre>;
  }

  return <div 
    dangerouslySetInnerHTML={{ __html: html }} 
    className={cn(
      "[&>pre]:!bg-transparent [&>pre]:!p-0 [&>pre]:text-lg [&>pre]:leading-relaxed [&>pre]:whitespace-pre-wrap [&>pre]:break-words [&>pre]:font-mono",
      showLineNumbers && "show-line-numbers"
    )} 
  />;
}