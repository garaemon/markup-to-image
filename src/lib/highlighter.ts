import { createHighlighter, Highlighter } from 'shiki';

let highlighterPromise: Promise<Highlighter> | null = null;

export const SUPPORTED_LANGUAGES = [
  'bash', 'bibtex', 'c', 'cpp', 'css', 'emacs-lisp', 'go', 'html', 
  'java', 'javascript', 'json', 'jsx', 'kotlin', 'latex', 'lisp', 
  'markdown', 'mermaid', 'objective-c', 'perl', 'php', 'python', 'r', 
  'ruby', 'rust', 'swift', 'system-verilog', 'toml', 'tsx', 'typescript', 
  'vhdl', 'yaml'
];

export const SUPPORTED_THEMES = [
  'github-light', 'github-dark', 'dracula', 
  'monokai', 'nord', 'material-theme-ocean',
  'solarized-light', 'solarized-dark'
];

export function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: SUPPORTED_THEMES,
      langs: SUPPORTED_LANGUAGES,
    }).catch(e => {
        console.error('Failed to create highlighter:', e);
        throw e;
    });
  }
  return highlighterPromise;
}

export async function getThemeColors(theme: string) {
  const highlighter = await getHighlighter();
  const themeReg = highlighter.getTheme(theme);
  return {
    bg: themeReg.bg,
    fg: themeReg.fg,
  };
}