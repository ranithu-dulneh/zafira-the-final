"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { DeliveryMethod } from "@/types";
import { UploadCloud } from "lucide-react";

export default function CheckoutPage() {
  const { cart, totalAmount, clearCart } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"shipping" | "payment" | "success">("shipping");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("COD");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "", // Using email as customerId for simplicity without auth
  });

  if (cart.length === 0 && step !== "success") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <h2 className="text-2xl font-serif">Your cart is empty</h2>
        <button onClick={() => router.push("/")} className="px-8 py-3 bg-zafira-slate text-white uppercase text-sm tracking-widest">
          Return to Shop
        </button>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setReceiptFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handlePlaceOrder = async () => {
    if (deliveryMethod === "BankDeposit" && !receiptFile) {
      alert("Please upload your bank deposit receipt.");
      return;
    }

    setLoading(true);
    try {
      let receiptUrl = null;

      if (deliveryMethod === "BankDeposit" && receiptFile) {
        const storageRef = ref(storage, `receipts/${Date.now()}_${receiptFile.name}`);
        const uploadResult = await uploadBytes(storageRef, receiptFile);
        receiptUrl = await getDownloadURL(uploadResult.ref);
      }

      const orderData = {
        customerId: formData.email,
        items: cart,
        totalAmount,
        deliveryMethod,
        paymentStatus: deliveryMethod === "COD" ? "Pending Verification" : "Pending Verification",
        orderStatus: "Pending",
        shippingAddress: {
          fullName: formData.fullName,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          postalCode: formData.postalCode,
          phone: formData.phone,
        },
        bankReceiptUrl: receiptUrl,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "orders"), orderData);

      clearCart();
      setStep("success");
    } catch (error) {
      console.error("Error placing order", error);
      alert("There was an error placing your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 text-center px-4">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-3xl font-serif text-zafira-slate">Order Placed Successfully</h2>
        <p className="text-zafira-slate/70 max-w-md">
          Thank you for your purchase. We have received your order and it is currently being processed.
        </p>
        <button onClick={() => router.push("/")} className="mt-8 px-8 py-3 bg-zafira-slate text-white uppercase text-sm tracking-widest">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <h1 className="text-3xl font-serif text-center uppercase tracking-widest mb-12">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
        {/* Left Form Area */}
        <div className="flex-1 space-y-12">

          {/* Shipping Section */}
          <section className={step !== "shipping" ? "opacity-50 pointer-events-none" : ""}>
            <h2 className="text-xl font-medium uppercase tracking-wide border-b border-zafira-slate/10 pb-4 mb-6">1. Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="fullName" placeholder="Full Name *" required value={formData.fullName} onChange={handleInputChange} className="col-span-full border border-zafira-slate/20 p-3 outline-none focus:border-zafira-gold bg-transparent" />
              <input type="email" name="email" placeholder="Email Address *" required value={formData.email} onChange={handleInputChange} className="col-span-full border border-zafira-slate/20 p-3 outline-none focus:border-zafira-gold bg-transparent" />
              <input type="tel" name="phone" placeholder="Phone Number *" required value={formData.phone} onChange={handleInputChange} className="col-span-full border border-zafira-slate/20 p-3 outline-none focus:border-zafira-gold bg-transparent" />
              <input type="text" name="addressLine1" placeholder="Address Line 1 *" required value={formData.addressLine1} onChange={handleInputChange} className="col-span-full border border-zafira-slate/20 p-3 outline-none focus:border-zafira-gold bg-transparent" />
              <input type="text" name="addressLine2" placeholder="Address Line 2 (Optional)" value={formData.addressLine2} onChange={handleInputChange} className="col-span-full border border-zafira-slate/20 p-3 outline-none focus:border-zafira-gold bg-transparent" />
              <input type="text" name="city" placeholder="City *" required value={formData.city} onChange={handleInputChange} className="border border-zafira-slate/20 p-3 outline-none focus:border-zafira-gold bg-transparent" />
              <input type="text" name="postalCode" placeholder="Postal Code *" required value={formData.postalCode} onChange={handleInputChange} className="border border-zafira-slate/20 p-3 outline-none focus:border-zafira-gold bg-transparent" />
            </div>
            {step === "shipping" && (
              <button
                onClick={() => {
                  if (formData.fullName && formData.email && formData.addressLine1 && formData.city && formData.phone) {
                    setStep("payment");
                  } else {
                    alert("Please fill all required fields.");
                  }
                }}
                className="mt-6 px-8 py-3 bg-zafira-slate text-white uppercase tracking-widest text-sm w-full md:w-auto"
              >
                Continue to Payment
              </button>
            )}
          </section>

          {/* Payment Section */}
          <section className={step !== "payment" ? "opacity-50 pointer-events-none hidden md:block" : ""}>
             <div className="flex items-center justify-between border-b border-zafira-slate/10 pb-4 mb-6">
               <h2 className="text-xl font-medium uppercase tracking-wide">2. Payment Method</h2>
               {step === "payment" && (
                 <button onClick={() => setStep("shipping")} className="text-sm underline text-zafira-slate/60 hover:text-zafira-slate">Edit Shipping</button>
               )}
             </div>

             <div className="space-y-4">
               {/* COD Option */}
               <label className="flex items-center space-x-4 border border-zafira-slate/20 p-4 cursor-pointer hover:bg-white transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={deliveryMethod === "COD"}
                    onChange={() => setDeliveryMethod("COD")}
                    className="w-4 h-4 text-zafira-gold focus:ring-zafira-gold border-gray-300"
                  />
                  <div>
                    <span className="block font-medium uppercase tracking-wide text-sm">Cash on Delivery</span>
                    <span className="block text-sm text-zafira-slate/60 mt-1">Pay when you receive your order.</span>
                  </div>
               </label>

               {/* Bank Deposit Option */}
               <label className="flex items-start space-x-4 border border-zafira-slate/20 p-4 cursor-pointer hover:bg-white transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BankDeposit"
                    checked={deliveryMethod === "BankDeposit"}
                    onChange={() => setDeliveryMethod("BankDeposit")}
                    className="w-4 h-4 mt-1 text-zafira-gold focus:ring-zafira-gold border-gray-300"
                  />
                  <div className="flex-1">
                    <span className="block font-medium uppercase tracking-wide text-sm">Bank Transfer / Deposit</span>
                    <span className="block text-sm text-zafira-slate/60 mt-1 mb-4">Directly transfer to our corporate account.</span>

                    {deliveryMethod === "BankDeposit" && (
                      <div className="mt-4 p-4 bg-zafira-cream border border-zafira-slate/10 text-sm space-y-2">
                        <p><strong>Bank:</strong> Commercial Bank</p>
                        <p><strong>Account Name:</strong> ZAFIRA LUXURY PVT LTD</p>
                        <p><strong>Account Number:</strong> 1000 2345 6789</p>
                        <p><strong>Branch:</strong> Colombo 03</p>

                        <div className="mt-6">
                          <p className="font-medium mb-2 uppercase tracking-wide text-xs">Upload Receipt *</p>
                          <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleFileDrop}
                            className="border-2 border-dashed border-zafira-slate/20 rounded-sm p-6 text-center hover:bg-white hover:border-zafira-gold transition-colors"
                          >
                            <input
                              type="file"
                              id="receipt"
                              className="hidden"
                              accept="image/*,.pdf"
                              onChange={handleFileSelect}
                            />
                            <label htmlFor="receipt" className="cursor-pointer flex flex-col items-center space-y-2">
                              <UploadCloud className="w-8 h-8 text-zafira-slate/40" />
                              <span className="text-sm text-zafira-slate/70">
                                {receiptFile ? receiptFile.name : "Click to upload or drag and drop"}
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
               </label>
             </div>

             {step === "payment" && (
               <button
                 onClick={handlePlaceOrder}
                 disabled={loading}
                 className="mt-8 px-8 py-4 bg-zafira-slate text-white uppercase tracking-widest text-sm w-full font-medium hover:bg-zafira-gold transition-colors disabled:opacity-50"
               >
                 {loading ? "Processing..." : "Place Order"}
               </button>
             )}
          </section>
        </div>

        {/* Right Order Summary Area */}
        <div className="w-full lg:w-96">
          <div className="bg-white p-6 shadow-sm border border-zafira-slate/5 sticky top-24">
            <h2 className="text-lg font-medium uppercase tracking-wide border-b border-zafira-slate/10 pb-4 mb-4">Order Summary</h2>
            <div className="space-y-4 max-h-[40vh] overflow-y-auto mb-6 pr-2">
              {cart.map(item => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium uppercase">{item.title}</span>
                    <span className="text-zafira-slate/60">Qty: {item.quantity}</span>
                  </div>
                  <span>LKR {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-zafira-slate/10 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zafira-slate/60">Subtotal</span>
                <span>LKR {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zafira-slate/60">Shipping</span>
                <span>Calculated at next step</span>
              </div>
            </div>
            <div className="border-t border-zafira-slate/10 mt-4 pt-4 flex justify-between items-end">
              <span className="font-medium uppercase tracking-wide">Total</span>
              <span className="text-xl font-serif">LKR {totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
