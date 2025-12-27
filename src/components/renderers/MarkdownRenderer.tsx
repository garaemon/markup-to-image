import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useState, useMemo } from 'react';
import { getHighlighter } from '@/lib/highlighter';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CodeBlock = ({ inline, className, children, theme, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || '');
  const lang = match ? match[1] : 'text';
  const code = String(children).replace(/\n$/, '');
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    if (inline) return;

    let isMounted = true;
    const targetTheme = theme === 'light' ? 'github-light' : 
                        theme === 'dark' ? 'github-dark' : 
                        theme;

    getHighlighter().then(highlighter => {
       if (!isMounted) return;
       try {
         const loadedLangs = highlighter.getLoadedLanguages();
         const targetLang = loadedLangs.includes(lang) ? lang : 'text';
         
         const out = highlighter.codeToHtml(code, {
           lang: targetLang,
           theme: targetTheme
         });
         setHtml(out);
       } catch (e) {
         console.error(e);
         setHtml(null); 
       }
    });
    return () => { isMounted = false; };
  }, [code, lang, inline, theme]);

  if (inline) {
    return <code className={className} {...props}>{children}</code>;
  }

  if (!html) {
    return <pre className={className} {...props}><code>{children}</code></pre>;
  }

  return <div dangerouslySetInnerHTML={{ __html: html }} className="[&>pre]:!bg-transparent [&>pre]:!p-0 [&>pre]:text-base [&>pre]:leading-relaxed [&>pre]:whitespace-pre-wrap [&>pre]:break-words my-4" />;
};

export function MarkdownRenderer({ content, theme }: { content: string, theme: string }) {
  const components = useMemo(() => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code: (props: any) => <CodeBlock {...props} theme={theme} />
  }), [theme]);

  return (
    <div className="prose dark:prose-invert max-w-none prose-pre:my-0 prose-code:before:content-none prose-code:after:content-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
