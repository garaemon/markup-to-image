import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { MarkupState, Language, Theme, defaultState } from "@/lib/url-state"
import { EXAMPLES, CODE_EXAMPLES } from "@/lib/examples"
import { SUPPORTED_LANGUAGES } from "@/lib/highlighter"
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-latex';
import 'prismjs/themes/prism-tomorrow.css';
import { cn } from "@/lib/utils"

// Define Mermaid grammar for Prism
if (typeof window !== 'undefined' && Prism) {
  Prism.languages.mermaid = {
    'comment': /%%.*/,
    'string': {
      pattern: /"(?:""|[^"])*"/,
      greedy: true
    },
    'keyword': /\b(?:graph|flowchart|sequenceDiagram|gantt|classDiagram|stateDiagram-v2|stateDiagram|erDiagram|pie|journey|gitGraph|requirementDiagram|mindmap|timeline|quadrantChart|C4Context|C4Container|C4Component|C4Dynamic|C4Deployment|sankey-beta|TD|BT|RL|LR|subgraph|end|participant|actor|links?|over|activate|deactivate|note|as|rect|loop|alt|else|opt|par|and|critical|option|break|try|catch|finally|autonumber)\b/,
    'operator': /--?>|==?>|--|==|\||:|-|\+/,
    'punctuation': /[(){}\[\]]/
  };
}

interface MarkupEditorProps {
  state: MarkupState
  onChange: (updates: Partial<MarkupState>) => void
  autoWidth?: number
}

export function MarkupEditor({ state, onChange, autoWidth }: MarkupEditorProps) {
  const currentExamples = state.language === 'code' 
    ? (CODE_EXAMPLES[state.codeLanguage] || [])
    : EXAMPLES[state.language];

  const highlight = (code: string) => {
    let lang = Prism.languages.plaintext;
    let langName = 'plaintext';

    if (state.language === 'markdown') {
      lang = Prism.languages.markdown;
      langName = 'markdown';
    } else if (state.language === 'latex') {
      lang = Prism.languages.latex || Prism.languages.markdown;
      langName = 'latex';
    } else if (state.language === 'mermaid') {
      lang = Prism.languages.mermaid || Prism.languages.markdown;
      langName = 'mermaid';
    } else if (state.language === 'code') {
      // Map code languages to Prism keys if they differ
      const langMap: Record<string, string> = {
        'html': 'markup',
      };
      
      const prismKey = langMap[state.codeLanguage] || state.codeLanguage;
      
      if (Prism.languages[prismKey]) {
        lang = Prism.languages[prismKey];
        langName = prismKey;
      }
    }

    return Prism.highlight(code, lang, langName);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        <Label>Language</Label>
        <Tabs 
          value={state.language} 
          onValueChange={(v) => {
            const lang = v as Language;
            const updates: Partial<MarkupState> = { language: lang };
            
            // If content is one of the default/example contents of the previous language,
            // or if it's the initial default, switch it to the first example of the new language.
            const allExamples = [...EXAMPLES.latex, ...EXAMPLES.mermaid, ...EXAMPLES.markdown, ...Object.values(CODE_EXAMPLES).flat()];
            const isExample = allExamples.some(ex => ex.content === state.content);
            
            if (isExample || state.content === defaultState.content) {
              const nextExamples = lang === 'code' 
                ? (CODE_EXAMPLES[state.codeLanguage] || [])
                : EXAMPLES[lang];
              if (nextExamples.length > 0) {
                updates.content = nextExamples[0].content;
              }
            }
            
            onChange(updates);
          }}
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
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Label>Content</Label>
            {state.language === 'code' && (
              <Select
                value={state.codeLanguage}
                onValueChange={(v) => onChange({ codeLanguage: v })}
              >
                <SelectTrigger className="w-[140px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[...SUPPORTED_LANGUAGES].sort().map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
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
        <div className={cn(
          "border-input focus-within:border-ring focus-within:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive min-h-[300px] w-full rounded-md border bg-zinc-800 text-base text-gray-300 shadow-xs transition-[color,box-shadow] outline-none focus-within:ring-[3px] md:text-sm overflow-hidden",
          "flex flex-col" // Ensure Editor takes height
        )}>
          <Editor
            value={state.content}
            onValueChange={(code) => onChange({ content: code })}
            highlight={highlight}
            padding={12}
            className="font-mono h-full min-h-[300px]"
            textareaClassName="focus:outline-none"
            placeholder="Enter your markup here..."
            style={{
              fontFamily: '"Fira Code", "Fira Mono", monospace',
              fontSize: 14,
              backgroundColor: 'transparent',
              minHeight: '300px',
            }}
          />
        </div>
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

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Width</Label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Auto</span>
              <Switch
                checked={state.width === 'auto'}
                onCheckedChange={(v) => onChange({ width: v ? 'auto' : (Math.round(autoWidth || 600)) })}
              />
            </div>
          </div>
          {state.width !== 'auto' && (
            <div className="flex gap-2 items-center">
              <Slider
                value={[state.width]}
                onValueChange={([v]) => onChange({ width: v })}
                min={100}
                max={4000}
                step={10}
                className="flex-1"
              />
              <Input
                type="number"
                value={state.width}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) onChange({ width: val });
                }}
                className="w-20 h-8"
              />
              <span className="text-xs text-muted-foreground">px</span>
            </div>
          )}
          {state.width !== 'auto' && (
             <p className="text-[10px] text-muted-foreground italic">
                Export size: {Math.round(state.width * state.scale)}px wide
             </p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Export Scale</Label>
            <span className="text-xs text-muted-foreground">{state.scale}x</span>
          </div>
          <Slider
            value={[state.scale]}
            onValueChange={([v]) => onChange({ scale: v })}
            min={1}
            max={5}
            step={0.5}
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

        {(state.language === 'code' || state.language === 'markdown') && (
          <div className="flex items-center justify-between">
            <Label htmlFor="line-numbers">Show Line Numbers</Label>
            <Switch
              id="line-numbers"
              checked={state.showLineNumbers}
              onCheckedChange={(v) => onChange({ showLineNumbers: v })}
            />
          </div>
        )}

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
              <SelectItem value="dracula">Dracula</SelectItem>
              <SelectItem value="monokai">Monokai</SelectItem>
              <SelectItem value="nord">Nord</SelectItem>
              <SelectItem value="material-theme-ocean">Material Ocean</SelectItem>
              <SelectItem value="solarized-light">Solarized Light</SelectItem>
              <SelectItem value="solarized-dark">Solarized Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
