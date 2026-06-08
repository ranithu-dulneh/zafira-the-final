"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Category, ProductCategory } from "@/types";
import { UploadCloud, X } from "lucide-react";

export default function AdminProducts() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [newSubCategory, setNewSubCategory] = useState({ name: "", parent: "mens" as ProductCategory });

  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    basePrice: "",
    stockCount: "",
    primaryCategory: "mens" as ProductCategory,
    subCategory: "",
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, "categories"));
      const cats: Category[] = [];
      snapshot.forEach((doc) => cats.push({ id: doc.id, ...doc.data() } as Category));
      setCategories(cats);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubCategory.name) return;
    try {
      await addDoc(collection(db, "categories"), {
        name: newSubCategory.name,
        parentCategory: newSubCategory.parent,
      });
      setNewSubCategory({ name: "", parent: "mens" });
      fetchCategories();
    } catch (err) {
      console.error("Error adding category", err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, "categories", id));
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category", err);
    }
  };

  const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const imageUrls: string[] = [];
      for (const file of imageFiles) {
        const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
        const uploadResult = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(uploadResult.ref);
        imageUrls.push(url);
      }

      await addDoc(collection(db, "products"), {
        title: productForm.title,
        description: productForm.description,
        basePrice: Number(productForm.basePrice),
        stockCount: Number(productForm.stockCount),
        primaryCategory: productForm.primaryCategory,
        subCategory: productForm.subCategory,
        images: imageUrls,
        ratingsAverage: 0,
        createdAt: serverTimestamp(),
      });

      alert("Product added successfully!");
      setProductForm({
        title: "", description: "", basePrice: "", stockCount: "", primaryCategory: "mens", subCategory: ""
      });
      setImageFiles([]);
    } catch (err) {
      console.error("Error adding product", err);
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <h1 className="text-2xl font-serif text-zafira-slate uppercase tracking-wide mb-8">
        Product & Category Manager
      </h1>

      {/* Category Manager */}
      <section className="bg-white p-6 border border-zafira-slate/10 shadow-sm">
        <h2 className="text-lg font-medium uppercase tracking-wide mb-6 border-b border-zafira-slate/10 pb-4">
          Category Hierarchy Manager
        </h2>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm uppercase tracking-wide">Primary Category</label>
                <select
                  value={newSubCategory.parent}
                  onChange={(e) => setNewSubCategory({ ...newSubCategory, parent: e.target.value as ProductCategory })}
                  className="border border-zafira-slate/20 p-2 outline-none"
                >
                  <option value="mens">Men&apos;s</option>
                  <option value="womens">Women&apos;s</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm uppercase tracking-wide">New Sub-Category Name</label>
                <input
                  type="text"
                  value={newSubCategory.name}
                  onChange={(e) => setNewSubCategory({ ...newSubCategory, name: e.target.value })}
                  placeholder="e.g. Necklaces"
                  className="border border-zafira-slate/20 p-2 outline-none"
                  required
                />
              </div>
              <button type="submit" className="px-6 py-2 bg-zafira-slate text-white text-sm uppercase tracking-widest hover:bg-zafira-gold transition-colors">
                Add Sub-Category
              </button>
            </form>
          </div>

          <div className="flex-1 space-y-6">
            {(["mens", "womens", "unisex"] as ProductCategory[]).map(parent => (
              <div key={parent}>
                <h3 className="font-medium uppercase tracking-widest mb-2 border-b border-zafira-slate/5 pb-1">{parent}</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.filter(c => c.parentCategory === parent).map(c => (
                    <div key={c.id} className="flex items-center space-x-1 bg-zafira-cream px-3 py-1 text-sm border border-zafira-slate/10">
                      <span>{c.name}</span>
                      <button onClick={() => handleDeleteCategory(c.id)} className="text-red-500 hover:text-red-700 ml-2">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {categories.filter(c => c.parentCategory === parent).length === 0 && (
                    <span className="text-sm text-zafira-slate/50 italic">No sub-categories</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Upload Wizard */}
      <section className="bg-white p-6 border border-zafira-slate/10 shadow-sm">
        <h2 className="text-lg font-medium uppercase tracking-wide mb-6 border-b border-zafira-slate/10 pb-4">
          Product Upload Wizard
        </h2>

        <form onSubmit={handleAddProduct} className="space-y-6 max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <label className="text-sm uppercase tracking-wide">Product Title</label>
              <input type="text" name="title" value={productForm.title} onChange={handleProductInputChange} required className="border border-zafira-slate/20 p-2 outline-none" />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm uppercase tracking-wide">Base Price (LKR)</label>
              <input type="number" name="basePrice" value={productForm.basePrice} onChange={handleProductInputChange} required min="0" className="border border-zafira-slate/20 p-2 outline-none" />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm uppercase tracking-wide">Primary Category</label>
              <select name="primaryCategory" value={productForm.primaryCategory} onChange={handleProductInputChange} className="border border-zafira-slate/20 p-2 outline-none">
                <option value="mens">Men&apos;s</option>
                <option value="womens">Women&apos;s</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm uppercase tracking-wide">Sub Category</label>
              <select name="subCategory" value={productForm.subCategory} onChange={handleProductInputChange} required className="border border-zafira-slate/20 p-2 outline-none">
                <option value="">Select Sub-Category</option>
                {categories.filter(c => c.parentCategory === productForm.primaryCategory).map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col space-y-2 col-span-full md:col-span-1">
              <label className="text-sm uppercase tracking-wide">Stock Count</label>
              <input type="number" name="stockCount" value={productForm.stockCount} onChange={handleProductInputChange} required min="0" className="border border-zafira-slate/20 p-2 outline-none" />
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm uppercase tracking-wide">Description</label>
            <textarea name="description" value={productForm.description} onChange={handleProductInputChange} required rows={4} className="border border-zafira-slate/20 p-2 outline-none resize-none" />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm uppercase tracking-wide">Product Images</label>
            <div className="border-2 border-dashed border-zafira-slate/20 p-8 text-center hover:bg-zafira-cream transition-colors">
              <input type="file" id="images" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
              <label htmlFor="images" className="cursor-pointer flex flex-col items-center space-y-2">
                <UploadCloud className="w-8 h-8 text-zafira-slate/40" />
                <span className="text-sm text-zafira-slate/70">
                  {imageFiles.length > 0 ? `${imageFiles.length} files selected` : "Click to select images (multiple allowed)"}
                </span>
              </label>
            </div>
            {imageFiles.length > 0 && (
              <div className="flex gap-2 mt-2">
                 {imageFiles.map((f, i) => <span key={i} className="text-xs bg-zafira-slate/10 px-2 py-1">{f.name}</span>)}
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-zafira-slate text-white uppercase tracking-widest text-sm hover:bg-zafira-gold transition-colors disabled:opacity-50">
            {loading ? "Uploading..." : "Publish Product"}
          </button>
        </form>
      </section>
    </div>
  );
}
