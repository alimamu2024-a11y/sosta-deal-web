// components/social/ShareNewsModal.tsx
"use client";
import { useState, useRef } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import { addPost } from "@/lib/dummyData/posts";
import { getCurrentUser } from "@/lib/dummyData/users";
import { compressImage } from "@/lib/imageCompression";
import { districts } from "@/lib/dummyData/locations";

interface ShareNewsModalProps {
  onClose: () => void;
  onNewsShared: () => void;
}

export default function ShareNewsModal({ onClose, onNewsShared }: ShareNewsModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [village, setVillage] = useState("");
  const [upazilas, setUpazilas] = useState<{ id: string; name: string; villages: string[] }[]>([]);
  const [villages, setVillages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUser = getCurrentUser();

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dName = e.target.value;
    setDistrict(dName);
    const found = districts.find(d => d.name === dName);
    setUpazilas(found ? found.upazilas : []);
    setUpazila("");
    setVillage("");
    setVillages([]);
  };
  const handleUpazilaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const uName = e.target.value;
    setUpazila(uName);
    const found = upazilas.find(u => u.name === uName);
    setVillages(found ? found.villages : []);
    setVillage("");
  };
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const compressed = await compressImage(file);
    const preview = URL.createObjectURL(compressed);
    setImagePreview(preview);
    setIsUploading(false);
  };
  const handleSubmit = () => {
    if (!currentUser) return;
    if (!title.trim()) { alert("নিউজের শিরোনাম দিন"); return; }
    const newPost = {
      user_id: currentUser.id,
      content: `${title}\n\n${description}`,
      images: imagePreview ? [imagePreview] : [],
      type: "news",
      location: { district, upazila, village },
    };
    addPost(newPost as any);
    onNewsShared();
    onClose();
  };
  return (
    <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-5 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">নিউজ শেয়ার করুন</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={20} /></button>
        </div>
        <div className="space-y-3">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="নিউজের শিরোনাম" className="w-full border rounded-xl p-2 text-sm" />
          <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="বিস্তারিত বিবরণ" className="w-full border rounded-xl p-2 text-sm" />
          <select value={district} onChange={handleDistrictChange} className="w-full border rounded-lg p-2 text-sm">
            <option value="">জেলা</option>
            {districts.map(d => <option key={d.id}>{d.name}</option>)}
          </select>
          <select value={upazila} onChange={handleUpazilaChange} className="w-full border rounded-lg p-2 text-sm" disabled={!district}>
            <option value="">উপজেলা</option>
            {upazilas.map(u => <option key={u.id}>{u.name}</option>)}
          </select>
          <select value={village} onChange={(e) => setVillage(e.target.value)} className="w-full border rounded-lg p-2 text-sm" disabled={!upazila}>
            <option value="">গ্রাম</option>
            {villages.map(v => <option key={v}>{v}</option>)}
          </select>
          <div className="border rounded-xl p-3 text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            {imagePreview ? <img src={imagePreview} className="w-full h-32 object-cover rounded-lg" /> : <div className="py-6 text-gray-400 flex flex-col items-center"><ImageIcon size={28} /> ছবি যোগ করুন</div>}
          </div>
          <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageSelect} />
          <button onClick={handleSubmit} disabled={isUploading || !title.trim()} className="w-full bg-orange-500 text-white py-2 rounded-xl font-bold disabled:opacity-50">নিউজ পোস্ট করুন</button>
        </div>
      </div>
    </div>
  );
}