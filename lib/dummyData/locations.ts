// lib/dummyData/locations.ts
export interface District {
  id: string;
  name: string;
  upazilas: Upazila[];
}
export interface Upazila {
  id: string;
  name: string;
  villages: string[];
}
export const districts: District[] = [
  {
    id: "kushtia",
    name: "কুষ্টিয়া",
    upazilas: [
      { id: "kushtia_sadar", name: "কুষ্টিয়া সদর", villages: ["পোড়াদহ", "জগতি", "মজারপুর", "আড়পাড়া"] },
      { id: "kumarkhali", name: "কুমারখালী", villages: ["কুমারখালী বাজার", "পাঁচগাছি", "জগন্নাথপুর"] },
      { id: "khoksa", name: "খোকসা", villages: ["খোকসা বাজার", "শিমুলিয়া", "বেতবাড়িয়া"] },
      { id: "mirpur", name: "মিরপুর", villages: ["মিরপুর বাজার", "ছাতিয়ান", "আমলা", "পালবাড়ি"] },  // ✅ নতুন যোগ
      { id: "daulatpur", name: "দৌলতপুর", villages: ["দৌলতপুর বাজার", "পিয়ারপুর", "হোগলবাড়িয়া"] },
      { id: "bheramara", name: "ভেড়ামারা", villages: ["ভেড়ামারা বাজার", "বাহাদুরপুর", "চাঁদগ্রাম"] },
    ]
  },
];

export const getUserLocation = () => {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem('user_location');
  if (saved) return JSON.parse(saved);
  return null;
};
export const saveUserLocation = (districtName: string, upazilaName: string, villageName = "") => {
  const district = districts.find(d => d.name === districtName);
  const upazila = district?.upazilas.find(u => u.name === upazilaName);
  if (district && upazila) {
    localStorage.setItem('user_location', JSON.stringify({ district: { name: districtName }, upazila: { name: upazilaName }, village: villageName }));
  }
};