import { useRef, useEffect, useState } from "react"
import { MarkupState } from "@/lib/url-state"
import { LatexRenderer } from "./renderers/LatexRenderer"
import { MermaidRenderer } from "./renderers/MermaidRenderer"
import { MarkdownRenderer } from "./renderers/MarkdownRenderer"
import { CodeRenderer } from "./renderers/CodeRenderer"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Download, Copy, FileCode, FileText } from "lucide-react"
import { toPng, toSvg, toBlob } from 'html-to-image';
import { toast } from "sonner"
import { useReactToPrint } from "react-to-print"
import { getThemeColors } from "@/lib/highlighter"

interface MarkupPreviewProps {
  state: MarkupState
}

export function MarkupPreview({ state }: MarkupPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null)
  const [themeColors, setThemeColors] = useState<{ bg: string, fg: string }>({ bg: '#ffffff', fg: '#000000' })

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
    return () => { isMounted = false; };
  }, [state.theme]);

  const handleCopyPng = async () => {
    if (!previewRef.current) return
    try {
      const blob = await toBlob(previewRef.current, { pixelRatio: 2, backgroundColor: state.transparent ? undefined : themeColors.bg })
      
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
    if (!previewRef.current) return
    try {
      const dataUrl = await toPng(previewRef.current, { pixelRatio: 2, backgroundColor: state.transparent ? undefined : themeColors.bg })
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
    if (!previewRef.current) return
    try {
      const dataUrl = await toSvg(previewRef.current, { backgroundColor: state.transparent ? undefined : themeColors.bg })
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
  const isDarkTheme = ['dark', 'github-dark', 'dracula', 'monokai', 'nord', 'material-theme-ocean'].includes(state.theme);

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
            "flex-1 flex items-center justify-center overflow-auto rounded-lg p-8",
            isDarkTheme ? "bg-neutral-900" : "bg-secondary/50"
        )}>
            <div 
                ref={previewRef}
                style={{
                    borderRadius: `${state.borderRadius}px`,
                    backgroundColor: state.transparent ? 'transparent' : themeColors.bg,
                    color: themeColors.fg,
                }}
                className={cn(
                    "min-w-[300px] shadow-xl transition-all duration-300 fit-content",
                    state.window ? "mockup-window border border-neutral-200 dark:border-neutral-800" : "",
                )}
            >
                <div style={{ padding: `${state.padding}px` }}>
                    {state.language === 'latex' && <LatexRenderer content={state.content} />}
                    {state.language === 'mermaid' && <MermaidRenderer content={state.content} />}
                    {state.language === 'code' && <CodeRenderer content={state.content} language={state.codeLanguage} theme={state.theme} />}
                    {state.language === 'markdown' && <MarkdownRenderer content={state.content} theme={state.theme} />}
                </div>
            </div>
        </div>
    </div>
  )
}
