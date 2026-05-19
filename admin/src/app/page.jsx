"use client";
import { useState, useEffect } from "react";

const SalesChart = () => {
  const data = [45, 52, 38, 65, 48, 72, 58]; // Mock weekly sales
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-2 h-40 mt-6">
      {data.map((val, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
          <div
            className="w-full bg-indigo-500/20 group-hover:bg-indigo-500 transition-all rounded-t-lg relative"
            style={{ height: `${(val / max) * 100}%` }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              ${val * 100}
            </div>
          </div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase">
            Day {i + 1}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    mrp: "",
    discountedPrice: "",
    category: "Apparel",
    stock: "",
    description: "",
    details: "",
    expiryDate: "",
    image: "",
  });

  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [settings, setSettings] = useState({
    isMaintenanceMode: false,
    isHighDemandMode: false,
    serviceableLocations: [],
    storeName: "FreshCart",
    contactEmail: "support@freshcart.com",
    currency: "USD",
    taxRate: 5,
    socialLinks: { facebook: "", twitter: "", instagram: "" },
  });
  const [newLocation, setNewLocation] = useState("");

  const [queries, setQueries] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const fetchQueries = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/settings/queries");
      if (res.ok) {
        const data = await res.json();
        setQueries(data);
      }
    } catch (e) {
      console.error("Failed to fetch queries");
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({ ...prev, ...data }));
        if (data.theme === "dark") {
          setIsDarkMode(true);
          document.documentElement.classList.add("dark");
        } else {
          setIsDarkMode(false);
          document.documentElement.classList.remove("dark");
        }
      }
    } catch (e) {
      console.error("Failed to fetch settings");
    }
  };

  const addLocation = async () => {
    if (!newLocation) return;
    try {
      const res = await fetch("http://localhost:5000/api/v1/settings/location/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode: newLocation }),
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({ ...prev, serviceableLocations: data.serviceableLocations }));
        setNewLocation("");
      }
    } catch (e) {
      alert("Failed to add location");
    }
  };

  const removeLocation = async (pincode) => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/settings/location/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode }),
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({ ...prev, serviceableLocations: data.serviceableLocations }));
      }
    } catch (e) {
      alert("Failed to remove location");
    }
  };

  const updateGlobalSettings = async (newData) => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/settings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      if (res.ok) {
        const result = await res.json();
        setSettings(prev => ({ ...prev, ...result.data }));
      }
    } catch (e) {
      alert("Failed to update settings");
    }
  };

  const toggleTheme = async () => {
    const nextMode = !isDarkMode;
    const themeStr = nextMode ? "dark" : "light";
    try {
      const res = await fetch("http://localhost:5000/api/v1/settings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: themeStr }),
      });
      if (res.ok) {
        setIsDarkMode(nextMode);
        if (nextMode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    } catch (e) {
      alert("Failed to sync global theme");
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error("Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    let dataToExport = [];
    let headers = [];
    let filename = `${activeTab.toLowerCase()}_export.csv`;

    if (activeTab === "Inventory") {
      dataToExport = products;
      headers = ["Product ID", "Name", "MRP", "Discounted Price", "Category", "Stock"];
    } else if (activeTab === "Customers") {
      dataToExport = users;
      headers = ["User ID", "Name", "Email", "Role", "Created At"];
    } else if (activeTab === "Orders") {
      dataToExport = orders;
      headers = ["Order ID", "Customer Name", "Total", "Status", "Items Count"];
    } else if (activeTab === "Queries") {
      dataToExport = queries;
      headers = ["Query ID", "Email", "Category", "Message", "Status", "Created At"];
    } else {
      alert(`CSV Export not available for ${activeTab} tab.`);
      return;
    }

    if (!dataToExport || dataToExport.length === 0) {
      alert("No data available to export.");
      return;
    }

    const csvRows = [headers.join(",")];
    for (const item of dataToExport) {
      const values = [];
      if (activeTab === "Inventory") {
        values.push(item._id || item.id || "");
        values.push(`"${(item.name || "").replace(/"/g, '""')}"`);
        values.push(item.mrp || 0);
        values.push(item.discountedPrice || 0);
        values.push(item.category || "");
        values.push(item.stock || 0);
      } else if (activeTab === "Customers") {
        values.push(item._id || item.id || "");
        values.push(`"${(item.name || "").replace(/"/g, '""')}"`);
        values.push(item.email || "");
        values.push(item.role || "");
        values.push(item.createdAt || "");
      } else if (activeTab === "Orders") {
        values.push(item._id || item.id || "");
        values.push(`"${(item.customerName || "").replace(/"/g, '""')}"`);
        values.push(item.total || 0);
        values.push(item.status || "");
        values.push(item.itemsCount || 0);
      } else if (activeTab === "Queries") {
        values.push(item.id || "");
        values.push(item.email || "");
        values.push(item.category || "");
        values.push(`"${(item.message || "").replace(/"/g, '""')}"`);
        values.push(item.status || "");
        values.push(item.createdAt || "");
      }
      csvRows.push(values.join(","));
    }

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (activeTab === "Inventory") {
      fetchProducts();
    } else if (activeTab === "Customers") {
      fetchUsers();
    } else if (activeTab === "Orders") {
      fetchOrders();
    } else if (activeTab === "Queries") {
      fetchQueries();
    } else if (activeTab === "Settings") {
      fetchSettings();
    }
  }, [activeTab]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (parseFloat(newProduct.discountedPrice) >= parseFloat(newProduct.mrp)) {
      alert("Offer Price must be strictly less than M.R.P");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/v1/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          mrp: parseFloat(newProduct.mrp),
          discountedPrice: parseFloat(newProduct.discountedPrice),
          stock: parseInt(newProduct.stock),
        }),
      });
      if (res.ok) {
        alert("Product added successfully!");
        setIsAddModalOpen(false);
        setNewProduct({
          name: "",
          mrp: "",
          discountedPrice: "",
          category: "Apparel",
          stock: "",
          description: "",
          details: "",
          expiryDate: "",
          image: "",
        });
        fetchProducts();
      }
    } catch (e) {
      alert("Failed to add product");
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/v1/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newStaff, role: "SUB_ADMIN" }),
      });
      if (res.ok) {
        alert("Sub Admin registered successfully!");
        setNewStaff({ name: "", email: "", password: "" });
        fetchUsers();
      } else {
        alert("Failed to register Sub Admin");
      }
    } catch (e) {
      alert("Error adding staff");
    }
  };

  const promoteToAdmin = (email) => {
    alert(`Promotion request for ${email} sent to architectural core.`);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-72 border-r border-zinc-200 dark:border-zinc-800 p-8 flex flex-col gap-10 hidden lg:flex bg-white dark:bg-black/20 backdrop-blur-md">
        <div className="text-2xl font-black tracking-tighter text-indigo-600 italic">
          FRESH CART
          <span className="text-[10px] not-italic align-top ml-1 opacity-50">
            ADMIN
          </span>
        </div>
        <nav className="flex flex-col gap-2">
          {[
            "Dashboard",
            "Orders",
            "Inventory",
            "Customers",
            "Team",
            "Queries",
            "Settings",
          ].map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`px-6 py-4 rounded-2xl text-sm text-left font-black transition-all ${activeTab === item ? "bg-indigo-600 text-white shadow-2xl shadow-indigo-500/40 translate-x-2" : "hover:bg-zinc-200 dark:hover:bg-zinc-900 text-zinc-500"}`}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </nav>
        <div className="mt-auto p-6 bg-zinc-100 dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800">
          <p className="text-[10px] font-black text-zinc-400 mb-2 uppercase tracking-widest">
            Logged in as
          </p>
          <p className="font-bold text-sm">Shanu Kumar</p>
          <p className="text-xs text-zinc-500 italic">Root Authority</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-14">
          <div>
            <h1 className="text-5xl font-black tracking-tighter mb-2 italic">
              {activeTab.toUpperCase()}
            </h1>
            <p className="text-zinc-500 font-medium tracking-tight">
              Real-time analytical control over the Fresh Cart ecosystem.
            </p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={exportToCSV}
              className="px-6 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 font-black text-xs uppercase tracking-widest hover:bg-white dark:hover:bg-zinc-900 transition-all active:scale-95 text-zinc-900 dark:text-zinc-100 bg-transparent"
            >
              Export CSV
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-black/10"
            >
              + NEW PRODUCT
            </button>
          </div>
        </header>

        {activeTab === "Dashboard" ? (
          <div className="space-y-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  label: "Gross Revenue",
                  value: "$124.5K",
                  trend: "+12.5%",
                  color: "text-emerald-500",
                  bg: "bg-emerald-500/5",
                },
                {
                  label: "Active Orders",
                  value: "842",
                  trend: "+42",
                  color: "text-indigo-500",
                  bg: "bg-indigo-500/5",
                },
                {
                  label: "Average AOV",
                  value: "$142.00",
                  trend: "+$12",
                  color: "text-amber-500",
                  bg: "bg-amber-500/5",
                },
                {
                  label: "Retention Rate",
                  value: "78.4%",
                  trend: "+2.1%",
                  color: "text-rose-500",
                  bg: "bg-rose-500/5",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`p-8 rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:-translate-y-2 cursor-pointer ${stat.bg}`}
                >
                  <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-4">
                    {stat.label}
                  </p>
                  <h2 className="text-4xl font-black mb-2 tracking-tighter italic">
                    {stat.value}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-black ${stat.color}`}>
                      {stat.trend}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-medium uppercase">
                      vs last week
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Sales Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-[48px] border border-zinc-200 dark:border-zinc-800 p-10 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-black text-2xl tracking-tighter italic uppercase">
                    Sales Performance
                  </h3>
                  <select className="bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl px-4 py-2 text-xs font-black outline-none">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                  </select>
                </div>
                <SalesChart />
              </div>

              <div className="bg-indigo-600 rounded-[48px] p-10 text-white shadow-2xl shadow-indigo-500/40 relative overflow-hidden group">
                <div className="relative z-10 flex flex-col h-full">
                  <h3 className="font-black text-3xl mb-6 tracking-tighter italic uppercase">
                    System Healthy
                  </h3>
                  <p className="text-indigo-100 text-sm mb-10 leading-relaxed font-medium">
                    E-commerce ecosystem is running optimally on MongoDB
                    Cluster. Latency: 14ms.
                  </p>
                  <div className="mt-auto space-y-4">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest opacity-60">
                      <span>Database Load</span>
                      <span>12%</span>
                    </div>
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-[12%]"></div>
                    </div>
                  </div>
                  <button className="w-full mt-10 py-4 rounded-2xl bg-white text-indigo-600 font-black text-xs uppercase tracking-widest hover:bg-indigo-50 active:scale-95 transition-all">
                    View Node Health
                  </button>
                </div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              </div>
            </div>
          </div>
        ) : activeTab === "Inventory" ? (
          <div className="bg-white dark:bg-zinc-900 rounded-[48px] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-50/50 dark:bg-zinc-800/20">
                  <th className="px-10 py-8">Product Details</th>
                  <th className="px-10 py-8">Category</th>
                  <th className="px-10 py-8">Inventory Status</th>
                  <th className="px-10 py-8 text-right">Pricing (MRP/Disc)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-10 py-32 text-center text-zinc-500 font-black italic text-xl opacity-20 uppercase tracking-tighter"
                    >
                      No Data in Architectural Core
                    </td>
                  </tr>
                ) : (
                  products.map((product, i) => (
                    <tr
                      key={i}
                      className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="px-10 py-8">
                        <div className="font-black text-lg tracking-tight group-hover:text-indigo-600 transition-colors">
                          {product.name}
                        </div>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                          {product.id}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className="px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500 border border-zinc-200 dark:border-zinc-700">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-32 bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-1000 ${product.stock > 50 ? "bg-emerald-500" : product.stock > 10 ? "bg-amber-500" : "bg-rose-500"}`}
                              style={{
                                width: `${Math.min(product.stock, 100)}%`,
                              }}
                            ></div>
                          </div>
                          <span
                            className={`text-[10px] font-black uppercase tracking-widest ${product.stock === 0 ? "text-rose-500 animate-pulse" : "text-zinc-500"}`}
                          >
                            {product.stock} Units
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="text-zinc-400 text-xs line-through font-bold decoration-2 decoration-rose-500/30">
                          ${product.mrp?.toFixed(2) || "0.00"}
                        </div>
                        <div className="text-2xl font-black italic tracking-tighter text-indigo-600">
                          ${product.discountedPrice?.toFixed(2) || "0.00"}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : activeTab === "Customers" ? (
          <div className="bg-white dark:bg-zinc-900 rounded-[48px] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-50/50 dark:bg-zinc-800/20">
                  <th className="px-10 py-8">User Identity</th>
                  <th className="px-10 py-8">Email & Phone</th>
                  <th className="px-10 py-8">Role</th>
                  <th className="px-10 py-8 text-right">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-10 py-32 text-center text-zinc-500 font-black italic text-xl opacity-20 uppercase tracking-tighter"
                    >
                      No Registered Users Found
                    </td>
                  </tr>
                ) : (
                  users.map((user, i) => (
                    <tr
                      key={i}
                      className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="px-10 py-8">
                        <div className="font-black text-lg tracking-tight group-hover:text-indigo-600 transition-colors">
                          {user.name || "Anonymous User"}
                        </div>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                          {user._id || user.id}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="font-bold text-sm">{user.email}</div>
                        <div className="text-xs text-zinc-500">
                          {user.phone || "No Phone"}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${user.role === "ADMIN" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="font-bold">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-[10px] text-zinc-400 uppercase font-black">
                          {new Date(user.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : activeTab === "Orders" ? (
          <div className="bg-white dark:bg-zinc-900 rounded-[48px] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-50/50 dark:bg-zinc-800/20">
                  <th className="px-10 py-8">Order ID</th>
                  <th className="px-10 py-8">Customer ID</th>
                  <th className="px-10 py-8">Status</th>
                  <th className="px-10 py-8 text-right">Investment (Total)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-10 py-32 text-center text-zinc-500 font-black italic text-xl opacity-20 uppercase tracking-tighter"
                    >
                      No Acquisition History Found
                    </td>
                  </tr>
                ) : (
                  orders.map((order, i) => (
                    <tr
                      key={i}
                      className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="px-10 py-8">
                        <div className="font-black text-lg tracking-tight group-hover:text-indigo-600 transition-colors">
                          {order._id || order.id}
                        </div>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="font-bold text-sm">{order.userId}</div>
                      </td>
                      <td className="px-10 py-8">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${order.status === "DELIVERED" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="text-2xl font-black italic tracking-tighter text-indigo-600">
                          ${order.total?.toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : activeTab === "Team" ? (
          <div className="space-y-10">
            <div className="bg-white dark:bg-zinc-900 rounded-[48px] border border-zinc-200 dark:border-zinc-800 p-10 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              <div>
                <h3 className="font-black text-2xl tracking-tighter italic uppercase">
                  Register Sub Admin
                </h3>
                <p className="text-zinc-500 text-sm mt-2">
                  Add a new staff member to manage the store.
                </p>
              </div>
              <form
                onSubmit={handleAddStaff}
                className="flex flex-wrap gap-4 items-end"
              >
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                    Name
                  </label>
                  <input
                    required
                    value={newStaff.name}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, name: e.target.value })
                    }
                    type="text"
                    className="px-6 py-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all outline-none"
                    placeholder="Staff Name"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                    Email
                  </label>
                  <input
                    required
                    value={newStaff.email}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, email: e.target.value })
                    }
                    type="email"
                    className="px-6 py-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all outline-none"
                    placeholder="staff@example.com"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                    Password
                  </label>
                  <input
                    required
                    value={newStaff.password}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, password: e.target.value })
                    }
                    type="password"
                    className="px-6 py-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 uppercase text-xs tracking-widest h-[46px] shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                >
                  Add Staff
                </button>
              </form>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-[48px] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm mt-10">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-50/50 dark:bg-zinc-800/20">
                    <th className="px-10 py-8">Staff Member</th>
                    <th className="px-10 py-8">Email</th>
                    <th className="px-10 py-8">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {users
                    .filter((u) => u.role === "ADMIN" || u.role === "SUB_ADMIN")
                    .map((user, i) => (
                      <tr
                        key={i}
                        className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                      >
                        <td className="px-10 py-8 font-bold">
                          {user.name || "Anonymous Staff"}
                        </td>
                        <td className="px-10 py-8 text-sm">{user.email}</td>
                        <td className="px-10 py-8">
                          <span
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${user.role === "ADMIN" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"}`}
                          >
                            {user.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === "Settings" ? (
          <div className="space-y-12 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-5xl font-black italic tracking-tighter uppercase mb-2">
                  Architectural Settings
                </h2>
                <p className="text-zinc-500 font-medium italic uppercase tracking-widest text-xs">
                  Global system configuration and store parameters.
                </p>
              </div>
            </div>

            {/* Maintenance Mode */}
            <div className="bg-white dark:bg-zinc-900 rounded-[48px] border border-zinc-200 dark:border-zinc-800 p-10 shadow-sm flex justify-between items-center group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-[80px] group-hover:bg-orange-500/10 transition-all duration-500"></div>
              <div>
                <h3 className="font-black text-2xl tracking-tighter italic uppercase text-zinc-900 dark:text-white">
                  Store Maintenance
                </h3>
                <p className="text-zinc-500 text-sm mt-1">
                  When active, customers will see a maintenance screen on the
                  storefront.
                </p>
              </div>
              <button
                onClick={() =>
                  updateGlobalSettings({
                    isMaintenanceMode: !settings.isMaintenanceMode,
                  })
                }
                className={`relative w-20 h-10 rounded-full transition-all duration-500 flex items-center px-1 ${settings.isMaintenanceMode ? "bg-orange-600" : "bg-zinc-200 dark:bg-zinc-800"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full bg-white shadow-lg transition-transform duration-500 transform ${settings.isMaintenanceMode ? "translate-x-10" : "translate-x-0"}`}
                ></div>
              </button>
            </div>

            {/* High Demand Mode */}
            <div className="bg-white dark:bg-zinc-900 rounded-[48px] border border-zinc-200 dark:border-zinc-800 p-10 shadow-sm flex justify-between items-center group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-[80px] group-hover:bg-rose-500/10 transition-all duration-500"></div>
              <div>
                <h3 className="font-black text-2xl tracking-tighter italic uppercase text-zinc-900 dark:text-white">
                  High Demand Mode
                </h3>
                <p className="text-zinc-500 text-sm mt-1">
                  When active, a banner alerts users about excess demand and service pauses.
                </p>
              </div>
              <button
                onClick={() =>
                  updateGlobalSettings({
                    isHighDemandMode: !settings.isHighDemandMode,
                  })
                }
                className={`relative w-20 h-10 rounded-full transition-all duration-500 flex items-center px-1 ${settings.isHighDemandMode ? "bg-rose-600" : "bg-zinc-200 dark:bg-zinc-800"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full bg-white shadow-lg transition-transform duration-500 transform ${settings.isHighDemandMode ? "translate-x-10" : "translate-x-0"}`}
                ></div>
              </button>
            </div>

            {/* Serviceable Locations */}
            <div className="bg-white dark:bg-zinc-900 rounded-[48px] border border-zinc-200 dark:border-zinc-800 p-10 shadow-sm">
              <h3 className="font-black text-2xl tracking-tighter italic uppercase text-zinc-900 dark:text-white mb-8">
                Serviceable Locations (Pincodes)
              </h3>
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Enter Pincode (e.g. 110001)"
                  className="flex-1 px-8 py-5 bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-zinc-100 dark:border-zinc-800 focus:ring-4 focus:ring-indigo-500/20 outline-none font-bold transition-all"
                />
                <button
                  onClick={addLocation}
                  className="px-10 py-5 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-500 uppercase text-xs tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-4">
                {settings.serviceableLocations?.map((loc) => (
                  <div key={loc} className="flex items-center gap-3 px-6 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                    <span className="font-black text-sm">{loc}</span>
                    <button onClick={() => removeLocation(loc)} className="text-zinc-400 hover:text-rose-500 transition-colors">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Appearance */}
            <div className="bg-white dark:bg-zinc-900 rounded-[48px] border border-zinc-200 dark:border-zinc-800 p-10 shadow-sm">
              <h3 className="font-black text-2xl tracking-tighter italic uppercase text-zinc-900 dark:text-white mb-8">
                System Appearance
              </h3>
              <div className="flex gap-4">
                <button
                  onClick={async () => {
                    if (isDarkMode) await toggleTheme();
                  }}
                  className={`flex-1 py-10 rounded-[32px] border-2 transition-all group flex flex-col items-center gap-4 ${!isDarkMode ? "bg-indigo-50 border-indigo-600 text-indigo-600" : "bg-zinc-50 dark:bg-zinc-800/50 border-transparent hover:border-zinc-300 dark:hover:border-zinc-700"}`}
                >
                  <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">
                    ☀️
                  </span>
                  <span className="font-black uppercase tracking-widest text-[10px]">
                    Light Aesthetic
                  </span>
                </button>
                <button
                  onClick={async () => {
                    if (!isDarkMode) await toggleTheme();
                  }}
                  className={`flex-1 py-10 rounded-[32px] border-2 transition-all group flex flex-col items-center gap-4 ${isDarkMode ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-600 text-white" : "bg-zinc-50 dark:bg-zinc-800/50 border-transparent hover:border-zinc-300 dark:hover:border-zinc-700"}`}
                >
                  <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">
                    🌙
                  </span>
                  <span className="font-black uppercase tracking-widest text-[10px]">
                    Dark Aesthetic
                  </span>
                </button>
              </div>
            </div>

            {/* General Config */}
            <div className="bg-white dark:bg-zinc-900 rounded-[48px] border border-zinc-200 dark:border-zinc-800 p-10 shadow-sm">
              <h3 className="font-black text-2xl tracking-tighter italic uppercase text-zinc-900 dark:text-white mb-8">
                Global Parameters
              </h3>
              <div className="grid grid-cols-2 gap-10">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 block">
                    Store Identifier
                  </label>
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) =>
                      setSettings({ ...settings, storeName: e.target.value })
                    }
                    onBlur={() =>
                      updateGlobalSettings({ storeName: settings.storeName })
                    }
                    className="w-full px-8 py-5 bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-zinc-100 dark:border-zinc-800 focus:ring-4 focus:ring-indigo-500/20 outline-none font-bold text-lg transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 block">
                    System Currency
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) =>
                      updateGlobalSettings({ currency: e.target.value })
                    }
                    className="w-full px-8 py-5 bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-zinc-100 dark:border-zinc-800 focus:ring-4 focus:ring-indigo-500/20 outline-none font-bold transition-all"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 block">
                    Support Protocol Email
                  </label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) =>
                      setSettings({ ...settings, contactEmail: e.target.value })
                    }
                    onBlur={() =>
                      updateGlobalSettings({
                        contactEmail: settings.contactEmail,
                      })
                    }
                    className="w-full px-8 py-5 bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-zinc-100 dark:border-zinc-800 focus:ring-4 focus:ring-indigo-500/20 outline-none font-bold transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 block">
                    Base Tax Coefficient (%)
                  </label>
                  <input
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        taxRate: parseFloat(e.target.value),
                      })
                    }
                    onBlur={() =>
                      updateGlobalSettings({ taxRate: settings.taxRate })
                    }
                    className="w-full px-8 py-5 bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-zinc-100 dark:border-zinc-800 focus:ring-4 focus:ring-indigo-500/20 outline-none font-bold transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white dark:bg-zinc-900 rounded-[48px] border border-zinc-200 dark:border-zinc-800 p-10 shadow-sm">
              <h3 className="font-black text-2xl tracking-tighter italic uppercase text-zinc-900 dark:text-white mb-8">
                Ecosystem Connectivity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {["Facebook", "Twitter", "Instagram"].map((platform) => (
                  <div key={platform} className="relative">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 block">
                      {platform} Profile
                    </label>
                    <input
                      type="text"
                      placeholder={`https://${platform.toLowerCase()}.com/yourstore`}
                      className="w-full px-8 py-5 bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-zinc-100 dark:border-zinc-800 focus:ring-4 focus:ring-indigo-500/20 outline-none font-medium transition-all text-sm"
                    />
                  </div>
                ))}
              </div>
              <button className="mt-10 px-10 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-black rounded-2xl uppercase text-[10px] tracking-widest hover:scale-105 transition-all">
                Save Connectivity
              </button>
            </div>

            {/* Security Section */}
            <div className="bg-rose-500/5 rounded-[48px] border border-rose-500/20 p-10 shadow-sm">
              <h3 className="font-black text-2xl tracking-tighter italic uppercase text-rose-600 mb-8">
                Security Protocol
              </h3>
              <div className="flex flex-col md:flex-row gap-6">
                <button className="flex-1 py-6 px-10 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 font-black uppercase text-[10px] tracking-widest text-zinc-600 dark:text-zinc-400 hover:text-rose-600 transition-all">
                  Rotate Admin Credentials
                </button>
                <button className="flex-1 py-6 px-10 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 font-black uppercase text-[10px] tracking-widest text-zinc-600 dark:text-zinc-400 hover:text-rose-600 transition-all">
                  Force Global Logout
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === "Queries" ? (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2 text-zinc-900 dark:text-white">
                  Support Queries
                </h2>
                <p className="text-zinc-500 font-medium italic uppercase tracking-widest text-xs">
                  Review and manage customer issues and queries.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-[48px] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                      <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        Customer Email
                      </th>
                      <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        Category
                      </th>
                      <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        Message Description
                      </th>
                      <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        Status
                      </th>
                      <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
                    {queries.map((q) => (
                      <tr key={q.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-850/20 transition-all">
                        <td className="px-10 py-6 text-sm font-bold text-zinc-900 dark:text-white">
                          {q.email}
                        </td>
                        <td className="px-10 py-6 text-sm font-medium text-zinc-500">
                          {q.category}
                        </td>
                        <td className="px-10 py-6 text-sm text-zinc-600 dark:text-zinc-300 max-w-xs truncate">
                          {q.message}
                        </td>
                        <td className="px-10 py-6">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                              q.status === "Pending"
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            }`}
                          >
                            {q.status}
                          </span>
                        </td>
                        <td className="px-10 py-6">
                          {q.status === "Pending" ? (
                            <button
                              onClick={async () => {
                                try {
                                  const res = await fetch(`http://localhost:5000/api/v1/settings/queries/resolve/${q.id}`, {
                                    method: "POST",
                                  });
                                  if (res.ok) {
                                    fetchQueries();
                                  }
                                } catch (err) {
                                  alert("Failed to resolve query");
                                }
                              }}
                              className="px-4 py-2 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-500 uppercase text-[9px] tracking-widest active:scale-95 transition-all"
                            >
                              Resolve
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-zinc-400">RESOLVED</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {queries.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-10 py-10 text-center text-zinc-400 italic text-sm">
                          No active support queries found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] bg-white dark:bg-zinc-900 rounded-[48px] border border-dashed border-zinc-300 dark:border-zinc-700">
            <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <span className="text-3xl">🏗️</span>
            </div>
            <p className="text-zinc-500 font-black italic uppercase tracking-widest">
              Architecting {activeTab} View...
            </p>
          </div>
        )}

        {/* Add Product Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-12">
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-3xl animate-in fade-in duration-500"
              onClick={() => setIsAddModalOpen(false)}
            ></div>
            <div className="relative w-full max-w-4xl bg-white dark:bg-zinc-950 rounded-[64px] p-12 sm:p-20 shadow-2xl animate-in zoom-in-95 duration-500 border border-white/10 overflow-y-auto max-h-[95vh] custom-scrollbar">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h2 className="text-5xl font-black italic mb-2 tracking-tighter uppercase">
                    Register Unit
                  </h2>
                  <p className="text-zinc-500 font-medium">
                    Adding new assets to the global inventory system.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-14 h-14 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center hover:rotate-90 transition-all duration-500 text-2xl font-light"
                >
                  ×
                </button>
              </div>

              <form
                className="grid grid-cols-1 md:grid-cols-2 gap-10"
                onSubmit={handleAddProduct}
              >
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 block">
                    Product Designation
                  </label>
                  <input
                    required
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    type="text"
                    className="w-full px-8 py-5 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none font-bold text-lg"
                    placeholder="e.g. ARCHITECTURAL HOODIE X1"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 block">
                    M.R.P ($)
                  </label>
                  <input
                    required
                    value={newProduct.mrp}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, mrp: e.target.value })
                    }
                    type="number"
                    step="0.01"
                    className="w-full px-8 py-5 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none font-black"
                    placeholder="599.00"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 block">
                    Offer Price ($)
                  </label>
                  <input
                    required
                    value={newProduct.discountedPrice}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        discountedPrice: e.target.value,
                      })
                    }
                    type="number"
                    step="0.01"
                    className="w-full px-8 py-5 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none font-black text-indigo-600"
                    placeholder="299.00"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 block">
                    Category
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        category: e.target.value,
                        expiryDate:
                          e.target.value === "Grocery Items"
                            ? newProduct.expiryDate
                            : "",
                      })
                    }
                    className="w-full px-8 py-5 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none font-bold"
                  >
                    {[
                      "Apparel",
                      "Footwear",
                      "Health",
                      "Tech",
                      "Home",
                      "Accessories",
                      "Grocery Items",
                    ].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 block">
                    Stock Quantity
                  </label>
                  <input
                    required
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: e.target.value })
                    }
                    type="number"
                    className="w-full px-8 py-5 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none font-bold"
                    placeholder="100"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 block">
                    Expiry Date{" "}
                    {newProduct.category === "Grocery Items"
                      ? "(Mandatory)"
                      : "(Deactivated)"}
                  </label>
                  <input
                    value={newProduct.expiryDate}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        expiryDate: e.target.value,
                      })
                    }
                    type="date"
                    disabled={newProduct.category !== "Grocery Items"}
                    required={newProduct.category === "Grocery Items"}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-8 py-5 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 block">
                    Description Narrative
                  </label>
                  <textarea
                    required
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-8 py-5 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none min-h-[120px] font-medium leading-relaxed"
                    placeholder="Narrative description for the storefront..."
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full py-6 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-500 shadow-2xl shadow-indigo-500/30 active:scale-[0.98] transition-all uppercase tracking-[0.3em] text-sm italic"
                  >
                    Finalize Registration
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
