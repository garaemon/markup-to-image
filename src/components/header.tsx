import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"

interface HeaderProps {
  onShare: () => void
}

export function Header({ onShare }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-background">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
          M
        </div>
        <h1 className="text-xl font-bold">Markup to Image</h1>
      </div>
      <div>
         <Button variant="outline" size="sm" onClick={onShare}>
           <Share2 className="w-4 h-4 mr-2" />
           Share
         </Button>
      </div>
    </header>
  )
}
