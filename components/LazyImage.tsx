"use client";
import { useState, useEffect, useRef } from 'react';

export default function LazyImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [src]);

  return (
    <div ref={imgRef} className={`${className} bg-gray-200`}>
      {imageSrc ? (
        <img src={imageSrc} alt={alt} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <div className="animate-pulse w-full h-full bg-gray-300" />
      )}
    </div>
  );
}