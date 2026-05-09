import { ScrollView, View, Pressable, Text } from 'react-native';
import { useState, useEffect, useCallback, useRef } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { CameraViewComponent } from '@/components/camera-view';
import { TranslationResult } from '@/components/translation-result';
import { useHandDetection } from '@/hooks/use-hand-detection';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';
import { cn } from '@/lib/utils';

/**
 * Home Screen - Sign Talker
 * Layar utama untuk deteksi bahasa isyarat dan terjemahan real-time
 */
export default function HomeScreen() {
  const [isDetecting, setIsDetecting] = useState(false);
  const [translationText, setTranslationText] = useState('');
  const [detectionHistory, setDetectionHistory] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('id-ID');

  // Ref untuk menyimpan interval ID agar bisa dibersihkan
  const detectionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Hooks untuk deteksi tangan dan speech synthesis
  const { detectionResult, isLoading: isDetectionLoading, detectHands, resetDetection } = useHandDetection();
  const { isSpeaking, isLoading: isSpeechLoading, remainingDelay, speak, stop } = useSpeechSynthesis();

  // Simulasi deteksi bahasa isyarat
  const mockSignLanguageTranslations: Record<string, string> = {
    'halo': 'Halo',
    'terima kasih': 'Terima kasih',
    'tolong': 'Tolong',
    'iya': 'Iya',
    'tidak': 'Tidak',
    'berapa': 'Berapa',
    'siapa': 'Siapa',
    'apa': 'Apa',
    'mana': 'Mana',
    'kapan': 'Kapan',
  };

  // Bersihkan interval saat komponen unmount
  useEffect(() => {
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  // Mulai/hentikan deteksi
  const toggleDetection = useCallback(() => {
    if (isDetecting) {
      // Hentikan deteksi
      setIsDetecting(false);
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
      resetDetection();
    } else {
      // Mulai deteksi
      setIsDetecting(true);
      // Simulasi deteksi dengan mock data menggunakan ref agar tidak ada stale closure
      detectionIntervalRef.current = setInterval(async () => {
        await detectHands();

        // Simulasi hasil terjemahan random
        const keys = Object.keys(mockSignLanguageTranslations);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const translation = mockSignLanguageTranslations[randomKey];

        // Update hasil terjemahan setiap 3 detik (30% kemungkinan)
        if (Math.random() > 0.7) {
          setTranslationText(translation);

          // Tambah ke history
          setDetectionHistory((prev) => [translation, ...prev.slice(0, 9)]);
        }
      }, 3000);
    }
  }, [isDetecting, detectHands, resetDetection]);

  // Memutar suara hasil terjemahan
  const handleSpeak = useCallback(async () => {
    if (translationText) {
      await speak({
        text: translationText,
        language: selectedLanguage,
        delayMs: 1000, // 1 detik delay
        rate: 1,
        pitch: 1,
        volume: 1,
      });
    }
  }, [translationText, selectedLanguage, speak]);

  // Hapus hasil terjemahan
  const handleClear = useCallback(() => {
    setTranslationText('');
    resetDetection();
  }, [resetDetection]);

  // Hentikan suara
  const handleStop = useCallback(async () => {
    await stop();
  }, [stop]);

  return (
    <ScreenContainer className="p-4 gap-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1, gap: 16 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="gap-2">
          <Text className="text-3xl font-bold text-foreground">Sign Talker</Text>
          <Text className="text-sm text-muted">
            Deteksi bahasa isyarat dan ubah menjadi suara
          </Text>
        </View>

        {/* Camera View */}
        <View className="h-64 rounded-2xl overflow-hidden shadow-sm">
          <CameraViewComponent isDetecting={isDetecting} />
        </View>

        {/* Detection Control */}
        <Pressable
          onPress={toggleDetection}
          disabled={isDetectionLoading}
          className={cn(
            'py-4 px-6 rounded-full items-center justify-center',
            isDetecting ? 'bg-error' : 'bg-success active:opacity-80'
          )}
        >
          <Text className="text-background font-bold text-lg">
            {isDetecting ? '⏹ Hentikan Deteksi' : '▶ Mulai Deteksi'}
          </Text>
        </Pressable>

        {/* Language Selection */}
        <View className="gap-2">
          <Text className="text-sm font-semibold text-foreground">Bahasa Output:</Text>
          <View className="flex-row gap-2">
            {[
              { code: 'id-ID', label: '🇮🇩 Indonesia' },
              { code: 'en-US', label: '🇺🇸 English' },
            ].map((lang) => (
              <Pressable
                key={lang.code}
                onPress={() => setSelectedLanguage(lang.code)}
                className={cn(
                  'flex-1 py-2 px-3 rounded-lg border items-center justify-center',
                  selectedLanguage === lang.code
                    ? 'bg-primary border-primary'
                    : 'border-border active:opacity-70'
                )}
              >
                <Text
                  className={cn(
                    'text-sm font-semibold',
                    selectedLanguage === lang.code ? 'text-background' : 'text-foreground'
                  )}
                >
                  {lang.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Translation Result */}
        <TranslationResult
          text={translationText}
          confidence={detectionResult.confidence}
          isLoading={isSpeechLoading}
          remainingDelay={remainingDelay}
          isSpeaking={isSpeaking}
          onSpeak={handleSpeak}
          onClear={handleClear}
        />

        {/* Detection History */}
        {detectionHistory.length > 0 && (
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Riwayat Deteksi:</Text>
            <View className="flex-row flex-wrap gap-2">
              {detectionHistory.map((item, index) => (
                <Pressable
                  key={index}
                  onPress={() => setTranslationText(item)}
                  className="bg-primary/10 border border-primary px-3 py-2 rounded-full"
                >
                  <Text className="text-sm text-primary font-medium">{item}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Status Info */}
        <View className="bg-surface border border-border rounded-lg p-4 gap-2">
          <Text className="text-xs font-semibold text-muted uppercase">Status Deteksi</Text>
          <View className="gap-1">
            <Text className="text-sm text-foreground">
              Deteksi: {isDetecting ? '✓ Aktif' : '○ Tidak Aktif'}
            </Text>
            <Text className="text-sm text-foreground">
              Tangan Terdeteksi: {detectionResult.isDetected ? '✓ Ya' : '○ Tidak'}
            </Text>
            {translationText && (
              <Text className="text-sm text-foreground">
                Hasil: {translationText}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
