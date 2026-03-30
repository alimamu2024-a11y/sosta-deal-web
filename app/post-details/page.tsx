"use client";
import AdDetails from "../../components/AdDetails";

export default function DetailsPage() {
  // এখানে একটি খালি অবজেক্ট বা ডামি ডেটা দিয়ে দিচ্ছি যাতে বিল্ড এরর না আসে
  const dummyAd = {}; 
  const handleClose = () => {
    window.history.back();
  };

  return (
    <main>
      <AdDetails ad={dummyAd} onClose={handleClose} />
    </main>
  );
}