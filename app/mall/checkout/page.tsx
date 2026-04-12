// app/mall/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { 
  ChevronLeft, MapPin, Home, Briefcase, Truck, Percent, 
  CreditCard, Wallet, Banknote, ShieldCheck, Clock, 
  CheckCircle, AlertCircle, Plus, Trash2, Edit3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ==================== TYPES ====================
type Address = {
  id: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  landmark: string;
  type: "home" | "office";
  isDefault?: boolean;
};

type PaymentMethod = "cod" | "card" | "bkash" | "nagad";

type DeliveryOption = {
  id: string;
  name: string;
  price: number;
  days: string;
};

// ==================== MOCK DATA ====================
const deliveryOptions: DeliveryOption[] = [
  { id: "standard", name: "Standard Delivery", price: 70, days: "3-5 days" },
  { id: "express", name: "Express Delivery", price: 150, days: "1-2 days" },
  { id: "same-day", name: "Same Day Delivery", price: 250, days: "Today" },
];

const paymentMethods = [
  { id: "cod", name: "Cash on Delivery", icon: <Banknote size={20} />, color: "text-green-600" },
  { id: "card", name: "Credit / Debit Card", icon: <CreditCard size={20} />, color: "text-blue-600" },
  { id: "bkash", name: "bKash", icon: <Wallet size={20} />, color: "text-pink-600" },
  { id: "nagad", name: "Nagad", icon: <Wallet size={20} />, color: "text-purple-600" },
];

