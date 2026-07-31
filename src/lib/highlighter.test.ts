import { describe, it, expect } from 'vitest';
import { removeItalicFontStyles } from './highlighter';

describe('removeItalicFontStyles', () => {
  it('should remove a standalone italic font style', () => {
    const html = '<span style="font-style:italic">text</span>';

    const result = removeItalicFontStyles(html);

    expect(result).not.toContain('font-style:italic');
  });

  it('should remove italic while keeping other style declarations', () => {
    // Shiki emits invalid HTML tokens (e.g. "< div>") with this shape.
    const html = '<span style="color:#B31D28;font-style:italic">&#x3C; div></span>';

    const result = removeItalicFontStyles(html);

    expect(result).toContain('color:#B31D28');
    expect(result).not.toContain('font-style:italic');
  });

  it('should remove italic written with spaces after the colon', () => {
    const html = '<span style="font-style: italic; color:#24292E">text</span>';

    const result = removeItalicFontStyles(html);

    expect(result).toContain('color:#24292E');
    expect(result).not.toContain('italic');
  });

  it('should keep html without italic styles unchanged', () => {
    const html = '<span style="color:#22863A">div</span>';

    const result = removeItalicFontStyles(html);

    expect(result).toBe(html);
  });
});
