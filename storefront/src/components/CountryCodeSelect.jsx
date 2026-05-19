"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

export const countryCodes = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  // Add more as needed
];

export default function CountryCodeSelect({ selectedCode, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const selected =
    countryCodes.find((c) => c.code === selectedCode) || countryCodes[0];

  const filteredCodes = countryCodes.filter(
    (c) =>
      c.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.includes(searchTerm),
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-3 bg-white/5 border border-white/10 rounded-l-xl hover:bg-white/10 transition-colors h-[50px] min-w-[100px]"
      >
        <span className="text-xl">{selected.flag}</span>
        <span className="text-white font-medium">{selected.code}</span>
        <ChevronDown size={16} className="text-white/70" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[280px] bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-2 border-b border-white/10 flex items-center gap-2">
            <Search size={16} className="text-white/50" />
            <input
              type="text"
              placeholder="Search country or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-white text-sm focus:outline-none w-full placeholder:text-white/30"
              autoFocus
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-1">
            {filteredCodes.map((c) => (
              <button
                key={c.code + c.country}
                type="button"
                onClick={() => {
                  onChange(c.code);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
                className="flex items-center gap-3 w-full px-3 py-2 hover:bg-white/10 rounded-lg transition-colors text-left"
              >
                <span className="text-xl">{c.flag}</span>
                <span className="text-white flex-1">{c.country}</span>
                <span className="text-white/50 text-sm">{c.code}</span>
              </button>
            ))}
            {filteredCodes.length === 0 && (
              <div className="p-3 text-center text-white/50 text-sm">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
