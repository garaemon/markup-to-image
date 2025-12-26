import { createHighlighter, Highlighter } from 'shiki';

let highlighterPromise: Promise<Highlighter> | null = null;

export function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-light', 'github-dark', 'dracula'],
      langs: ['javascript', 'typescript', 'python', 'json', 'html', 'css', 'bash', 'markdown', 'yaml', 'tsx', 'jsx', 'go', 'rust', 'java', 'c', 'cpp'],
    });
  }
  return highlighterPromise;
}