// ==================== MAIN COMPONENT ====================
export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  
  // Step management
  const [step, setStep] = useState(1); // 1: address, 2: payment, 3: review
  
  // Address states
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState({
    name: user?.name || "",
    phone: "",
    city: "",
    address: "",
    landmark: "",
    type: "home" as "home" | "office",
  });
  
  // Delivery & Payment
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption>(deliveryOptions[0]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("cod");
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [orderNote, setOrderNote] = useState("");
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  // Calculate totals
  const subtotal = getCartTotal();
  const deliveryFee = selectedDelivery.price;
  const total = subtotal + deliveryFee - discount;
  
  // Load saved addresses
  useEffect(() => {
    const saved = localStorage.getItem("checkout_addresses");
    if (saved) {
      const parsed = JSON.parse(saved);
      setAddresses(parsed);
      const defaultAddr = parsed.find((a: Address) => a.isDefault);
      setSelectedAddress(defaultAddr || parsed[0] || null);
    }
  }, []);
  
  // Save addresses to localStorage
  const saveAddresses = (newAddresses: Address[]) => {
    setAddresses(newAddresses);
    localStorage.setItem("checkout_addresses", JSON.stringify(newAddresses));
  };
  
  // Add or update address
  const handleSaveAddress = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.city || !newAddress.address) {
      alert("Please fill all required fields");
      return;
    }
    
    if (editingAddress) {
      // Update existing
      const updated = addresses.map(a => 
        a.id === editingAddress.id ? { ...editingAddress, ...newAddress } : a
      );
      saveAddresses(updated);
      if (selectedAddress?.id === editingAddress.id) {
        setSelectedAddress({ ...editingAddress, ...newAddress });
      }
    } else {
      // Add new
      const address: Address = {
        id: Date.now().toString(),
        ...newAddress,
        isDefault: addresses.length === 0,
      };
      const updated = [...addresses, address];
      saveAddresses(updated);
      if (addresses.length === 0) setSelectedAddress(address);
    }
    resetAddressForm();
  };
  
  const resetAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
    setNewAddress({
      name: user?.name || "",
      phone: "",
      city: "",
      address: "",
      landmark: "",
      type: "home",
    });
  };
  
  const handleEditAddress = (addr: Address) => {
    setEditingAddress(addr);
    setNewAddress({
      name: addr.name,
      phone: addr.phone,
      city: addr.city,
      address: addr.address,
      landmark: addr.landmark,
      type: addr.type,
    });
    setShowAddressForm(true);
  };
  
  const handleDeleteAddress = (id: string) => {
    if (confirm("Delete this address?")) {
      const updated = addresses.filter(a => a.id !== id);
      saveAddresses(updated);
      if (selectedAddress?.id === id) {
        setSelectedAddress(updated[0] || null);
      }
    }
  };
  
  const handleSetDefault = (id: string) => {
    const updated = addresses.map(a => ({ ...a, isDefault: a.id === id }));
    saveAddresses(updated);
    setSelectedAddress(updated.find(a => a.id === id) || null);
  };
  
  // Apply voucher
  const handleApplyVoucher = () => {
    if (voucherCode === "SAVE10") {
      setDiscount(Math.min(subtotal * 0.1, 500));
      alert("10% discount applied (up to ৳500)");
    } else if (voucherCode === "FREESHIP") {
      setDiscount(deliveryFee);
      alert("Free shipping applied!");
    } else {
      alert("Invalid voucher code");
    }
  };
  
  // Place order
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      setStep(1);
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    // Clear cart and redirect to order confirmation
    clearCart();
    setOrderPlaced(true);
    setTimeout(() => {
      router.push("/mall/orders");
    }, 2000);
  };
  
  if (cart.length === 0 && !orderPlaced) {
    router.push("/mall/cart");
    return null;
  }
  
  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md shadow-xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h2>
          <p className="text-gray-500 mb-6">Your order has been successfully placed.</p>
          <button 
            onClick={() => router.push("/mall/orders")}
            className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold"
          >
            View Orders
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1"><ChevronLeft size={22} /></button>
        <h1 className="font-bold text-lg flex-1">Checkout</h1>
        <div className="flex gap-1 text-xs">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 1 ? "bg-orange-500 text-white" : "bg-gray-200"}`}>1</span>
          <span className="text-gray-400">—</span>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 2 ? "bg-orange-500 text-white" : "bg-gray-200"}`}>2</span>
          <span className="text-gray-400">—</span>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 3 ? "bg-orange-500 text-white" : "bg-gray-200"}`}>3</span>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Step 1: Address */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-bold text-lg flex items-center gap-2"><MapPin size={18} /> Delivery Address</h2>
                  <button onClick={() => setShowAddressForm(true)} className="text-orange-500 text-sm font-semibold">+ Add New</button>
                </div>
                
                {addresses.length === 0 && !showAddressForm && (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No saved addresses</p>
                    <button onClick={() => setShowAddressForm(true)} className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-xl text-sm">Add Address</button>
                  </div>
                )}
                
                {addresses.length > 0 && !showAddressForm && (
                  <div className="space-y-3">
                    {addresses.map(addr => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`border rounded-xl p-3 cursor-pointer transition ${selectedAddress?.id === addr.id ? "border-orange-500 bg-orange-50" : "border-gray-100"}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{addr.name}</p>
                              {addr.isDefault && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Default</span>}
                            </div>
                            <p className="text-xs text-gray-500">{addr.phone}</p>
                            <p className="text-sm mt-1">{addr.address}, {addr.city}</p>
                            {addr.landmark && <p className="text-xs text-gray-400">Landmark: {addr.landmark}</p>}
                          </div>
                          <div className="flex gap-2">
                            <button onClick={(e) => { e.stopPropagation(); handleEditAddress(addr); }} className="text-gray-400 hover:text-orange-500"><Edit3 size={16} /></button>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr.id); }} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${addr.type === "home" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}>
                            {addr.type === "home" ? <Home size={10} /> : <Briefcase size={10} />}
                            {addr.type === "home" ? "Home" : "Office"}
                          </span>
                          {!addr.isDefault && (
                            <button onClick={(e) => { e.stopPropagation(); handleSetDefault(addr.id); }} className="text-xs text-orange-500">Set as Default</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Address Form Modal */}
                {showAddressForm && (
                  <div className="mt-4 p-4 border rounded-xl bg-gray-50 space-y-3">
                    <h3 className="font-semibold">{editingAddress ? "Edit Address" : "Add New Address"}</h3>
                    <input type="text" placeholder="Full Name *" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} className="w-full border rounded-xl p-2 text-sm" />
                    <input type="tel" placeholder="Phone Number *" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="w-full border rounded-xl p-2 text-sm" />
                    <input type="text" placeholder="City/District *" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full border rounded-xl p-2 text-sm" />
                    <input type="text" placeholder="Full Address *" value={newAddress.address} onChange={e => setNewAddress({...newAddress, address: e.target.value})} className="w-full border rounded-xl p-2 text-sm" />
                    <input type="text" placeholder="Landmark (Optional)" value={newAddress.landmark} onChange={e => setNewAddress({...newAddress, landmark: e.target.value})} className="w-full border rounded-xl p-2 text-sm" />
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2"><input type="radio" name="addrType" checked={newAddress.type === "home"} onChange={() => setNewAddress({...newAddress, type: "home"})} /> Home</label>
                      <label className="flex items-center gap-2"><input type="radio" name="addrType" checked={newAddress.type === "office"} onChange={() => setNewAddress({...newAddress, type: "office"})} /> Office</label>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleSaveAddress} className="flex-1 bg-orange-500 text-white py-2 rounded-xl text-sm font-semibold">Save</button>
                      <button onClick={resetAddressForm} className="flex-1 border border-gray-300 py-2 rounded-xl text-sm">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setStep(2)}
                disabled={!selectedAddress}
                className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold disabled:opacity-50"
              >
                Continue to Payment
              </button>
            </motion.div>
          )}
          
          {/* Step 2: Payment & Delivery */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Delivery Options */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h2 className="font-bold text-lg flex items-center gap-2 mb-3"><Truck size={18} /> Delivery Options</h2>
                <div className="space-y-2">
                  {deliveryOptions.map(opt => (
                    <label key={opt.id} className="flex items-center justify-between p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="delivery" checked={selectedDelivery.id === opt.id} onChange={() => setSelectedDelivery(opt)} className="w-4 h-4 text-orange-500" />
                        <div>
                          <p className="font-medium">{opt.name}</p>
                          <p className="text-xs text-gray-500">{opt.days}</p>
                        </div>
                      </div>
                      <span className="font-bold">৳{opt.price}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Payment Methods */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h2 className="font-bold text-lg flex items-center gap-2 mb-3"><CreditCard size={18} /> Payment Method</h2>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id as PaymentMethod)}
                      className={`flex items-center gap-2 p-3 border rounded-xl transition ${selectedPayment === method.id ? "border-orange-500 bg-orange-50" : "border-gray-100"}`}
                    >
                      <span className={method.color}>{method.icon}</span>
                      <span className="text-sm font-medium">{method.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Voucher */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h2 className="font-bold text-lg flex items-center gap-2 mb-3"><Percent size={18} /> Voucher / Coupon</h2>
                <div className="flex gap-2">
                  <input type="text" placeholder="Enter code" value={voucherCode} onChange={e => setVoucherCode(e.target.value)} className="flex-1 border rounded-xl p-2 text-sm" />
                  <button onClick={handleApplyVoucher} className="bg-gray-100 px-4 rounded-xl text-sm font-semibold">Apply</button>
                </div>
                <p className="text-[10px] text-gray-400 mt-2">Try "SAVE10" or "FREESHIP"</p>
              </div>
              
              {/* Order Note */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h2 className="font-bold text-lg mb-2">Order Note (Optional)</h2>
                <textarea rows={2} placeholder="Special instructions for delivery..." value={orderNote} onChange={e => setOrderNote(e.target.value)} className="w-full border rounded-xl p-2 text-sm" />
              </div>
              
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border border-gray-300 py-3 rounded-xl font-semibold">Back</button>
                <button onClick={() => setStep(3)} className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold">Review Order</button>
              </div>
            </motion.div>
          )}
          
          {/* Step 3: Review & Place Order */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Order Summary */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h2 className="font-bold text-lg mb-3">Order Summary</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Subtotal ({cart.length} items)</span><span>৳{subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Delivery Fee</span><span>৳{deliveryFee.toLocaleString()}</span></div>
                  {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>- ৳{discount.toLocaleString()}</span></div>}
                  <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg"><span>Total</span><span>৳{total.toLocaleString()}</span></div>
                </div>
              </div>
              
              {/* Delivery Address Review */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <h2 className="font-bold">Delivery Address</h2>
                  <button onClick={() => setStep(1)} className="text-orange-500 text-xs">Edit</button>
                </div>
                {selectedAddress && (
                  <div className="mt-2">
                    <p className="font-medium">{selectedAddress.name}</p>
                    <p className="text-xs text-gray-500">{selectedAddress.phone}</p>
                    <p className="text-sm">{selectedAddress.address}, {selectedAddress.city}</p>
                  </div>
                )}
              </div>
              
              {/* Payment Method Review */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <h2 className="font-bold">Payment Method</h2>
                  <button onClick={() => setStep(2)} className="text-orange-500 text-xs">Edit</button>
                </div>
                <p className="mt-2 text-sm capitalize">{paymentMethods.find(m => m.id === selectedPayment)?.name}</p>
              </div>
              
              {/* Delivery Option Review */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <h2 className="font-bold">Delivery Option</h2>
                  <button onClick={() => setStep(2)} className="text-orange-500 text-xs">Edit</button>
                </div>
                <p className="mt-2 text-sm">{selectedDelivery.name} - {selectedDelivery.days}</p>
              </div>
              
              {orderNote && (
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <h2 className="font-bold">Order Note</h2>
                  <p className="text-sm mt-1 text-gray-600">{orderNote}</p>
                </div>
              )}
              
              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold text-lg disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <ShieldCheck size={20} />}
                {loading ? "Processing..." : `Place Order • ৳${total.toLocaleString()}`}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
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