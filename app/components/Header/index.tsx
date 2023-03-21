"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [location, setLocation] = useState("");

  function onClickLetsGo() {
    if (!location) return;
    router.push(`/search`);
  }

  return (
    <div className="h-64 bg-gradient-to-r from-[#0f1f47] to-[#5f6984] p-2">
      <div className="text-center mt-10">
        <h1 className="text-white text-5xl font-bold mb-2">
          Find your table for any occasion
        </h1>
        {/* SEARCH BAR */}
        <div className="text-left text-lg py-3 m-auto flex justify-center">
          <input
            className="rounded  mr-3 p-2 w-[450px]"
            type="text"
            placeholder="State, city or town"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button
            className="rounded bg-red-600 px-9 py-2 text-white"
            onClick={onClickLetsGo}
          >
            Let's go
          </button>
        </div>
        {/* SEARCH BAR */}
      </div>
    </div>
  );
}
