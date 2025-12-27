import LZString from 'lz-string';
import { SUPPORTED_THEMES } from './highlighter';

export type Language = 'latex' | 'mermaid' | 'markdown' | 'code';
export type Theme = 'light' | 'dark' | 'monokai' | 'nord' | 'material-theme-ocean' | 'dracula' | 'github-light' | 'github-dark' | 'solarized-light' | 'solarized-dark';

export interface MarkupState {
  language: Language;
  codeLanguage: string;
  content: string;
  padding: number;
  borderRadius: number;
  transparent: boolean;
  theme: Theme;
  window: boolean;
  showLineNumbers: boolean;
}

export const defaultState: MarkupState = {
  language: 'latex',
  codeLanguage: 'typescript',
  content: 'c = \\sqrt{a^2 + b^2}',
  padding: 32,
  borderRadius: 16,
  transparent: false,
  theme: 'light',
  window: false,
  showLineNumbers: false,
};

export function encodeState(state: MarkupState): string {
  const params = new URLSearchParams();
  params.set('l', state.language);
  params.set('cl', state.codeLanguage);
  params.set('c', LZString.compressToEncodedURIComponent(state.content));
  params.set('p', state.padding.toString());
  params.set('r', state.borderRadius.toString());
  params.set('t', state.transparent ? '1' : '0');
  params.set('h', state.theme);
  params.set('w', state.window ? '1' : '0');
  params.set('sn', state.showLineNumbers ? '1' : '0');
  return params.toString();
}

export function decodeState(searchParams: URLSearchParams): MarkupState {
  const l = searchParams.get('l') as Language;
  const cl = searchParams.get('cl');
  const c = searchParams.get('c');
  const p = searchParams.get('p');
  const r = searchParams.get('r');
  const t = searchParams.get('t');
  const h = searchParams.get('h') as Theme;
  const w = searchParams.get('w');
  const sn = searchParams.get('sn');

  // Map legacy 'light'/'dark' to github themes if desired, or keep them as aliases
  // For now, let's treat 'light' as 'github-light' and 'dark' as 'github-dark' eventually,
  // but to keep compatibility, we allow them in the type.
  // Actually, let's just allow anything in SUPPORTED_THEMES plus 'light'/'dark'
  
  const validTheme = (SUPPORTED_THEMES.includes(h) || h === 'light' || h === 'dark');

  return {
    language: ['latex', 'mermaid', 'markdown', 'code'].includes(l) ? l : defaultState.language,
    codeLanguage: cl || defaultState.codeLanguage,
    content: c ? LZString.decompressFromEncodedURIComponent(c) || defaultState.content : defaultState.content,
    padding: p ? parseInt(p, 10) : defaultState.padding,
    borderRadius: r ? parseInt(r, 10) : defaultState.borderRadius,
    transparent: t === '1',
    theme: validTheme ? h : defaultState.theme,
    window: w === '1',
    showLineNumbers: sn === '1',
  };
}
