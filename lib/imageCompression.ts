// lib/imageCompression.ts
import imageCompression from 'browser-image-compression';

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.05,  // 50KB
    maxWidthOrHeight: 500,
    useWebWorker: true,
    fileType: 'image/jpeg',
  };
  
  try {
    const compressed = await imageCompression(file, options);
    return compressed;
  } catch (error) {
    console.error('Compression error:', error);
    return file;
  }
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}