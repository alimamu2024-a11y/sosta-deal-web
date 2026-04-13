// lib/mediaOptimizer.ts

export const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * (MAX_WIDTH / img.width);
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.5));
      };
    };
  });
};

export const compressAudio = async (blob: Blob): Promise<Blob> => {
  return blob.slice(0, 50000);
};

export const compressVideo = async (file: File): Promise<string> => {
  return URL.createObjectURL(file.slice(0, 100000));
};