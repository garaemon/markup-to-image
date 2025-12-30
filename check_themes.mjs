import { bundledThemes } from 'shiki';

console.log(Object.keys(bundledThemes).filter(t => t.includes('github')));
