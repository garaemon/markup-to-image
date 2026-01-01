import LZString from 'lz-string';
import { SUPPORTED_THEMES } from './highlighter';

export type Language = 'latex' | 'mermaid' | 'markdown' | 'code';
export type Theme = typeof SUPPORTED_THEMES[number] | 'light' | 'dark';

export interface MarkupState {
  language: Language;
  codeLanguage: string;
  content: string;
  padding: number;
  borderRadius: number;
  width: number | 'auto';
  scale: number;
  transparent: boolean;
  theme: Theme;
  window: boolean;
  showLineNumbers: boolean;
}

export const defaultState: MarkupState = {
  language: 'latex',
  codeLanguage: 'typescript',
  content: 'c = \\\sqrt{a^2 + b^2}',
  padding: 32,
  borderRadius: 16,
  width: 'auto',
  scale: 2,
  transparent: false,
  theme: 'light',
  window: false,
  showLineNumbers: false,
};

export interface UrlParameterInfo {
  key: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'enum';
  options?: readonly string[];
}

export const URL_PARAMETERS: Record<keyof MarkupState, UrlParameterInfo> = {
  language: {
    key: 'l',
    description: 'Markup language',
    type: 'enum',
    options: ['latex', 'mermaid', 'markdown', 'code'],
  },
  codeLanguage: {
    key: 'cl',
    description: 'Programming language for code renderer',
    type: 'string',
  },
  content: {
    key: 'c',
    description: 'Source code or markup text (LZ-compressed)',
    type: 'string',
  },
  padding: {
    key: 'p',
    description: 'Padding around the content (pixels)',
    type: 'number',
  },
  borderRadius: {
    key: 'r',
    description: 'Border radius of the container (pixels)',
    type: 'number',
  },
  width: {
    key: 'wd',
    description: 'Width of the image (pixels or "auto")',
    type: 'number',
  },
  scale: {
    key: 's',
    description: 'Scale factor for the image',
    type: 'number',
  },
  transparent: {
    key: 't',
    description: 'Whether the background is transparent (1 for true, 0 for false)',
    type: 'boolean',
  },
  theme: {
    key: 'h',
    description: 'Syntax highlighting theme',
    type: 'enum',
    options: [...SUPPORTED_THEMES, 'light', 'dark'],
  },
  window: {
    key: 'w',
    description: 'Whether to show window controls (1 for true, 0 for false)',
    type: 'boolean',
  },
  showLineNumbers: {
    key: 'sn',
    description: 'Whether to show line numbers (1 for true, 0 for false)',
    type: 'boolean',
  },
};

export function encodeState(state: MarkupState): string {
  const params = new URLSearchParams();

  (Object.entries(URL_PARAMETERS) as [keyof MarkupState, UrlParameterInfo][]).forEach(([name, info]) => {
    const value = state[name];
    if (value === undefined) {
return;
}

    let encodedValue: string;
    if (name === 'content') {
      encodedValue = LZString.compressToEncodedURIComponent(value as string);
    } else if (info.type === 'boolean') {
      encodedValue = value ? '1' : '0';
    } else {
      encodedValue = value.toString();
    }
    params.set(info.key, encodedValue);
  });

  return params.toString();
}

export function decodeState(searchParams: URLSearchParams): MarkupState {
  const state = { ...defaultState };

  (Object.entries(URL_PARAMETERS) as [keyof MarkupState, UrlParameterInfo][]).forEach(([name, info]) => {
    const rawValue = searchParams.get(info.key);
    if (rawValue === null) {
return;
}

    if (name === 'content') {
      state[name] = LZString.decompressFromEncodedURIComponent(rawValue) || defaultState.content;
    } else if (name === 'width') {
      state[name] = rawValue === 'auto' ? 'auto' : parseInt(rawValue, 10);
    } else if (info.type === 'number') {
      state[name] = (name === 'scale' ? parseFloat(rawValue) : parseInt(rawValue, 10)) as never;
    } else if (info.type === 'boolean') {
      state[name] = (rawValue === '1') as never;
    } else if (info.type === 'enum' && info.options) {
      if (info.options.includes(rawValue)) {
        state[name] = rawValue as never;
      }
    } else {
      state[name] = rawValue as never;
    }
  });

  return state;
}
