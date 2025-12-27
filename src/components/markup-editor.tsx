import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { MarkupState, Language, Theme } from "@/lib/url-state"
import { EXAMPLES, CODE_EXAMPLES } from "@/lib/examples"
import { SUPPORTED_LANGUAGES } from "@/lib/highlighter"

interface MarkupEditorProps {
  state: MarkupState
  onChange: (updates: Partial<MarkupState>) => void
}

export function MarkupEditor({ state, onChange }: MarkupEditorProps) {
  const currentExamples = state.language === 'code' 
    ? (CODE_EXAMPLES[state.codeLanguage] || [])
    : EXAMPLES[state.language];

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        <Label>Language</Label>
        <Tabs 
          value={state.language} 
          onValueChange={(v) => onChange({ language: v as Language })}
          className="w-full"
        >
          <TabsList className="w-full">
            <TabsTrigger value="latex" className="flex-1">LaTeX</TabsTrigger>
            <TabsTrigger value="mermaid" className="flex-1">Mermaid</TabsTrigger>
            <TabsTrigger value="code" className="flex-1">Code</TabsTrigger>
            <TabsTrigger value="markdown" className="flex-1">Markdown</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Content</Label>
          <div className="flex gap-2">
            {state.language === 'code' && (
               <Select
                 value={state.codeLanguage}
                 onValueChange={(v) => onChange({ codeLanguage: v })}
               >
                 <SelectTrigger className="w-[140px] h-8 text-xs">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   {SUPPORTED_LANGUAGES.map((lang) => (
                     <SelectItem key={lang} value={lang}>
                       {lang}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
            )}
            {currentExamples.map((example) => (
              <Button
                key={example.name}
                variant="outline"
                size="sm"
                className="h-6 text-xs"
                onClick={() => onChange({ content: example.content })}
              >
                {example.name}
              </Button>
            ))}
          </div>
        </div>
        <Textarea
          value={state.content}
          onChange={(e) => onChange({ content: e.target.value })}
          className="font-mono h-[300px] resize-y"
          placeholder="Enter your markup here..."
        />
      </div>

      <div className="space-y-6 border-t pt-6">
        <h3 className="font-medium text-sm text-muted-foreground">Appearance</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Padding</Label>
            <span className="text-xs text-muted-foreground">{state.padding}px</span>
          </div>
          <Slider
            value={[state.padding]}
            onValueChange={([v]) => onChange({ padding: v })}
            max={128}
            step={4}
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Corner Radius</Label>
            <span className="text-xs text-muted-foreground">{state.borderRadius}px</span>
          </div>
          <Slider
            value={[state.borderRadius]}
            onValueChange={([v]) => onChange({ borderRadius: v })}
            max={40}
            step={2}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="transparent-mode">Transparent Background</Label>
          <Switch
            id="transparent-mode"
            checked={state.transparent}
            onCheckedChange={(v) => onChange({ transparent: v })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="window-mode">Window Control</Label>
          <Switch
            id="window-mode"
            checked={state.window}
            onCheckedChange={(v) => onChange({ window: v })}
          />
        </div>

        <div className="space-y-3">
          <Label>Theme</Label>
          <Select 
            value={state.theme} 
            onValueChange={(v) => onChange({ theme: v as Theme })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
