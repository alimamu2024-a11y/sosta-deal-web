// components/social/LocationFilter.tsx
"use client";
import { useState, useEffect } from "react";
import { districts, getUserLocation, saveUserLocation } from "@/lib/dummyData/locations";

interface LocationFilterProps {
  onLocationChange: (district: string, upazila: string, village: string) => void;
}

export default function LocationFilter({ onLocationChange }: LocationFilterProps) {
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [upazilas, setUpazilas] = useState<{ id: string; name: string; villages: string[] }[]>([]);
  const [villages, setVillages] = useState<string[]>([]);

  useEffect(() => {
    const saved = getUserLocation();
    if (saved && saved.district?.name && saved.upazila?.name) {
      setSelectedDistrict(saved.district.name);
      setSelectedUpazila(saved.upazila.name);
      setSelectedVillage(saved.village || "");
      const up = districts.find(d => d.name === saved.district.name)?.upazilas || [];
      setUpazilas(up);
      const vil = up.find(u => u.name === saved.upazila.name)?.villages || [];
      setVillages(vil);
      onLocationChange(saved.district.name, saved.upazila.name, saved.village || "");
    } else if (districts.length > 0) {
      const defaultDistrict = districts[0];
      setSelectedDistrict(defaultDistrict.name);
      const defaultUpazila = defaultDistrict.upazilas[0];
      setSelectedUpazila(defaultUpazila.name);
      setVillages(defaultUpazila.villages);
      saveUserLocation(defaultDistrict.name, defaultUpazila.name, "");
      onLocationChange(defaultDistrict.name, defaultUpazila.name, "");
    }
  }, [onLocationChange]);

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtName = e.target.value;
    setSelectedDistrict(districtName);
    const district = districts.find(d => d.name === districtName);
    if (district) {
      setUpazilas(district.upazilas);
      setSelectedUpazila("");
      setSelectedVillage("");
      setVillages([]);
    }
  };
  const handleUpazilaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const upazilaName = e.target.value;
    setSelectedUpazila(upazilaName);
    const up = upazilas.find(u => u.name === upazilaName);
    setVillages(up?.villages || []);
    setSelectedVillage("");
  };
  const handleVillageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const villageName = e.target.value;
    setSelectedVillage(villageName);
    if (selectedDistrict && selectedUpazila && villageName) {
      saveUserLocation(selectedDistrict, selectedUpazila, villageName);
      onLocationChange(selectedDistrict, selectedUpazila, villageName);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-3 bg-white rounded-xl shadow-sm mb-3">
      <select value={selectedDistrict} onChange={handleDistrictChange} className="border rounded-lg px-3 py-2 text-sm">
        <option value="">জেলা নির্বাচন করুন</option>
        {districts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
      </select>
      <select value={selectedUpazila} onChange={handleUpazilaChange} className="border rounded-lg px-3 py-2 text-sm" disabled={!selectedDistrict}>
        <option value="">উপজেলা নির্বাচন করুন</option>
        {upazilas.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
      </select>
      <select value={selectedVillage} onChange={handleVillageChange} className="border rounded-lg px-3 py-2 text-sm" disabled={!selectedUpazila}>
        <option value="">গ্রাম নির্বাচন করুন</option>
        {villages.map(v => <option key={v} value={v}>{v}</option>)}
      </select>
    </div>
  );
}