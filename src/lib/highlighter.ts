import { createHighlighter, Highlighter } from 'shiki';

let highlighterPromise: Promise<Highlighter> | null = null;

export const SUPPORTED_LANGUAGES = [
  'javascript', 'typescript', 'python', 'json', 'html', 'css', 'bash', 
  'markdown', 'yaml', 'tsx', 'jsx', 'go', 'rust', 'java', 'c', 'cpp'
];

export function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-light', 'github-dark', 'dracula'],
      langs: SUPPORTED_LANGUAGES,
    });
  }
  return highlighterPromise;
}
