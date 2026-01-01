import { describe, it, expect } from 'vitest';
import { encodeState, decodeState, defaultState, MarkupState } from './url-state';

describe('url-state', () => {
  it('should encode and decode the default state correctly', () => {
    const encoded = encodeState(defaultState);
    const params = new URLSearchParams(encoded);
    const decoded = decodeState(params);

    expect(decoded).toEqual(defaultState);
  });

  it('should encode and decode a custom state correctly', () => {
    const customState: MarkupState = {
      ...defaultState,
      language: 'markdown',
      content: '# Hello World',
      theme: 'dark',
      scale: 3,
    };

    const encoded = encodeState(customState);
    const params = new URLSearchParams(encoded);
    const decoded = decodeState(params);

    expect(decoded).toEqual(customState);
  });

  it('should handle partial parameters and fall back to defaults', () => {
    const params = new URLSearchParams();
    params.set('l', 'mermaid'); // language: mermaid

    const decoded = decodeState(params);

    expect(decoded.language).toBe('mermaid');
    expect(decoded.content).toBe(defaultState.content); // Should use default content
  });

  it('should support raw text content via "text" parameter', () => {
    const params = new URLSearchParams();
    params.set('text', 'Hello Raw World');

    const decoded = decodeState(params);

    expect(decoded.content).toBe('Hello Raw World');
  });

  it('should prioritize LZ-compressed content over "text" parameter', () => {
    // LZ compressed 'Compressed Content' (roughly)
    // We rely on encodeState to get valid compressed string for test
    const compressedState = encodeState({ ...defaultState, content: 'Compressed Content' });
    const compressedParams = new URLSearchParams(compressedState);

    // Add text param
    compressedParams.set('text', 'Raw Content');

    const decoded = decodeState(compressedParams);

    expect(decoded.content).toBe('Compressed Content');
  });
});
