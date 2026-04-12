// components/social/DeleteAccountModal.tsx
"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { deleteUserAccount, getCurrentUser } from "@/lib/dummyData/users";

interface DeleteAccountModalProps {
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeleteAccountModal({ onClose, onDeleted }: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const currentUser = getCurrentUser();

  const handleDelete = () => {
    if (confirmText !== "DELETE") return;
    setIsDeleting(true);
    if (currentUser) {
      deleteUserAccount(currentUser.id);
      localStorage.removeItem("sosta_user");
    }
    setTimeout(() => {
      onDeleted();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[400] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-red-600 flex items-center gap-2">
            <AlertTriangle size={20} /> অ্যাকাউন্ট ডিলিট
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        <p className="text-gray-700 mb-4">
          আপনার অ্যাকাউন্ট ডিলিট করলে সব পোস্ট, কমেন্ট, গিফট ইতিহাস মুছে যাবে। এই কাজ পূর্বাবস্থায় ফেরানো যাবে না।
        </p>
        <p className="text-sm font-semibold">
          নিশ্চিত করতে <span className="bg-gray-100 px-2 py-0.5 rounded">DELETE</span> টাইপ করুন:
        </p>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="w-full border rounded-lg p-2 my-3 text-sm"
          placeholder="DELETE"
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl border">
            বাতিল
          </button>
          <button
            onClick={handleDelete}
            disabled={confirmText !== "DELETE" || isDeleting}
            className="flex-1 bg-red-600 text-white py-2 rounded-xl disabled:opacity-50"
          >
            {isDeleting ? "ডিলিট হচ্ছে..." : "ডিলিট করুন"}
          </button>
        </div>
      </div>
    </div>
  );
}