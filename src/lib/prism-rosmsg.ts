import Prism from 'prismjs';

// Define ROS Message grammar for Prism
if (typeof window !== 'undefined' && Prism) {
  Prism.languages.rosmsg = {
    'comment': {
      pattern: /#.*/,
      greedy: true
    },
    'string': {
      pattern: /(^|[^\\])"(?:[^"\\]|\\.)*"/,
      lookbehind: true,
      greedy: true
    },
    'keyword': {
      pattern: /^---$/m,
      greedy: true
    },
    'builtin': /\b(?:bool|byte|char|u?int(?:8|16|32|64)|float(?:32|64)|w?string|time|duration|Header)\b/,
    'constant': /\b[A-Z][A-Z0-9_]*\b/,
    'number': /\b\d+(?:\.\d+)?\b/,
    'variable': /\b[a-z_][a-z0-9_]*\b/,
    'punctuation': /[\[\]]/
  };
}
