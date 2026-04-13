"use client";
import { useEffect, useRef, useState } from 'react';

export default function InfiniteScroll({ fetchMore, hasMore, children }: any) {
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setLoading(true);
          await fetchMore();
          setLoading(false);
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, fetchMore]);

  return (
    <>
      {children}
      <div ref={sentinelRef} className="h-10" />
      {loading && <p className="text-center p-4 text-gray-500">লোড হচ্ছে...</p>}
    </>
  );
}