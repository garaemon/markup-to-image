import { useEffect, useState } from 'react';
import { getHighlighter } from '@/lib/highlighter';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface CodeBlockProps {
  code: string;
  language: string;
  className?: string;
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const [html, setHtml] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    let isMounted = true;
    const theme = resolvedTheme === 'dark' ? 'github-dark' : 'github-light';

    getHighlighter().then(highlighter => {
      if (!isMounted) {
        return;
      }
      try {
        const out = highlighter.codeToHtml(code, {
          lang: language,
          theme: theme
        });
        setHtml(out);
      } catch (e) {
        console.error(e);
        setHtml(null); // Fallback to plain text on error
      }
    });
    return () => {
      isMounted = false; 
    };
  }, [code, language, resolvedTheme, mounted]);

  if (!mounted) {
    return (
      <pre className={cn("font-mono text-xs", className)}>
        {code}
      </pre>
    );
  }

  if (!html) {
    return (
      <pre className={cn("font-mono text-xs", className)}>
        {code}
      </pre>
    );
  }

  return <div
    dangerouslySetInnerHTML={{ __html: html }}
    className={cn(
      "overflow-hidden",
      "[&>pre]:!bg-transparent [&>pre]:!p-0 [&>pre]:font-mono [&>pre]:text-xs [&>pre]:overflow-x-auto",
      className
    )}
  />;
}
