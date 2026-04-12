// helpers/chat.ts
export type SectionType = 'marketplace' | 'social' | 'gramer_haat' | 'tuni_mall' | 'private';

export function getRoomId(section: SectionType, itemId: string | number): string {
  return `${section}_${itemId}`;
}

// প্রাইভেট চ্যাটের জন্য ইউনিক রুম আইডি (দুই ইউজারের আইডি সাজিয়ে)
export function getPrivateRoomId(userId1: string, userId2: string): string {
  const sorted = [userId1, userId2].sort();
  return `private_${sorted[0]}_${sorted[1]}`;
}

export function getSectionFromRoomId(roomId: string): SectionType {
  const section = roomId.split('_')[0];
  return section as SectionType;
}