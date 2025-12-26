import { useEffect, useState } from 'react';
import { getHighlighter } from '@/lib/highlighter';

export function CodeRenderer({ content, theme }: { content: string, theme: 'light' | 'dark' }) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getHighlighter().then(highlighter => {
       if (!isMounted) return;
       try {
         // Default to typescript for now as we don't have language selector for Code tab yet
         const targetLang = 'typescript';
         
         const out = highlighter.codeToHtml(content, {
           lang: targetLang,
           theme: theme === 'dark' ? 'github-dark' : 'github-light'
         });
         setHtml(out);
       } catch (e) {
         console.error(e);
         setHtml(null); 
       }
    });
    return () => { isMounted = false; };
  }, [content, theme]);

  if (!html) {
    return <pre className="font-mono text-sm p-4"><code>{content}</code></pre>;
  }

  return <div dangerouslySetInnerHTML={{ __html: html }} className="[&>pre]:!bg-transparent [&>pre]:!p-0" />;
}
