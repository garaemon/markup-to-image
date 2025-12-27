import { createHighlighter, Highlighter } from 'shiki';

let highlighterPromise: Promise<Highlighter> | null = null;

export const SUPPORTED_LANGUAGES = [
  'javascript', 'typescript', 'python', 'json', 'html', 'css', 'bash', 
  'markdown', 'yaml', 'tsx', 'jsx', 'go', 'rust', 'java', 'c', 'cpp'
];

export const SUPPORTED_THEMES = [
  'github-light', 'github-dark', 'dracula', 
  'monokai', 'nord', 'material-theme-ocean'
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
