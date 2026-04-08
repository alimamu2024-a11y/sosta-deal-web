// app/mall/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ChevronLeft, MapPin, Home, Briefcase, Truck, Percent } from "lucide-react";

type Address = {
  id: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  landmark: string;
  type: "home" | "office";
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: user?.name || "",
    phone: "",
    city: "",
    address: "",
    landmark: "",
    type: "home" as "home" | "office",
  });
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  const subtotal = getCartTotal();
  const shippingFee = 70;
  const total = subtotal + shippingFee - discount;

  useEffect(() => {
    // মক অ্যাড্রেস – পরে API থেকে আনবেন
    const savedAddresses = localStorage.getItem("checkout_addresses");
    if (savedAddresses) {
      const parsed = JSON.parse(savedAddresses);
      setAddresses(parsed);
      if (parsed.length > 0) setSelectedAddress(parsed[0]);
    }
  }, []);

  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.city || !newAddress.address) {
      alert("Please fill all required fields");
      return;
    }
    const address: Address = {
      id: Date.now().toString(),
      ...newAddress,
    };
    const updated = [...addresses, address];
    setAddresses(updated);
    localStorage.setItem("checkout_addresses", JSON.stringify(updated));
    setSelectedAddress(address);
    setShowAddressForm(false);
    setNewAddress({ name: user?.name || "", phone: "", city: "", address: "", landmark: "", type: "home" });
  };

  const handleApplyVoucher = () => {
    if (voucherCode === "SAVE10") {
      setDiscount(Math.min(subtotal * 0.1, 500));
      alert("Voucher applied! 10% off up to ৳500");
    } else if (voucherCode === "FREESHIP") {
      setDiscount(shippingFee);
      alert("Free shipping applied!");
    } else {
      alert("Invalid voucher code");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }
    setLoading(true);
    // মক অর্ডার প্লেস – পরে API কল করবেন
    await new Promise(r => setTimeout(r, 1000));
    alert("Order placed successfully!");
    clearCart();
    router.push("/mall/orders");
    setLoading(false);
  };

  if (cart.length === 0) {
    router.push("/mall/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1"><ChevronLeft size={22} /></button>
        <h1 className="font-bold text-lg flex-1">Checkout</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Address Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-lg flex items-center gap-2"><MapPin size={18} /> Delivery Address</h2>
            <button onClick={() => setShowAddressForm(true)} className="text-orange-500 text-sm font-semibold">+ Add New</button>
          </div>

          {addresses.length === 0 && !showAddressForm && (
            <div className="text-center py-6">
              <p className="text-gray-500 text-sm">No address saved</p>
              <button onClick={() => setShowAddressForm(true)} className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-xl text-sm">Add Address</button>
            </div>
          )}

          {addresses.length > 0 && !showAddressForm && (
            <div className="space-y-2">
              {addresses.map(addr => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddress(addr)}
                  className={`border rounded-xl p-3 cursor-pointer transition ${selectedAddress?.id === addr.id ? "border-orange-500 bg-orange-50" : "border-gray-100"}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{addr.name}</p>
                      <p className="text-xs text-gray-500">{addr.phone}</p>
                      <p className="text-sm mt-1">{addr.address}, {addr.city}</p>
                      {addr.landmark && <p className="text-xs text-gray-400">Landmark: {addr.landmark}</p>}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${addr.type === "home" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}>
                      {addr.type === "home" ? <Home size={10} /> : <Briefcase size={10} />}
                      {addr.type === "home" ? "Home" : "Office"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Address Form */}
          {showAddressForm && (
            <div className="mt-3 p-4 border rounded-xl bg-gray-50 space-y-3">
              <h3 className="font-semibold">Add Shipping Address</h3>
              <input type="text" placeholder="Recipient's Name *" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} className="w-full border rounded-xl p-2 text-sm" />
              <input type="tel" placeholder="Phone Number *" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="w-full border rounded-xl p-2 text-sm" />
              <input type="text" placeholder="Region/City/District *" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full border rounded-xl p-2 text-sm" />
              <input type="text" placeholder="Address (House no./building/street) *" value={newAddress.address} onChange={e => setNewAddress({...newAddress, address: e.target.value})} className="w-full border rounded-xl p-2 text-sm" />
              <input type="text" placeholder="Landmark (Optional)" value={newAddress.landmark} onChange={e => setNewAddress({...newAddress, landmark: e.target.value})} className="w-full border rounded-xl p-2 text-sm" />
              <div className="flex gap-4">
                <label className="flex items-center gap-2"><input type="radio" name="addrType" checked={newAddress.type === "home"} onChange={() => setNewAddress({...newAddress, type: "home"})} /> Home</label>
                <label className="flex items-center gap-2"><input type="radio" name="addrType" checked={newAddress.type === "office"} onChange={() => setNewAddress({...newAddress, type: "office"})} /> Office</label>
              </div>
              <div className="flex gap-3">
                <button onClick={handleAddAddress} className="flex-1 bg-orange-500 text-white py-2 rounded-xl text-sm font-semibold">Save</button>
                <button onClick={() => setShowAddressForm(false)} className="flex-1 border border-gray-300 py-2 rounded-xl text-sm">Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold text-lg mb-3">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Merchandise Subtotal</span><span>৳{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-green-600"><span>Discount</span><span>- ৳{discount.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Shipping Fee</span><span>৳{shippingFee.toLocaleString()}</span></div>
            <div className="border-t pt-2 mt-2 flex justify-between font-bold"><span>Total</span><span>৳{total.toLocaleString()}</span></div>
          </div>

          {/* Voucher */}
          <div className="mt-4 flex gap-2">
            <input type="text" placeholder="Enter voucher code" value={voucherCode} onChange={e => setVoucherCode(e.target.value)} className="flex-1 border rounded-xl p-2 text-sm" />
            <button onClick={handleApplyVoucher} className="bg-gray-100 px-4 rounded-xl text-sm font-semibold">Apply</button>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Try "SAVE10" or "FREESHIP"</p>
        </div>

        {/* Proceed Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold text-lg disabled:opacity-70"
        >
          {loading ? "Processing..." : `Proceed to Pay ৳${total.toLocaleString()}`}
        </button>
      </div>

      {/* Bottom Navigation (same as mall) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white flex justify-around items-center py-2 border-t shadow-lg z-50">
        <button onClick={() => router.push("/mall")} className="flex flex-col items-center"><span className="text-xl">🏠</span><span className="text-[8px] font-semibold">HOME</span></button>
        <button onClick={() => router.push("/mall/category")} className="flex flex-col items-center"><span className="text-xl">📂</span><span className="text-[8px] font-semibold">CATEGORY</span></button>
        <button onClick={() => router.push("/mall/trending")} className="flex flex-col items-center"><span className="text-xl">🔥</span><span className="text-[8px] font-semibold">TRENDING</span></button>
        <button onClick={() => router.push("/mall/cart")} className="flex flex-col items-center relative"><span className="text-xl">🛒</span><span className="text-[8px] font-semibold">CART</span></button>
        <button onClick={() => router.push("/mall/me")} className="flex flex-col items-center"><span className="text-xl">👤</span><span className="text-[8px] font-semibold text-orange-500">ME</span></button>
        <button onClick={() => { if(confirm("Exit Mall?")) router.push("/"); }} className="flex flex-col items-center"><span className="text-xl">🚪</span><span className="text-[8px] font-semibold text-red-500">EXIT</span></button>
      </nav>
    </div>
  );
}