export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-serif text-zafira-slate uppercase tracking-wide mb-8">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 border border-zafira-slate/10 shadow-sm">
          <h3 className="text-sm uppercase tracking-widest text-zafira-slate/60 mb-2">Total Orders</h3>
          <p className="text-3xl font-serif text-zafira-slate">--</p>
        </div>
        <div className="bg-white p-6 border border-zafira-slate/10 shadow-sm">
          <h3 className="text-sm uppercase tracking-widest text-zafira-slate/60 mb-2">Total Revenue</h3>
          <p className="text-3xl font-serif text-zafira-slate">LKR --</p>
        </div>
        <div className="bg-white p-6 border border-zafira-slate/10 shadow-sm">
          <h3 className="text-sm uppercase tracking-widest text-zafira-slate/60 mb-2">Active Products</h3>
          <p className="text-3xl font-serif text-zafira-slate">--</p>
        </div>
        <div className="bg-white p-6 border border-zafira-slate/10 shadow-sm">
          <h3 className="text-sm uppercase tracking-widest text-zafira-slate/60 mb-2">Pending Reviews</h3>
          <p className="text-3xl font-serif text-zafira-slate">--</p>
        </div>
      </div>
    </div>
  );
}
