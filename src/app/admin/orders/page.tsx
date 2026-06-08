"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Order, PaymentStatus, OrderStatus } from "@/types";

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPayment, setFilterPayment] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const fetchedOrders: Order[] = [];
      snapshot.forEach((doc) => {
        fetchedOrders.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, status: PaymentStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { paymentStatus: status });
      fetchOrders();
    } catch (error) {
      console.error("Error updating payment status", error);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { orderStatus: status });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status", error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchPayment = filterPayment === "all" || order.deliveryMethod === filterPayment;
    const matchStatus = filterStatus === "all" || order.orderStatus === filterStatus;
    return matchPayment && matchStatus;
  });

  return (
    <div>
      <h1 className="text-2xl font-serif text-zafira-slate uppercase tracking-wide mb-8">
        Manage Orders
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <select
          value={filterPayment}
          onChange={(e) => setFilterPayment(e.target.value)}
          className="border border-zafira-slate/20 p-2 text-sm outline-none focus:border-zafira-gold bg-white"
        >
          <option value="all">All Payment Types</option>
          <option value="COD">Cash on Delivery</option>
          <option value="BankDeposit">Bank Deposit</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-zafira-slate/20 p-2 text-sm outline-none focus:border-zafira-gold bg-white"
        >
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Dispatched">Dispatched</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-zafira-slate/10 shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-zafira-cream text-zafira-slate/70 uppercase tracking-wider text-xs border-b border-zafira-slate/10">
            <tr>
              <th className="px-6 py-4">Order ID / Date</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Payment Method</th>
              <th className="px-6 py-4">Payment Status</th>
              <th className="px-6 py-4">Order Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-zafira-slate/50">Loading orders...</td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-zafira-slate/50">No orders found.</td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-zafira-slate/5 hover:bg-zafira-cream/50">
                  <td className="px-6 py-4">
                    <div className="font-medium">{order.id.slice(-6).toUpperCase()}</div>
                    <div className="text-xs text-zafira-slate/50">
                      {order.createdAt && (order.createdAt as any).toDate
                        ? (order.createdAt as any).toDate().toLocaleDateString()
                        : new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>{order.shippingAddress.fullName}</div>
                    <div className="text-xs text-zafira-slate/50">{order.customerId}</div>
                  </td>
                  <td className="px-6 py-4 font-serif">
                    LKR {order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-sm ${order.deliveryMethod === 'COD' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                      {order.deliveryMethod}
                    </span>
                    {order.deliveryMethod === 'BankDeposit' && order.bankReceiptUrl && (
                      <a href={order.bankReceiptUrl} target="_blank" rel="noreferrer" className="block text-xs mt-1 text-blue-600 hover:underline">View Receipt</a>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => handleUpdatePaymentStatus(order.id, e.target.value as PaymentStatus)}
                      className={`text-xs p-1 border border-zafira-slate/20 rounded-sm outline-none ${order.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}
                    >
                      <option value="Pending Verification">Pending Verification</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className="text-xs p-1 border border-zafira-slate/20 rounded-sm outline-none bg-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
