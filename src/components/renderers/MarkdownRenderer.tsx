import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useState } from 'react';
import { createHighlighter, Highlighter } from 'shiki';

// Highlighter singleton
let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-light', 'github-dark', 'dracula'],
      langs: ['javascript', 'typescript', 'python', 'json', 'html', 'css', 'bash', 'markdown', 'yaml', 'tsx', 'jsx'],
    });
  }
  return highlighterPromise;
}

interface CodeBlockProps {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
    [key: string]: unknown;
}

const CodeBlock = ({ inline, className, children, ...props }: CodeBlockProps) => {
  const match = /language-(\w+)/.exec(className || '');
  const lang = match ? match[1] : 'text';
  const code = String(children).replace(/\n$/, '');
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    if (inline) return;

    let isMounted = true;
    getHighlighter().then(highlighter => {
       if (!isMounted) return;
       try {
         const loadedLangs = highlighter.getLoadedLanguages();
         const targetLang = loadedLangs.includes(lang) ? lang : 'text';
         
         const out = highlighter.codeToHtml(code, {
           lang: targetLang,
           theme: 'github-light' // TODO: Support theme switching
         });
         setHtml(out);
       } catch (e) {
         console.error(e);
         setHtml(null); 
       }
    });
    return () => { isMounted = false; };
  }, [code, lang, inline]);

  if (inline) {
    return <code className={className} {...props}>{children}</code>;
  }

  if (!html) {
    return <pre className={className} {...props}><code>{children}</code></pre>;
  }

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export function MarkdownRenderer({ content, theme }: { content: string, theme: 'light' | 'dark' }) {
  // Theme prop is currently unused but prepared for future theme support
  // For now, shiki uses fixed github-light.
  // To use theme, we need to pass it to CodeBlock via Context or refactoring CodeBlock.
  // Suppress unused warning by using it in a trivial way or ignore.
  void theme;

  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
            code: CodeBlock
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
