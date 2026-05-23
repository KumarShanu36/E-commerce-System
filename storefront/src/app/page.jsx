"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { API_URL, ADMIN_URL } from "@/config";

const CATEGORIES = [
  { name: "Fruits & Veggies", icon: "🍎" },
  { name: "Dairy & Eggs", icon: "🥛" },
  { name: "Bakery", icon: "🍞" },
  { name: "Meat & Fish", icon: "🍗" },
  { name: "Beverages", icon: "🥤" },
  { name: "Snacks", icon: "🍪" },
  { name: "Grains & Oils", icon: "🌾" },
  { name: "Household", icon: "🧼" },
];

export default function Home() {
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isHighDemandMode, setIsHighDemandMode] = useState(false);
  const [serviceableLocations, setServiceableLocations] = useState([]);
  const [userPincode, setUserPincode] = useState("");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationStatus, setLocationStatus] = useState("detecting");
  
  // Support Ticketing States
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [helpEmail, setHelpEmail] = useState("");
  const [helpCategory, setHelpCategory] = useState("General Help");
  const [helpMessage, setHelpMessage] = useState("");
  const [helpSuccess, setHelpSuccess] = useState(false);

  // Advanced AI & Flipkart Ticket States
  const [activeHelpTab, setActiveHelpTab] = useState("chat"); // 'chat' or 'tickets'
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: "bot", text: "Welcome to FreshCart Support! 🍏 I am Freshy, your AI assistant. How can I help you today?", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [ticketList, setTicketList] = useState([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [ticketViewMode, setTicketViewMode] = useState("list"); // 'list' or 'create'
  const [themeMode, setThemeMode] = useState("light");

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/grocery_hero.png",
      title: "FRESH VEGETABLES",
      subtitle: "Delivered to your door.",
      desc: "Get the finest organic produce, dairy, and farm-fresh meat within 30 minutes.",
      color: "text-emerald-400",
    },
    {
      image: "/packed_grocery.png",
      title: "PACKED GROCERY",
      subtitle: "Premium Quality Items.",
      desc: "Stock up on the finest packed goods, from gourmet oils to organic grains.",
      color: "text-orange-400",
    },
    {
      image: "/grocery_offers.png",
      title: "EXCLUSIVE OFFERS",
      subtitle: "Save Big Every Day.",
      desc: "Unlock massive discounts on dairy, bakery, and seasonal favorites.",
      color: "text-rose-400",
    },
  ];

  useEffect(() => {
    const savedPincode = localStorage.getItem("userPincode");

    const checkStatusAndLocate = async () => {
      let currentLocations = [];
      try {
        const res = await fetch(`${API_URL}/api/v1/settings`);
        if (res.ok) {
          const data = await res.json();
          setIsMaintenanceMode(data.isMaintenanceMode);
          setIsHighDemandMode(data.isHighDemandMode);
          currentLocations = data.serviceableLocations || [];
          setServiceableLocations(currentLocations);
          // Sync Theme
          if (data.theme === "dark") {
            document.documentElement.classList.add("dark");
            setThemeMode("dark");
          } else {
            document.documentElement.classList.remove("dark");
            setThemeMode("light");
          }
        }
      } catch (e) {
        console.error("Failed to fetch system status");
      }

      // If there is a saved pincode and it's in the serviceable list, accept it immediately
      if (savedPincode && currentLocations.includes(savedPincode)) {
        setUserPincode(savedPincode);
        setLocationStatus("serviceable");
        setIsLocationModalOpen(false);
        return;
      }

      // Otherwise, request geolocation
      if (typeof window !== "undefined" && "geolocation" in navigator) {
        setIsLocationModalOpen(true);
        setLocationStatus("detecting");

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const geoRes = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
              );
              if (geoRes.ok) {
                const geoData = await geoRes.json();
                const pincode = geoData.postcode;
                if (pincode) {
                  setUserPincode(pincode);
                  if (currentLocations.includes(pincode)) {
                    localStorage.setItem("userPincode", pincode);
                    setLocationStatus("serviceable");
                    setIsLocationModalOpen(false);
                  } else {
                    setLocationStatus("unserviceable");
                  }
                  return;
                }
              }
            } catch (err) {
              console.error("Reverse geocoding failed", err);
            }
            setLocationStatus("pending");
          },
          (error) => {
            console.warn("Geolocation prompt rejected or failed", error);
            setLocationStatus("pending");
          },
          { timeout: 8000 }
        );
      } else {
        setIsLocationModalOpen(true);
        setLocationStatus("pending");
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/products`);
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

    checkStatusAndLocate();
    fetchProducts();

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const totalItems = Object.values(cart).reduce((acc, qty) => acc + qty, 0);
  const cartItemsList = products
    .filter((p) => cart[p.id || p._id])
    .map((p) => ({ ...p, qty: cart[p.id || p._id] }));

  const updateQuantity = (productId, delta) => {
    setCart((prev) => {
      const newQty = (prev[productId] || 0) + delta;
      const newCart = { ...prev };
      if (newQty <= 0) delete newCart[productId];
      else newCart[productId] = newQty;
      return newCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (authMode === "signup") {
        const res = await fetch(`${API_URL}/api/v1/users/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });
        if (res.ok) {
          setIsLoggedIn(true);
          setIsSignInOpen(false);
          alert("Account created successfully!");
        } else {
          const data = await res.json();
          alert(data.error || "Signup failed");
        }
      } else {
        const res = await fetch(`${API_URL}/api/v1/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (res.ok) {
          const data = await res.json();
          const user = data.user;
          if (authMode === "admin") {
            if (user.role === "ADMIN" || user.role === "SUB_ADMIN") {
              window.location.href = ADMIN_URL;
            } else {
              alert("Access Denied: You do not have admin privileges.");
            }
          } else {
            setIsLoggedIn(true);
            setIsSignInOpen(false);
            alert("Signed in successfully!");
          }
        } else {
          const data = await res.json();
          alert(data.error || "Login failed");
        }
      }
    } catch (error) {
      alert("Authentication error. Please check your connection.");
    }
  };

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    if (serviceableLocations.includes(userPincode)) {
      localStorage.setItem("userPincode", userPincode);
      setLocationStatus("serviceable");
      setIsLocationModalOpen(false);
    } else {
      setLocationStatus("unserviceable");
    }
  };

  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      setThemeMode("light");
    } else {
      document.documentElement.classList.add("dark");
      setThemeMode("dark");
    }
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const inputMsg = chatInput.toLowerCase();
    setChatInput("");
    setIsBotTyping(true);

    setTimeout(() => {
      let responseText = "I appreciate your message. I am an automated assistant, but you can easily submit a formal support ticket in the 'Support Tickets' tab and a human representative will look into this right away!";
      
      if (inputMsg.includes("order") || inputMsg.includes("delivery") || inputMsg.includes("time") || inputMsg.includes("arrive") || inputMsg.includes("late")) {
        responseText = "All FreshCart orders are processed instantly at our local dark stores and delivered in 10-15 minutes! You can track your order status in the 'Orders' section.";
      } else if (inputMsg.includes("refund") || inputMsg.includes("return") || inputMsg.includes("money") || inputMsg.includes("cancel")) {
        responseText = "We offer a 100% satisfaction guarantee. If any product is damaged or not fresh, we will refund it immediately to your original payment method. Contact us at support@freshcart.com.";
      } else if (inputMsg.includes("service") || inputMsg.includes("pincode") || inputMsg.includes("area") || inputMsg.includes("location") || inputMsg.includes("deliver")) {
        responseText = `We currently deliver to the following active pincodes: ${serviceableLocations.join(", ") || "110001, 10001, 75001"}. You can click on the 'Delivery Location' link in the navbar to test another location.`;
      } else if (inputMsg.includes("payment") || inputMsg.includes("card") || inputMsg.includes("cash") || inputMsg.includes("upi") || inputMsg.includes("pay")) {
        responseText = "We accept all major credit/debit cards, Net Banking, and popular UPI wallets. Cash on Delivery is also available for all serviceable locations.";
      } else if (inputMsg.includes("contact") || inputMsg.includes("email") || inputMsg.includes("number") || inputMsg.includes("phone") || inputMsg.includes("human") || inputMsg.includes("person") || inputMsg.includes("help")) {
        responseText = "You can email our customer support office at support@freshcart.com, call us at +91 70141 23456, or write a direct message in the 'Support Tickets' tab. We respond within 2 hours!";
      } else if (inputMsg.includes("hi") || inputMsg.includes("hello") || inputMsg.includes("greetings") || inputMsg.includes("hey")) {
        responseText = "Hello! I am Freshy, your virtual assistant. How can I help you today? Ask me about deliveries, refunds, or payment modes.";
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setChatMessages((prev) => [...prev, botMsg]);
      setIsBotTyping(false);
    }, 1000);
  };

  const loadUserTickets = async (emailToFetch) => {
    if (!emailToFetch) return;
    setIsLoadingTickets(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/settings/queries`);
      if (res.ok) {
        const data = await res.json();
        const userTickets = data.filter((q) => q.email.toLowerCase() === emailToFetch.toLowerCase());
        setTicketList(userTickets.reverse());
      }
    } catch (e) {
      console.error("Failed to load tickets", e);
    } finally {
      setIsLoadingTickets(false);
    }
  };

  const handleHelpSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/v1/settings/queries/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: helpEmail,
          category: helpCategory,
          message: helpMessage,
        }),
      });
      if (res.ok) {
        setHelpSuccess(true);
        setHelpMessage("");
        await loadUserTickets(helpEmail);
        setTicketViewMode("list");
        setTimeout(() => setHelpSuccess(false), 3000);
      }
    } catch (err) {
      alert("Failed to submit issue. Please check your connection.");
    }
  };

  if (isMaintenanceMode) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center p-10 text-center font-sans overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 animate-pulse"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="mb-12 inline-flex items-center gap-3 px-6 py-3 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              System Upgrade in Progress
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-8 text-zinc-900 dark:text-white leading-[0.9]">
            WE'RE <br />
            <span className="text-emerald-600">REFINING</span> <br />
            FRESHNESS.
          </h1>

          <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium mb-12 leading-relaxed">
            FreshCart is currently undergoing architectural enhancements to
            better serve your organic needs. We'll be back shortly with a
            faster, fresher experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <div className="px-8 py-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
              <span className="text-2xl">📧</span>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  Support Protocol
                </p>
                <p className="font-bold text-sm">support@freshcart.com</p>
              </div>
            </div>
            <div className="px-8 py-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
              <span className="text-2xl">📱</span>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  Direct Inquiries
                </p>
                <p className="font-bold text-sm">+91 70141 23456</p>
              </div>
            </div>
          </div>

          <div className="mt-20 pt-10 border-t border-zinc-100 dark:border-zinc-900 text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em]">
            Estimated Restoration: Within 120 Minutes
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-[#F1F3F6] dark:bg-zinc-950 font-sans selection:bg-emerald-500/30">
      {/* Flipkart-style Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white dark:bg-zinc-900 shadow-md border-b border-zinc-200 dark:border-zinc-800">
        {isHighDemandMode && (
          <div className="bg-rose-500 text-white text-center py-2 px-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="animate-pulse">⚠️</span>
            Unavailable due to excess demand. Orders may be delayed or paused.
          </div>
        )}
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-3 flex items-center gap-4 md:gap-10">
          <div className="flex items-center gap-3 border-r border-zinc-200 dark:border-zinc-800 pr-8 mr-2 hidden lg:flex">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              <path d="M12 9l2 2 4-4" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <div className="flex flex-col">
              <span className="text-2xl font-black italic tracking-tighter text-emerald-600 dark:text-emerald-500 leading-none">
                FreshCart
              </span>
              <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest mt-1 animate-pulse">
                10-15 MINS DELIVERED
              </span>
            </div>
          </div>

          <div 
            onClick={() => {
              setIsLocationModalOpen(true);
              setLocationStatus("pending");
            }}
            className="flex flex-col items-start min-w-[120px] hidden xl:flex cursor-pointer hover:opacity-85 transition-opacity"
          >
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
              Delivery Location
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-zinc-900 dark:text-white">
              <span>{userPincode ? `Postal Code: ${userPincode}` : "Select Location"}</span>
              <span className="text-[8px]">▼</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl relative group">
            <input
              type="text"
              placeholder="Search for apples, milk, or detergents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-100 dark:bg-zinc-800/50 border border-transparent focus:border-emerald-500/30 px-12 py-2.5 rounded-xl outline-none transition-all placeholder:text-zinc-400 font-medium text-sm"
            />

            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
              🔍
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center bg-white dark:bg-zinc-900 shadow-sm text-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-all cursor-pointer hover:rotate-12 duration-300 active:scale-95"
              title={themeMode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {themeMode === "dark" ? "☀️" : "🌙"}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    alert("Logged out");
                  }}
                  className="text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 transition-colors"
                >
                  Logout
                </button>
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-black text-emerald-700">
                  S
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode("signin");
                  setIsSignInOpen(true);
                }}
                className="bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 font-bold px-8 py-2 rounded-md border border-zinc-200 dark:border-zinc-700 hover:bg-emerald-50 transition-all shadow-sm active:scale-95"
              >
                Login
              </button>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">
                🛒
              </span>
              <span className="font-bold text-sm hidden md:block">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-lg">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Sub-nav categories */}
        <div className="bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 hidden md:block">
          <div className="max-w-[1280px] mx-auto px-8 py-1 flex justify-between">
            {CATEGORIES.slice(0, 8).map((cat) => (
              <button
                key={cat.name}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all group"
              >
                <span className="text-base group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </span>
                <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 group-hover:text-emerald-600 uppercase tracking-tight">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 md:pt-40 pb-20 px-4 md:px-8 max-w-[1280px] mx-auto">
        <div className="relative h-[300px] md:h-[500px] w-full rounded-[48px] overflow-hidden shadow-2xl mb-12 group bg-zinc-200 dark:bg-zinc-800">
          <div
            className="flex h-full transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, idx) => (
              <div key={idx} className="relative min-w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={idx === 0}
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-8 md:px-24 text-white">
                  <h2 className="text-4xl md:text-8xl font-black italic tracking-tighter mb-4 animate-in slide-in-from-left duration-1000">
                    {slide.title.split(" ")[0]} <br />
                    <span
                      className={`${slide.color} uppercase tracking-widest not-italic text-2xl md:text-5xl block mt-2`}
                    >
                      {slide.title.split(" ").slice(1).join(" ")}
                    </span>
                  </h2>
                  <h3 className="text-xl md:text-2xl font-bold mb-6 text-zinc-100 uppercase tracking-widest">
                    {slide.subtitle}
                  </h3>
                  <p className="max-w-md text-zinc-300 text-lg mb-10 font-medium leading-relaxed">
                    {slide.desc}
                  </p>
                  <div className="flex gap-4">
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-12 py-5 rounded-2xl w-fit shadow-2xl shadow-emerald-900/40 transition-all active:scale-95 uppercase tracking-widest text-xs">
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Indicators */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
            {slides.map((_, dotIdx) => (
              <div
                key={dotIdx}
                className={`h-2 transition-all duration-500 rounded-full ${dotIdx === currentSlide ? "w-12 bg-emerald-500" : "w-3 bg-white/40"}`}
              />
            ))}
          </div>
        </div>

        {/* Blinkit-style Category Grid */}
        <div className="mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-4 sm:gap-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 hover:border-emerald-500/30 hover:shadow-xl transition-all group active:scale-95"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl group-hover:rotate-12 transition-transform duration-300">
                  {cat.icon}
                </div>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-tight text-zinc-600 dark:text-zinc-400 text-center leading-tight group-hover:text-emerald-600">
                  {cat.name.replace(" & ", "\n& ")}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Deals Section */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                Today's Hot Deals
              </h3>
              <p className="text-zinc-500 font-medium">
                Flash sales on premium produce.
              </p>
            </div>
            <button className="text-emerald-600 font-black text-sm uppercase tracking-widest hover:underline">
              View All →
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="bg-white dark:bg-zinc-900 rounded-3xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800 animate-pulse">
                  <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-2xl mb-4"></div>
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-1/2 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3"></div>
                    <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-1/4"></div>
                  </div>
                  <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl mt-4"></div>
                </div>
              ))
            ) : (
              products.map((product) => {
                const id = product.id || product._id;
                const qty = cart[id] || 0;
                return (
                  <div
                    key={id}
                    className="bg-white dark:bg-zinc-900 rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all border border-zinc-100 dark:border-zinc-800 group"
                  >
                    <div className="aspect-square bg-zinc-50 dark:bg-zinc-800 rounded-2xl mb-4 relative overflow-hidden flex items-center justify-center">
                      <span className="text-5xl opacity-40">🛒</span>
                      {product.mrp > product.discountedPrice && (
                        <span className="absolute top-3 left-3 bg-rose-600 text-white text-[9px] font-black px-2 py-1 rounded-full">
                          {Math.round(
                            ((product.mrp - product.discountedPrice) /
                              product.mrp) *
                              100,
                          )}
                          % OFF
                        </span>
                      )}
                      <button
                        onClick={() => toggleWishlist(id)}
                        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {isInWishlist(id) ? "❤️" : "🤍"}
                      </button>
                    </div>

                    <h4 className="font-bold text-zinc-900 dark:text-white truncate mb-1">
                      {product.name}
                    </h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">
                      {product.category}
                    </p>

                    <div className="flex items-end justify-between gap-2 mb-4">
                      <div>
                        <span className="text-xl font-black text-zinc-900 dark:text-white">
                          ${product.discountedPrice}
                        </span>
                        {product.mrp > product.discountedPrice && (
                          <span className="text-xs text-zinc-400 line-through ml-2 font-medium">
                            ${product.mrp}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-zinc-400">
                        500g
                      </span>
                    </div>

                    {qty === 0 ? (
                      <button
                        onClick={() => updateQuantity(id, 1)}
                        className="w-full py-2.5 rounded-xl border border-emerald-600 text-emerald-600 font-black text-xs uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <div className="flex items-center justify-between bg-emerald-600 rounded-xl p-1 text-white">
                        <button
                          onClick={() => updateQuantity(id, -1)}
                          className="w-8 h-8 flex items-center justify-center font-bold hover:bg-white/10 rounded-lg"
                        >
                          {qty === 1 ? "🗑️" : "−"}
                        </button>
                        <span className="font-black text-sm">{qty}</span>
                        <button
                          onClick={() => updateQuantity(id, 1)}
                          className="w-8 h-8 flex items-center justify-center font-bold hover:bg-white/10 rounded-lg"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Contact Us Section */}
        <section
          id="contact"
          className="mt-20 bg-emerald-900 rounded-[48px] p-8 md:p-20 text-white overflow-hidden relative"
        >
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/20 blur-[100px] rounded-full"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-orange-500/10 blur-[100px] rounded-full"></div>

          <div className="relative grid md:grid-cols-2 gap-20">
            <div>
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-6 uppercase">
                Get in Touch.
              </h2>
              <p className="text-emerald-100 text-lg mb-10 leading-relaxed max-w-sm">
                Have questions about your order or our organic products? Our
                support team is here for you 24/7.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-6 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-xl">
                    📞
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">
                      Customer Support (Direct)
                    </p>
                    <input
                      type="text"
                      value="+91 70141 23456"
                      readOnly
                      className="bg-transparent border-none outline-none font-black text-2xl tracking-tighter w-full cursor-default"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-xl">
                    📍
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-orange-400 mb-1">
                      Our Warehouse
                    </p>
                    <p className="font-bold text-lg">
                      Sector 45, Fresh Market, New Delhi
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[40px] p-10 shadow-2xl text-zinc-900">
              <h3 className="text-2xl font-black mb-8 uppercase tracking-tight">
                Drop us a line
              </h3>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-6 py-4 bg-zinc-50 rounded-2xl border border-zinc-100 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-6 py-4 bg-zinc-50 rounded-2xl border border-zinc-100 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    className="w-full px-6 py-4 bg-zinc-50 rounded-2xl border border-zinc-100 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                    Message
                  </label>
                  <textarea
                    placeholder="Write your thoughts here..."
                    className="w-full px-6 py-4 bg-zinc-50 rounded-2xl border border-zinc-100 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium min-h-[120px]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 shadow-xl shadow-emerald-500/20 transition-all active:scale-95 uppercase tracking-widest text-sm"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 pt-20 pb-10">
        <div className="max-w-[1280px] mx-auto px-8 grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2">
            <Link href="/" className="flex flex-col items-start mb-6">
              <span className="text-3xl italic font-black text-emerald-600 tracking-tighter leading-none">
                FRESHCART.
              </span>
              <span className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                Global Grocery Solutions
              </span>
            </Link>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed mb-8">
              We connect local farmers with your kitchen, delivering quality
              produce, dairy, and meat products with 100% organic certification
              and zero-waste packaging.
            </p>
            <div className="flex gap-4">
              {["Facebook", "Twitter", "Instagram"].map((social) => (
                <div
                  key={social}
                  className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center cursor-pointer hover:bg-emerald-500 hover:text-white transition-all"
                >
                  {social[0]}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-6">
              Navigation
            </h4>
            <ul className="space-y-4 text-zinc-500 dark:text-zinc-400 text-sm font-medium">
              <li className="hover:text-emerald-600 cursor-pointer transition-colors">
                Bulk Orders
              </li>
              <li className="hover:text-emerald-600 cursor-pointer transition-colors">
                Farm Partners
              </li>
              <li className="hover:text-emerald-600 cursor-pointer transition-colors">
                Sustainability
              </li>
              <li className="hover:text-emerald-600 cursor-pointer transition-colors">
                Privacy Policy
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-6">
              Support
            </h4>
            <ul className="space-y-4 text-zinc-500 dark:text-zinc-400 text-sm font-medium">
              <li className="hover:text-emerald-600 cursor-pointer transition-colors">
                <a href="#contact">Get in Touch</a>
              </li>
              <li className="hover:text-emerald-600 cursor-pointer transition-colors">
                Refund Policy
              </li>
              <li className="hover:text-emerald-600 cursor-pointer transition-colors">
                Store Locator
              </li>
              <li className="hover:text-emerald-600 cursor-pointer transition-colors">
                Terms of Service
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] py-10 border-t border-zinc-100 dark:border-zinc-800">
          © 2026 FRESHCART ENTERPRISES. ARCHITECTED BY ANTIGRAVITY.
        </div>
      </footer>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => setIsCartOpen(false)}
          ></div>
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-950 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-emerald-50 dark:bg-emerald-500/5">
              <div>
                <h2 className="text-2xl font-black italic tracking-tighter uppercase">
                  Your Basket
                </h2>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                  {totalItems} Items Selected
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-3xl hover:rotate-90 transition-transform duration-500"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {cartItemsList.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-300">
                  <span className="text-8xl mb-4">🧺</span>
                  <p className="font-black italic uppercase tracking-widest">
                    Basket is Empty
                  </p>
                </div>
              ) : (
                cartItemsList.map((item) => (
                  <div
                    key={item.id || item._id}
                    className="flex gap-6 items-center animate-in fade-in slide-in-from-bottom-4"
                  >
                    <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-2xl">
                      🍎
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-sm uppercase tracking-tight">
                        {item.name}
                      </h4>
                      <p className="text-zinc-500 text-xs font-bold">
                        ${item.discountedPrice} &times; {item.qty}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id || item._id, -1)}
                        className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
                      >
                        {item.qty === 1 ? "🗑️" : "−"}
                      </button>
                      <span className="font-black text-sm w-4 text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id || item._id, 1)}
                        className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {totalItems > 0 && (
              <div className="p-8 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <div className="flex justify-between mb-6">
                  <span className="text-zinc-500 font-bold uppercase text-xs">
                    Total Estimated
                  </span>
                  <span className="text-3xl font-black italic tracking-tighter text-emerald-600">
                    $
                    {cartItemsList
                      .reduce(
                        (acc, item) => acc + item.discountedPrice * item.qty,
                        0,
                      )
                      .toFixed(2)}
                  </span>
                </div>
                <button className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all uppercase tracking-widest text-sm">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal (Minimalized for space) */}
      {isSignInOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xl animate-in fade-in"
            onClick={() => setIsSignInOpen(false)}
          ></div>
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-950 rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300 border border-white/10">
            <button
              onClick={() => setIsSignInOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              {" "}
              &times;{" "}
            </button>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black mb-2 uppercase tracking-tight">
                {authMode === "signin"
                  ? "Welcome Back"
                  : authMode === "signup"
                    ? "Join FreshCart"
                    : "Admin Portal"}
              </h2>
              <p className="text-zinc-500 text-sm font-medium">
                Access your personalized organic grocery experience.
              </p>
            </div>
            <form className="space-y-6" onSubmit={handleAuth}>
              {authMode === "signup" && (
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none"
                  />
                </div>
              )}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all uppercase tracking-widest text-sm"
              >
                {authMode === "signin"
                  ? "Sign In"
                  : authMode === "signup"
                    ? "Create Account"
                    : "Admin Login"}
              </button>
            </form>
            <div className="mt-8 text-center text-sm font-medium text-zinc-500">
              {authMode === "signin" ? (
                <>
                  New to FreshCart?{" "}
                  <button
                    onClick={() => setAuthMode("signup")}
                    className="text-emerald-600 font-bold hover:underline"
                  >
                    Register Now
                  </button>
                </>
              ) : (
                <>
                  Member already?{" "}
                  <button
                    onClick={() => setAuthMode("signin")}
                    className="text-emerald-600 font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </>
              )}
              {authMode !== "admin" && (
                <button
                  onClick={() => setAuthMode("admin")}
                  className="block w-full mt-4 text-xs font-black text-zinc-400 hover:text-emerald-600 uppercase tracking-[0.2em]"
                >
                  Admin Access
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Location Modal Popup Overlay */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[40px] p-10 shadow-2xl border border-zinc-200 dark:border-zinc-800 text-center">
            {locationStatus === "detecting" && (
              <>
                <div className="w-24 h-24 mb-8 mx-auto relative flex items-center justify-center bg-emerald-50 dark:bg-emerald-500/10 rounded-full">
                  <span className="text-4xl animate-bounce">📍</span>
                  <span className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-ping"></span>
                </div>
                <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2 text-zinc-900 dark:text-white">
                  Locating You...
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm mb-8 leading-relaxed">
                  We are detecting your coordinates to check delivery serviceability in your area.
                </p>
                <button
                  onClick={() => setLocationStatus("pending")}
                  className="text-xs font-black text-emerald-600 hover:text-emerald-500 uppercase tracking-widest transition-colors"
                >
                  Enter Pincode Manually
                </button>
              </>
            )}

            {locationStatus === "pending" && (
              <>
                <div className="w-16 h-16 mb-6 mx-auto text-3xl flex items-center justify-center bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-full">
                  🏪
                </div>
                <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2 text-zinc-900 dark:text-white">
                  Delivery Pincode
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium text-xs mb-6">
                  Please enter your pincode manually to verify delivery service.
                </p>
                <form onSubmit={handleLocationSubmit} className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={userPincode}
                    onChange={(e) => setUserPincode(e.target.value)}
                    required
                    placeholder="Enter 6-digit Pincode"
                    className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 focus:ring-4 focus:ring-emerald-500/20 outline-none font-bold text-center tracking-widest text-lg text-zinc-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 uppercase text-xs tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    Verify Delivery Area
                  </button>
                </form>

                {serviceableLocations.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">
                      Active Serviceable Areas
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {serviceableLocations.slice(0, 5).map((pin) => (
                        <button
                          key={pin}
                          onClick={() => {
                            setUserPincode(pin);
                          }}
                          className="px-3.5 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold text-xs rounded-full border border-transparent hover:border-emerald-500/20 transition-all"
                        >
                          📍 {pin}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {locationStatus === "unserviceable" && (
              <>
                <div className="w-24 h-24 mb-6 mx-auto text-5xl flex items-center justify-center bg-orange-100 dark:bg-orange-500/10 text-orange-500 rounded-full animate-bounce">
                  📍
                </div>
                <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2 text-zinc-900 dark:text-white">
                  Coming Soon
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm mb-8 leading-relaxed">
                  We are currently not delivering to <strong>{userPincode}</strong>. We are expanding rapidly and will be in your neighborhood soon!
                </p>
                <button
                  onClick={() => {
                    setLocationStatus("pending");
                    setUserPincode("");
                  }}
                  className="w-full py-4 bg-zinc-900 dark:bg-zinc-800 text-white font-black rounded-2xl hover:bg-zinc-800 uppercase text-xs tracking-widest active:scale-95 transition-all"
                >
                  Try Another Pincode
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Support Widget */}
      <button
        onClick={() => setIsHelpOpen(!isHelpOpen)}
        className="fixed bottom-6 right-6 z-[100] w-16 h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl active:scale-95 hover:scale-105 transition-all duration-350 cursor-pointer"
      >
        {isHelpOpen ? "✕" : "💬"}
      </button>

      {isHelpOpen && (
        <div className="fixed bottom-24 right-6 z-[100] w-full max-w-[420px] bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col max-h-[580px] animate-in slide-in-from-bottom duration-350">
          <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-850">
            <div>
              <h3 className="font-black text-lg tracking-tight uppercase text-zinc-900 dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                FreshCart Support
              </h3>
              <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Customer Care Center</p>
            </div>
            <button
              onClick={() => setIsHelpOpen(false)}
              className="text-zinc-450 hover:text-zinc-600 dark:hover:text-white text-xl font-bold transition-colors"
            >
              &times;
            </button>
          </div>

          {/* Tabs header */}
          <div className="flex bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl my-4 gap-1">
            <button
              onClick={() => setActiveHelpTab("chat")}
              className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                activeHelpTab === "chat"
                  ? "bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              💬 AI Assistant
            </button>
            <button
              onClick={() => {
                setActiveHelpTab("tickets");
                if (helpEmail) {
                  loadUserTickets(helpEmail);
                }
              }}
              className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                activeHelpTab === "tickets"
                  ? "bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              🎫 Support Tickets
            </button>
          </div>

          {/* Tab contents */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {activeHelpTab === "chat" ? (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Chat window */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-4 mb-4 min-h-[220px]">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-emerald-600 text-white rounded-tr-none"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-none border border-zinc-200/20"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-zinc-400 mt-1 px-1 font-bold">{msg.timestamp}</span>
                    </div>
                  ))}
                  {isBotTyping && (
                    <div className="flex items-center gap-1.5 p-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-tl-none w-16 justify-center">
                      <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  )}
                </div>

                {/* Quick actions chips */}
                <div className="flex gap-1.5 overflow-x-auto pb-3 scrollbar-none flex-shrink-0">
                  {[
                    { text: "⏱️ Delivery Speed", q: "How fast is delivery?" },
                    { text: "💸 Refund Policy", q: "Can I get a refund?" },
                    { text: "📍 Service Areas", q: "List serviceable pincodes" },
                    { text: "💳 Payment Modes", q: "What payment options are available?" }
                  ].map((chip) => (
                    <button
                      key={chip.text}
                      onClick={() => {
                        setChatInput(chip.q);
                      }}
                      className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800 hover:border-emerald-500/30 text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-full text-[10px] font-bold whitespace-nowrap transition-all"
                    >
                      {chip.text}
                    </button>
                  ))}
                </div>

                {/* Footer Input */}
                <form onSubmit={handleSendChat} className="flex gap-2 border-t border-zinc-100 dark:border-zinc-850 pt-3 flex-shrink-0">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask Freshy about your delivery, refunds..."
                    className="flex-1 px-4 py-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                  <button
                    type="submit"
                    className="px-4 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-500 text-xs uppercase tracking-widest transition-colors active:scale-95"
                  >
                    Send
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Support Tickets Section */}
                {!helpEmail ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <span className="text-4xl mb-3">📧</span>
                    <h4 className="font-bold text-sm text-zinc-800 dark:text-white mb-2">Track Your Tickets</h4>
                    <p className="text-zinc-500 text-xs text-center mb-6">Enter your email address associated with your orders to review tickets or create new ones.</p>
                    <div className="w-full flex flex-col gap-3">
                      <input
                        type="email"
                        id="ticketEmailInput"
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-center text-xs outline-none focus:ring-2 focus:ring-emerald-500/50"
                      />
                      <button
                        onClick={() => {
                          const inputVal = document.getElementById("ticketEmailInput").value;
                          if (inputVal && inputVal.includes("@")) {
                            setHelpEmail(inputVal);
                            loadUserTickets(inputVal);
                          } else {
                            alert("Please enter a valid email address");
                          }
                        }}
                        className="w-full py-3 bg-emerald-600 text-white font-black text-xs rounded-xl uppercase tracking-widest shadow-md active:scale-98 hover:bg-emerald-500 transition-colors"
                      >
                        Find My Tickets
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex justify-between items-center mb-4 flex-shrink-0 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200/20">
                      <div className="truncate pr-2">
                        <p className="text-[8px] font-black uppercase text-zinc-400">Viewing tickets for</p>
                        <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate">{helpEmail}</p>
                      </div>
                      <button
                        onClick={() => {
                          setHelpEmail("");
                          setTicketList([]);
                        }}
                        className="text-[9px] font-black uppercase text-rose-500 hover:underline"
                      >
                        Change
                      </button>
                    </div>

                    {ticketViewMode === "list" ? (
                      <div className="flex-1 flex flex-col min-h-0">
                        {/* Actions bar */}
                        <div className="flex justify-between items-center mb-3 flex-shrink-0">
                          <span className="text-[10px] font-black uppercase tracking-wider text-zinc-450">
                            Ticket List ({ticketList.length})
                          </span>
                          <button
                            onClick={() => setTicketViewMode("create")}
                            className="px-3 py-1 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors"
                          >
                            + Raise Ticket
                          </button>
                        </div>

                        {/* Tickets scrolling container */}
                        <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[220px]">
                          {isLoadingTickets ? (
                            <div className="h-full flex items-center justify-center text-zinc-400">
                              <span className="animate-spin text-2xl mr-2">⏳</span>
                              <span className="text-xs font-bold uppercase">Loading Tickets...</span>
                            </div>
                          ) : ticketList.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-zinc-300 py-10">
                              <span className="text-5xl mb-2">🎫</span>
                              <p className="font-bold text-xs uppercase tracking-widest text-zinc-400">No Tickets Found</p>
                              <button
                                onClick={() => setTicketViewMode("create")}
                                className="mt-4 text-emerald-600 text-xs font-bold hover:underline"
                              >
                                Create a ticket to get help
                              </button>
                            </div>
                          ) : (
                            ticketList.map((ticket) => (
                              <div
                                key={ticket.id}
                                className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200/20 hover:border-emerald-500/20 transition-all text-left"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-[10px] font-black text-zinc-400">
                                    ID: #{ticket.id.slice(-6)}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                      ticket.status === "Resolved"
                                        ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400"
                                        : "bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400"
                                    }`}
                                  >
                                    {ticket.status}
                                  </span>
                                </div>
                                <h5 className="font-bold text-xs text-zinc-800 dark:text-white mb-1">
                                  [{ticket.category}]
                                </h5>
                                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                                  {ticket.message}
                                </p>
                                <p className="text-[8px] text-zinc-400 font-bold uppercase mt-3">
                                  Raised on {new Date(ticket.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 overflow-y-auto pr-1 text-left min-h-[220px]">
                        <div className="flex justify-between items-center mb-4 flex-shrink-0">
                          <h4 className="font-black text-sm uppercase text-zinc-800 dark:text-white">New Ticket</h4>
                          <button
                            onClick={() => setTicketViewMode("list")}
                            className="text-xs font-bold text-zinc-400 hover:text-zinc-650 dark:hover:text-white"
                          >
                            Cancel
                          </button>
                        </div>
                        <form onSubmit={handleHelpSubmit} className="space-y-4">
                          <div>
                            <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-450 mb-1">Category</label>
                            <select
                              value={helpCategory}
                              onChange={(e) => setHelpCategory(e.target.value)}
                              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-xs font-bold"
                            >
                              <option value="Delivery Issue">Delivery Issue</option>
                              <option value="Payment/Refund">Payment/Refund</option>
                              <option value="Product Quality">Product Quality</option>
                              <option value="General Query">General Query</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-450 mb-1">Problem Description</label>
                            <textarea
                              required
                              rows="3"
                              value={helpMessage}
                              onChange={(e) => setHelpMessage(e.target.value)}
                              placeholder="Tell us what went wrong..."
                              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-xs resize-none"
                            ></textarea>
                          </div>
                          <button
                            type="submit"
                            className="w-full py-4 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-500 uppercase text-xs tracking-widest active:scale-95 transition-all shadow-md"
                          >
                            Submit Ticket
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
