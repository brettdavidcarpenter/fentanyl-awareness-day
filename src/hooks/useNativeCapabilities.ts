import { useState, useEffect } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Media } from '@capacitor-community/media';

export interface DeviceCapabilities {
  isNative: boolean;
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  canSaveToPhotos: boolean;
  supportsClipboard: boolean;
}

export const useNativeCapabilities = () => {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    isNative: false,
    isMobile: false,
    isIOS: false,
    isAndroid: false,
    canSaveToPhotos: false,
    supportsClipboard: false,
  });

  useEffect(() => {
    const detectCapabilities = () => {
      const isNative = Capacitor.isNativePlatform();
      const platform = Capacitor.getPlatform();
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isIOS = platform === 'ios' || /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = platform === 'android' || /Android/.test(navigator.userAgent);
      const supportsClipboard = 'clipboard' in navigator && 'write' in navigator.clipboard;

      setCapabilities({
        isNative,
        isMobile,
        isIOS,
        isAndroid,
        canSaveToPhotos: isNative,
        supportsClipboard,
      });
    };

    detectCapabilities();
  }, []);

  const saveImageToPhotos = async (dataUrl: string): Promise<boolean> => {
    if (!capabilities.canSaveToPhotos) {
      return false;
    }

    try {
      // Convert data URL to base64
      const base64Data = dataUrl.split(',')[1];
      
      // Write to filesystem first
      const fileName = `awareness-post-${Date.now()}.png`;
      await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache
      });

      // Get the file URI
      const fileUri = await Filesystem.getUri({
        directory: Directory.Cache,
        path: fileName
      });

      // Use Media plugin to save to photo library
      await Media.savePhoto({
        path: fileUri.uri
      });

      // Clean up temporary file
      await Filesystem.deleteFile({
        path: fileName,
        directory: Directory.Cache
      });

      return true;
    } catch (error) {
      console.error('Failed to save to photos:', error);
      return false;
    }
  };

  const copyImageToClipboard = async (blob: Blob): Promise<boolean> => {
    if (!capabilities.supportsClipboard) {
      return false;
    }

    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  };

  const fallbackCopyText = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy text:', error);
      return false;
    }
  };

  return {
    capabilities,
    saveImageToPhotos,
    copyImageToClipboard,
    fallbackCopyText,
  };
};