import { createHighlighter, Highlighter } from 'shiki';

let highlighterPromise: Promise<Highlighter> | null = null;

export const SUPPORTED_LANGUAGES = [
  'javascript', 'typescript', 'python', 'json', 'html', 'css', 'bash', 
  'markdown', 'yaml', 'tsx', 'jsx', 'go', 'rust', 'java', 'c', 'cpp',
  'bibtex', 'latex', 'ruby', 'lisp', 'emacs-lisp', 'kotlin', 'swift', 
  'mermaid', 'objective-c', 'perl', 'php', 'r', 'toml', 'vhdl', 'system-verilog',
  'protobuf', 'rosmsg', 'cmake', 'makefile'
];

export const SUPPORTED_THEMES = [
  'github-light', 'github-dark', 'github-light-default', 'github-dark-default',
  'github-dark-dimmed', 'github-light-high-contrast', 'github-dark-high-contrast',
  'dracula', 'monokai', 'nord', 'material-theme-ocean',
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

/**
 * Removes italic font styles from Shiki-highlighted HTML.
 *
 * The editor overlays a transparent textarea on top of the highlighted
 * markup, so both layers must have identical text metrics. Italic glyphs
 * can have different advance widths than upright glyphs, which makes the
 * caret drift away from the visible text. Stripping the italic style
 * keeps the two layers aligned.
 */
export function removeItalicFontStyles(html: string): string {
  return html.replace(/font-style:\s*italic;?\s*/g, '');
}

export async function getThemeColors(theme: string) {
  const highlighter = await getHighlighter();
  const themeReg = highlighter.getTheme(theme);
  return {
    bg: themeReg.bg,
    fg: themeReg.fg,
  };
}