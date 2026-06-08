"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Review } from "@/types";
import { Star, Check, X, Trash2 } from "lucide-react";

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const fetched: Review[] = [];
      snapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as Review);
      });
      setReviews(fetched);
    } catch (error) {
      console.error("Error fetching reviews", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, "reviews", id), { isApproved: true });
      fetchReviews();
    } catch (error) {
      console.error("Error approving review", error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateDoc(doc(db, "reviews", id), { isApproved: false });
      fetchReviews();
    } catch (error) {
      console.error("Error rejecting review", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteDoc(doc(db, "reviews", id));
        fetchReviews();
      } catch (error) {
        console.error("Error deleting review", error);
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-serif text-zafira-slate uppercase tracking-wide mb-8">
        Content Vetting & Review Management
      </h1>

      <div className="bg-white border border-zafira-slate/10 shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-zafira-cream text-zafira-slate/70 uppercase tracking-wider text-xs border-b border-zafira-slate/10">
            <tr>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Product ID</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4 w-1/3">Comment</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-zafira-slate/50">Loading reviews...</td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-zafira-slate/50">No reviews found.</td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.id} className="border-b border-zafira-slate/5 hover:bg-zafira-cream/50">
                  <td className="px-6 py-4 font-medium">{review.customerName}</td>
                  <td className="px-6 py-4 text-xs text-zafira-slate/60">{review.productId.slice(0, 8)}...</td>
                  <td className="px-6 py-4">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < review.rating ? "fill-zafira-gold text-zafira-gold" : "text-zafira-slate/20"
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zafira-slate/80">{review.comment}</td>
                  <td className="px-6 py-4">
                    {review.isApproved ? (
                      <span className="px-2 py-1 text-xs rounded-sm bg-green-100 text-green-800">Approved</span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-sm bg-yellow-100 text-yellow-800">Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {!review.isApproved && (
                      <button onClick={() => handleApprove(review.id)} className="p-1 text-green-600 hover:bg-green-50 rounded" title="Approve">
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    {review.isApproved && (
                      <button onClick={() => handleReject(review.id)} className="p-1 text-yellow-600 hover:bg-yellow-50 rounded" title="Unapprove">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(review.id)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
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
