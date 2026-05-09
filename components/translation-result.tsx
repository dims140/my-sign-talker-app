import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { cn } from '@/lib/utils';
import * as Clipboard from 'expo-clipboard';

export interface TranslationResultProps {
  text: string;
  confidence?: number;
  isLoading?: boolean;
  remainingDelay?: number;
  isSpeaking?: boolean;
  onSpeak?: () => void;
  onClear?: () => void;
  className?: string;
}

/**
 * Komponen untuk menampilkan hasil terjemahan bahasa isyarat
 * Menampilkan teks, confidence score, dan kontrol untuk memutar suara
 */
export function TranslationResult({
  text,
  confidence = 0,
  isLoading = false,
  remainingDelay = 0,
  isSpeaking = false,
  onSpeak,
  onClear,
  className,
}: TranslationResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (text) {
      await Clipboard.setStringAsync(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Jika tidak ada teks, tampilkan placeholder
  if (!text) {
    return (
      <View className={cn('bg-surface rounded-2xl p-6 items-center justify-center min-h-40', className)}>
        <Text className="text-muted text-center">
          Buat gerakan tangan untuk memulai deteksi bahasa isyarat
        </Text>
      </View>
    );
  }

  return (
    <View className={cn('bg-surface rounded-2xl p-6 gap-4', className)}>
      {/* Hasil Terjemahan */}
      <ScrollView className="max-h-32 mb-2">
        <Text className="text-3xl font-bold text-foreground leading-tight">
          {text}
        </Text>
      </ScrollView>

      {/* Confidence Score */}
      {confidence > 0 && (
        <View className="flex-row items-center gap-2">
          <Text className="text-sm text-muted">Akurasi:</Text>
          <View className="flex-1 h-2 bg-border rounded-full overflow-hidden">
            <View
              className={cn('h-full rounded-full', confidence > 0.7 ? 'bg-success' : 'bg-warning')}
              style={{ width: `${confidence * 100}%` }}
            />
          </View>
          <Text className="text-sm font-semibold text-foreground">
            {Math.round(confidence * 100)}%
          </Text>
        </View>
      )}

      {/* Delay Countdown */}
      {remainingDelay > 0 && (
        <View className="bg-warning/10 border border-warning rounded-lg p-3 items-center">
          <Text className="text-sm text-warning font-semibold">
            Memutar dalam {Math.ceil(remainingDelay / 1000)} detik...
          </Text>
          <View className="w-full h-1 bg-warning/20 rounded-full mt-2 overflow-hidden">
            <View
              className="h-full bg-warning"
              style={{
                width: `${Math.max(0, 100 - (remainingDelay / 1000) * 100)}%`,
              }}
            />
          </View>
        </View>
      )}

      {/* Control Buttons */}
      <View className="flex-row gap-2 mt-2">
        {/* Tombol Speak */}
        <Pressable
          onPress={onSpeak}
          disabled={isLoading || isSpeaking || remainingDelay > 0}
          className={cn(
            'flex-1 py-3 px-4 rounded-full items-center justify-center',
            isLoading || isSpeaking || remainingDelay > 0
              ? 'bg-primary/50'
              : 'bg-primary active:opacity-80'
          )}
        >
          <Text className="text-background font-semibold">
            {isSpeaking ? '🔊 Sedang Diputar' : '🔊 Putar Suara'}
          </Text>
        </Pressable>

        {/* Tombol Copy */}
        <Pressable
          onPress={handleCopy}
          className="py-3 px-4 rounded-full border border-primary items-center justify-center active:opacity-70"
        >
          <Text className="text-primary font-semibold">
            {copied ? '✓' : '📋'}
          </Text>
        </Pressable>

        {/* Tombol Clear */}
        <Pressable
          onPress={onClear}
          className="py-3 px-4 rounded-full border border-error items-center justify-center active:opacity-70"
        >
          <Text className="text-error font-semibold">✕</Text>
        </Pressable>
      </View>

      {/* Status Message */}
      {copied && (
        <Text className="text-xs text-success text-center">
          Teks berhasil disalin ke clipboard
        </Text>
      )}
    </View>
  );
}
