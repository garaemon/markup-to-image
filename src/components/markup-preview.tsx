import { useRef } from "react"
import { MarkupState } from "@/lib/url-state"
import { LatexRenderer } from "./renderers/LatexRenderer"
import { MermaidRenderer } from "./renderers/MermaidRenderer"
import { MarkdownRenderer } from "./renderers/MarkdownRenderer"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Download, Copy, FileCode } from "lucide-react"
import { toPng, toSvg } from 'html-to-image';
import { toast } from "sonner"

interface MarkupPreviewProps {
  state: MarkupState
}

export function MarkupPreview({ state }: MarkupPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null)

  const handleCopyPng = async () => {
    if (!previewRef.current) return
    try {
      // html-to-image sometimes needs a little delay or multiple tries for complex layouts,
      // but usually works fine.
      const dataUrl = await toPng(previewRef.current, { pixelRatio: 2, backgroundColor: state.transparent ? undefined : (state.theme === 'dark' ? '#000' : '#fff') })
      const blob = await (await fetch(dataUrl)).blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      toast.success("Copied to clipboard as PNG")
    } catch (e) {
      console.error(e)
      toast.error("Failed to copy image")
    }
  }

  const handleDownloadPng = async () => {
    if (!previewRef.current) return
    try {
      const dataUrl = await toPng(previewRef.current, { pixelRatio: 2, backgroundColor: state.transparent ? undefined : (state.theme === 'dark' ? '#000' : '#fff') })
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
      const dataUrl = await toSvg(previewRef.current, { backgroundColor: state.transparent ? undefined : (state.theme === 'dark' ? '#000' : '#fff') })
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

  return (
    <div className="flex flex-col h-full gap-4">
        <div className="flex justify-end gap-2">
            <Button size="sm" variant="secondary" onClick={handleCopyPng}>
                <Copy className="w-4 h-4 mr-2" /> Copy PNG
            </Button>
            <Button size="sm" variant="outline" onClick={handleDownloadPng}>
                <Download className="w-4 h-4 mr-2" /> PNG
            </Button>
            <Button size="sm" variant="outline" onClick={handleDownloadSvg}>
                <FileCode className="w-4 h-4 mr-2" /> SVG
            </Button>
        </div>
        
        <div className="flex-1 flex items-center justify-center overflow-auto bg-secondary/50 rounded-lg p-8">
            <div 
                ref={previewRef}
                style={{
                    padding: `${state.padding}px`,
                    borderRadius: `${state.borderRadius}px`,
                }}
                className={cn(
                    "min-w-[300px] shadow-xl transition-all duration-300 fit-content",
                    state.transparent ? "bg-transparent" : (state.theme === 'dark' ? "bg-black" : "bg-white"),
                    state.theme === 'dark' ? 'text-white' : 'text-black'
                )}
            >
                {state.language === 'latex' && <LatexRenderer content={state.content} />}
                {state.language === 'mermaid' && <MermaidRenderer content={state.content} />}
                {state.language === 'markdown' && <MarkdownRenderer content={state.content} theme={state.theme} />}
            </div>
        </div>
    </div>
  )
}
