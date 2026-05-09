import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { cn } from '@/lib/utils';

export interface CameraViewProps {
  onFrameCapture?: (frame: any) => void;
  isDetecting?: boolean;
  className?: string;
}

/**
 * Komponen untuk menampilkan live feed kamera
 * Digunakan untuk deteksi bahasa isyarat real-time
 */
export function CameraViewComponent({
  onFrameCapture,
  isDetecting = false,
  className,
}: CameraViewProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const cameraRef = useRef<CameraView>(null);

  // Request kamera permission
  useEffect(() => {
    const checkPermission = async () => {
      if (!permission) {
        setIsLoading(false);
        return;
      }

      if (permission.granted) {
        setIsPermissionGranted(true);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };

    checkPermission();
  }, [permission]);

  const handleRequestPermission = async () => {
    setIsLoading(true);
    const result = await requestPermission();
    setIsPermissionGranted(result.granted);
    setIsLoading(false);
  };

  // Jika permission belum diberikan
  if (!isPermissionGranted) {
    return (
      <View className={cn('flex-1 items-center justify-center bg-surface rounded-2xl', className)}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0a7ea4" />
        ) : (
          <View className="items-center gap-4 px-4">
            <Text className="text-lg font-semibold text-foreground text-center">
              Izin Kamera Diperlukan
            </Text>
            <Text className="text-sm text-muted text-center">
              Aplikasi ini memerlukan akses ke kamera untuk mendeteksi bahasa isyarat Anda.
            </Text>
            <Pressable
              onPress={handleRequestPermission}
              className="bg-primary px-6 py-3 rounded-full active:opacity-80"
            >
              <Text className="text-background font-semibold">Berikan Izin</Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  }

  return (
    <View className={cn('relative bg-black rounded-2xl overflow-hidden', className)}>
      {/* Camera Feed */}
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing="front"
        onCameraReady={() => {
          setIsLoading(false);
        }}
      />

      {/* Status Overlay */}
      <View className="absolute top-4 right-4 bg-black/50 px-3 py-2 rounded-full">
        <Text className={cn('text-xs font-semibold', isDetecting ? 'text-success' : 'text-muted')}>
          {isDetecting ? '● Mendeteksi' : '○ Siap'}
        </Text>
      </View>

      {/* Loading Indicator */}
      {isLoading && (
        <View className="absolute inset-0 items-center justify-center bg-black/50">
          <ActivityIndicator size="large" color="#0a7ea4" />
        </View>
      )}

      {/* Detection Overlay Grid (untuk visualisasi deteksi tangan) */}
      {isDetecting && (
        <View className="absolute inset-0 border-2 border-primary/30 rounded-2xl">
          {/* Center crosshair */}
          <View className="absolute top-1/2 left-1/2 w-8 h-8 -ml-4 -mt-4 border-2 border-primary/50 rounded-full" />
        </View>
      )}
    </View>
  );
}
