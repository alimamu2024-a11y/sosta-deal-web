// app/mall/layout.tsx
import BottomNav from "@/components/BottomNav";  // ← @/components (সঠিক)

export default function MallLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}