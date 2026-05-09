import { useCallback, useRef, useState } from 'react';
import * as Speech from 'expo-speech';

export interface SpeechOptions {
  text: string;
  language?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  delayMs?: number; // Delay sebelum memutar suara (default: 1000ms)
}

/**
 * Hook untuk Text-to-Speech dengan delay
 * Memungkinkan delay sebelum suara diputar (default 1 detik)
 */
export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingDelay, setRemainingDelay] = useState(0);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /**
   * Memutar suara dengan delay
   */
  const speak = useCallback(async (options: SpeechOptions) => {
    const {
      text,
      language = 'id-ID',
      rate = 1,
      pitch = 1,
      volume = 1,
      delayMs = 1000,
    } = options;

    try {
      setIsLoading(true);
      setError(null);

      // Jika ada delay, tampilkan countdown
      if (delayMs > 0) {
        setRemainingDelay(delayMs);

        // Countdown timer
        let elapsed = 0;
        intervalRef.current = setInterval(() => {
          elapsed += 100;
          setRemainingDelay(Math.max(0, delayMs - elapsed));
        }, 100) as any;

        // Tunggu sesuai delay
        await new Promise<void>((resolve) => {
          timeoutRef.current = setTimeout(resolve, delayMs) as any;
        });

        // Bersihkan interval
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }

      setRemainingDelay(0);
      setIsSpeaking(true);

      // Konfigurasi audio untuk iOS (agar suara terdengar di silent mode)
      // Note: setDefaultLanguage mungkin tidak tersedia di semua versi expo-speech

      // Memutar suara - Speech.speak() bukan Promise, jangan pakai await
      Speech.speak(text, {
        language,
        rate,
        pitch,
        volume,
        onStart: () => {
          setIsLoading(false);
        },
        onDone: () => {
          setIsSpeaking(false);
          setIsLoading(false);
        },
        onError: (error: any) => {
          setError(`Speech error: ${error?.message || 'Unknown error'}`);
          setIsSpeaking(false);
          setIsLoading(false);
        },
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to speak';
      setError(errorMessage);
      setIsSpeaking(false);
      setIsLoading(false);
    }
  }, []);

  /**
   * Menghentikan suara yang sedang diputar
   */
  const stop = useCallback(async () => {
    try {
      // Hentikan suara jika sedang diputar
      const isSpeakingNow = await Speech.isSpeakingAsync();
      if (isSpeakingNow) {
        await Speech.stop();
      }
      setIsSpeaking(false);

      // Bersihkan timeout dan interval
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      setRemainingDelay(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop speech');
    }
  }, []);

  /**
   * Pause suara (jika didukung)
   */
  /**
   * Pause suara (jika didukung)
   * Note: Pause mungkin tidak didukung di semua platform
   */
  const pause = useCallback(async () => {
    // Pause tidak didukung di expo-speech saat ini
    // Gunakan stop() sebagai alternatif
  }, []);

  /**
   * Resume suara (jika didukung)
   * Note: Resume mungkin tidak didukung di semua platform
   */
  const resume = useCallback(async () => {
    // Resume tidak didukung di expo-speech saat ini
  }, []);

  return {
    isSpeaking,
    isLoading,
    error,
    remainingDelay,
    speak,
    stop,
  };
}
