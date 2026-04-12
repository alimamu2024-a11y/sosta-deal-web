// app/social/news/page.tsx
"use client";
import { useState } from "react";
import NewsFeed from "@/components/social/NewsFeed";
import LocationFilter from "@/components/social/LocationFilter";
import ShareNewsModal from "@/components/social/ShareNewsModal";
import { Plus } from "lucide-react";

export default function NewsPage() {
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [village, setVillage] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  return (
    <div>
      <div className="sticky top-0 z-10 bg-white p-3 border-b flex justify-between items-center">
        <h1 className="text-xl font-bold text-orange-600">এলাকার খবর</h1>
        <button onClick={() => setShowShareModal(true)} className="p-2 rounded-full bg-orange-500 text-white"><Plus size={20} /></button>
      </div>
      <LocationFilter onLocationChange={(d, u, v) => { setDistrict(d); setUpazila(u); setVillage(v); }} />
      <div className="p-3"><NewsFeed district={district} upazila={upazila} village={village} /></div>
      {showShareModal && <ShareNewsModal onClose={() => setShowShareModal(false)} onNewsShared={() => window.location.reload()} />}
    </div>
  );
}