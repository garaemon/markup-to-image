import LZString from 'lz-string';

export type Language = 'latex' | 'mermaid' | 'markdown' | 'code';
export type Theme = 'light' | 'dark';

export interface MarkupState {
  language: Language;
  content: string;
  padding: number;
  borderRadius: number;
  transparent: boolean;
  theme: Theme;
}

export const defaultState: MarkupState = {
  language: 'latex',
  content: 'c = \\sqrt{a^2 + b^2}',
  padding: 32,
  borderRadius: 16,
  transparent: false,
  theme: 'light',
};

export function encodeState(state: MarkupState): string {
  const params = new URLSearchParams();
  params.set('l', state.language);
  params.set('c', LZString.compressToEncodedURIComponent(state.content));
  params.set('p', state.padding.toString());
  params.set('r', state.borderRadius.toString());
  params.set('t', state.transparent ? '1' : '0');
  params.set('h', state.theme);
  return params.toString();
}

export function decodeState(searchParams: URLSearchParams): MarkupState {
  const l = searchParams.get('l') as Language;
  const c = searchParams.get('c');
  const p = searchParams.get('p');
  const r = searchParams.get('r');
  const t = searchParams.get('t');
  const h = searchParams.get('h') as Theme;

  return {
    language: ['latex', 'mermaid', 'markdown', 'code'].includes(l) ? l : defaultState.language,
    content: c ? LZString.decompressFromEncodedURIComponent(c) || defaultState.content : defaultState.content,
    padding: p ? parseInt(p, 10) : defaultState.padding,
    borderRadius: r ? parseInt(r, 10) : defaultState.borderRadius,
    transparent: t === '1',
    theme: ['light', 'dark'].includes(h) ? h : defaultState.theme,
  };
}
