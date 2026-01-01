import { useRef, useEffect, useState } from "react"
import { MarkupState } from "@/lib/url-state"
import { LatexRenderer } from "./renderers/LatexRenderer"
import { MermaidRenderer } from "./renderers/MermaidRenderer"
import { MarkdownRenderer } from "./renderers/MarkdownRenderer"
import { CodeRenderer } from "./renderers/CodeRenderer"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Download, Copy, FileCode, FileText } from "lucide-react"
import { domToPng, domToSvg, domToBlob } from 'modern-screenshot';
import { toast } from "sonner"
import { useReactToPrint } from "react-to-print"
import { getThemeColors } from "@/lib/highlighter"

interface MarkupPreviewProps {
  state: MarkupState
  onAutoWidthChange?: (width: number) => void
}

export function MarkupPreview({ state, onAutoWidthChange }: MarkupPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null)
  const [themeColors, setThemeColors] = useState<{ bg: string, fg: string }>({ bg: '#ffffff', fg: '#000000' })

  useEffect(() => {
    if (!previewRef.current || state.width !== 'auto' || !onAutoWidthChange) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === previewRef.current) {
          onAutoWidthChange(entry.contentRect.width);
        }
      }
    });

    observer.observe(previewRef.current);
    return () => observer.disconnect();
  }, [state.width, onAutoWidthChange]);

  useEffect(() => {
    let isMounted = true;
    const loadTheme = async () => {
      // Map legacy themes to shiki themes
      const themeName = state.theme === 'light' ? 'github-light' :
        state.theme === 'dark' ? 'github-dark' :
          state.theme;
        
      try {
        const colors = await getThemeColors(themeName);
        if (isMounted) {
          setThemeColors(colors);
        }
      } catch (e) {
        console.error('Failed to load theme colors', e);
      }
    };
    loadTheme();
    return () => {
      isMounted = false;
    };
  }, [state.theme]);

  const handleCopyPng = async () => {
    if (!previewRef.current) {
      return
    }
    try {
      const blob = await domToBlob(previewRef.current, { 
        scale: state.scale, 
        backgroundColor: state.transparent ? undefined : themeColors.bg 
      })
      
      if (!blob) {
        throw new Error("Failed to generate image blob")
      }
      
      if (!navigator.clipboard?.write) {
        throw new Error("Clipboard access is not available. Please make sure you are using HTTPS.")
      }
      
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      toast.success("Copied to clipboard as PNG")
    } catch (e) {
      console.error(e)
      toast.error(e instanceof Error ? e.message : "Failed to copy image")
    }
  }

  const handleDownloadPng = async () => {
    if (!previewRef.current) {
      return
    }
    try {
      const dataUrl = await domToPng(previewRef.current, { 
        scale: state.scale, 
        backgroundColor: state.transparent ? undefined : themeColors.bg 
      })
      const link = document.createElement('a')
      link.download = `markup-${Date.now()}.png`
      link.href = dataUrl
      link.click()
      toast.success("Downloaded PNG")
    } catch (e) {
      console.error(e)
      toast.error("Failed to download image")
    }
  }

  const handleDownloadSvg = async () => {
    if (!previewRef.current) {
      return
    }
    try {
      const dataUrl = await domToSvg(previewRef.current, { 
        backgroundColor: state.transparent ? undefined : themeColors.bg 
      })
      const link = document.createElement('a')
      link.download = `markup-${Date.now()}.svg`
      link.href = dataUrl
      link.click()
      toast.success("Downloaded SVG")
    } catch (e) {
      console.error(e)
      toast.error("Failed to download SVG")
    }
  }

  const handleDownloadPdf = useReactToPrint({
    contentRef: previewRef,
    documentTitle: `markup-${Date.now()}`,
    onAfterPrint: () => toast.success("Printed PDF"),
    onPrintError: () => toast.error("Failed to print PDF"),
  })

  // Determine if theme is dark for UI elements logic (like window controls)
  const isDarkTheme = ['dark', 'github-dark', 'dracula', 'monokai', 'nord', 'material-theme-ocean', 'solarized-dark'].includes(state.theme);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="secondary" className="hover:bg-secondary-foreground/10" onClick={handleCopyPng}>
          <Copy className="w-4 h-4 mr-2" /> Copy PNG
        </Button>
        <Button size="sm" variant="outline" onClick={handleDownloadPng}>
          <Download className="w-4 h-4 mr-2" /> PNG
        </Button>
        <Button size="sm" variant="outline" onClick={handleDownloadSvg}>
          <FileCode className="w-4 h-4 mr-2" /> SVG
        </Button>
        <Button size="sm" variant="outline" onClick={() => handleDownloadPdf()}>
          <FileText className="w-4 h-4 mr-2" /> PDF
        </Button>
      </div>
        
      <div className={cn(
        "flex-1 flex overflow-auto rounded-lg p-8",
        isDarkTheme ? "bg-neutral-900" : "bg-secondary/50"
      )}>
        <div
          ref={previewRef}
          style={{
            borderRadius: `${state.borderRadius}px`,
            width: state.width === 'auto' ? 'auto' : `${state.width}px`,
            backgroundColor: state.transparent ? 'transparent' : themeColors.bg,
            color: themeColors.fg,
            // Override prose colors to match theme
            '--tw-prose-body': themeColors.fg,
            '--tw-prose-headings': themeColors.fg,
            '--tw-prose-lead': themeColors.fg,
            '--tw-prose-links': themeColors.fg,
            '--tw-prose-bold': themeColors.fg,
            '--tw-prose-counters': themeColors.fg,
            '--tw-prose-bullets': themeColors.fg,
            '--tw-prose-hr': themeColors.fg,
            '--tw-prose-quotes': themeColors.fg,
            '--tw-prose-quote-borders': themeColors.fg,
            '--tw-prose-captions': themeColors.fg,
            '--tw-prose-code': themeColors.fg,
            '--tw-prose-pre-code': themeColors.fg,
            '--tw-prose-pre-bg': themeColors.bg,
            '--tw-prose-th-borders': themeColors.fg,
            '--tw-prose-td-borders': themeColors.fg,
            // Override prose-invert colors to match theme
            '--tw-prose-invert-body': themeColors.fg,
            '--tw-prose-invert-headings': themeColors.fg,
            '--tw-prose-invert-lead': themeColors.fg,
            '--tw-prose-invert-links': themeColors.fg,
            '--tw-prose-invert-bold': themeColors.fg,
            '--tw-prose-invert-counters': themeColors.fg,
            '--tw-prose-invert-bullets': themeColors.fg,
            '--tw-prose-invert-hr': themeColors.fg,
            '--tw-prose-invert-quotes': themeColors.fg,
            '--tw-prose-invert-quote-borders': themeColors.fg,
            '--tw-prose-invert-captions': themeColors.fg,
            '--tw-prose-invert-code': themeColors.fg,
            '--tw-prose-invert-pre-code': themeColors.fg,
            '--tw-prose-invert-pre-bg': themeColors.bg,
            '--tw-prose-invert-th-borders': themeColors.fg,
            '--tw-prose-invert-td-borders': themeColors.fg,
          } as React.CSSProperties}
          className={cn(
            "min-w-[300px] shadow-xl transition-all duration-300 w-fit m-auto flex-shrink-0 fit-content",
            state.window ? "mockup-window border border-neutral-200 dark:border-neutral-800" : "",
            isDarkTheme ? "dark" : ""
          )}
        >
          <div style={{ padding: `${state.padding}px` }}>
            {state.language === 'latex' && <LatexRenderer content={state.content} />}
            {state.language === 'mermaid' && <MermaidRenderer content={state.content} />}
            {state.language === 'code' && <CodeRenderer content={state.content} language={state.codeLanguage} theme={state.theme} showLineNumbers={state.showLineNumbers} />}
            {state.language === 'markdown' && <MarkdownRenderer content={state.content} theme={state.theme} showLineNumbers={state.showLineNumbers} />}
          </div>
        </div>
      </div>
    </div>
  )
}
