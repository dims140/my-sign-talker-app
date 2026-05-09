import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSpeechSynthesis } from '../use-speech-synthesis';
import * as Speech from 'expo-speech';

// Mock expo-speech
vi.mock('expo-speech', () => ({
  speak: vi.fn((text: string, options: any) => {
    // Simulate async speak
    return new Promise((resolve) => {
      setTimeout(() => {
        options.onDone?.();
        resolve(undefined);
      }, 100);
    });
  }),
  stop: vi.fn(() => Promise.resolve()),
  isSpeakingAsync: vi.fn(() => Promise.resolve(false)),
}));

describe('useSpeechSynthesis', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useSpeechSynthesis());

    expect(result.current.isSpeaking).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.remainingDelay).toBe(0);
  });

  it('should speak text with delay', async () => {
    const { result } = renderHook(() => useSpeechSynthesis());

    await act(async () => {
      await result.current.speak({
        text: 'Halo dunia',
        language: 'id-ID',
        delayMs: 500,
      });
    });

    // After speaking completes, isSpeaking should be false
    expect(result.current.isSpeaking).toBe(false);
    expect(Speech.speak).toHaveBeenCalledWith('Halo dunia', expect.objectContaining({
      language: 'id-ID',
      rate: 1,
      pitch: 1,
      volume: 1,
    }));
  });

  it('should handle stop correctly', async () => {
    const { result } = renderHook(() => useSpeechSynthesis());

    await act(async () => {
      await result.current.stop();
    });

    expect(result.current.isSpeaking).toBe(false);
    expect(result.current.remainingDelay).toBe(0);
  });

  it('should set error on speak failure', async () => {
    const mockError = new Error('Speech failed');
    vi.mocked(Speech.speak).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useSpeechSynthesis());

    await act(async () => {
      await result.current.speak({
        text: 'Test',
        language: 'id-ID',
      });
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.isSpeaking).toBe(false);
  });

  it('should support different languages', async () => {
    const { result } = renderHook(() => useSpeechSynthesis());

    const languages = ['id-ID', 'en-US', 'en-GB'];

    for (const lang of languages) {
      vi.clearAllMocks();

      await act(async () => {
        await result.current.speak({
          text: 'Test',
          language: lang,
        });
      });

      expect(Speech.speak).toHaveBeenCalledWith('Test', expect.objectContaining({
        language: lang,
      }));
    }
  });

  it('should apply custom speech options', async () => {
    const { result } = renderHook(() => useSpeechSynthesis());

    await act(async () => {
      await result.current.speak({
        text: 'Custom speech',
        language: 'id-ID',
        rate: 0.8,
        pitch: 1.2,
        volume: 0.9,
        delayMs: 1000,
      });
    });

    expect(Speech.speak).toHaveBeenCalledWith('Custom speech', expect.objectContaining({
      rate: 0.8,
      pitch: 1.2,
      volume: 0.9,
    }));
  });
});
