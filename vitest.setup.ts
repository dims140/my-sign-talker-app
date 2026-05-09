import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react-native';

// Cleanup setelah setiap test
afterEach(() => {
  cleanup();
});

// Mock React Native modules
vi.mock('react-native', async () => {
  const actual = await vi.importActual('react-native');
  return {
    ...actual,
    useWindowDimensions: () => ({
      width: 375,
      height: 812,
    }),
  };
});

// Mock expo modules
vi.mock('expo-camera', () => ({
  CameraView: ({ children }: any) => children,
  useCameraPermissions: () => [
    { granted: true },
    vi.fn(() => Promise.resolve({ granted: true })),
  ],
}));

vi.mock('expo-speech', () => ({
  speak: vi.fn((text: string, options: any) => {
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

vi.mock('expo-clipboard', () => ({
  setStringAsync: vi.fn(() => Promise.resolve()),
  getStringAsync: vi.fn(() => Promise.resolve('')),
}));

vi.mock('@tensorflow/tfjs', () => ({
  ready: vi.fn(() => Promise.resolve()),
}));
