// components/social/LocationInput.tsx
"use client";

import { useState, useEffect } from 'react';
import { districts } from '@/lib/dummyData/locations';

interface LocationInputProps {
  initialDistrict?: string;
  initialUpazila?: string;
  initialVillage?: string;
  onChange: (district: string, upazila: string, village: string) => void;
}

export default function LocationInput({ initialDistrict, initialUpazila, initialVillage, onChange }: LocationInputProps) {
  const [district, setDistrict] = useState(initialDistrict || '');
  const [upazila, setUpazila] = useState(initialUpazila || '');
  const [village, setVillage] = useState(initialVillage || '');
  const [upazilaOptions, setUpazilaOptions] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (district) {
      const found = districts.find(d => d.name === district);
      setUpazilaOptions(found ? found.upazilas : []);
    } else {
      setUpazilaOptions([]);
    }
  }, [district]);

  useEffect(() => {
    onChange(district, upazila, village);
  }, [district, upazila, village]);

  return (
    <div className="space-y-2">
      <select value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full border rounded-lg p-2 text-sm">
        <option value="">জেলা নির্বাচন করুন</option>
        {districts.map(d => <option key={d.id}>{d.name}</option>)}
      </select>
      <select value={upazila} onChange={(e) => setUpazila(e.target.value)} className="w-full border rounded-lg p-2 text-sm" disabled={!district}>
        <option value="">উপজেলা নির্বাচন করুন</option>
        {upazilaOptions.map(u => <option key={u.id}>{u.name}</option>)}
      </select>
      <input type="text" value={village} onChange={(e) => setVillage(e.target.value)} placeholder="গ্রামের নাম" className="w-full border rounded-lg p-2 text-sm" />
    </div>
  );
}