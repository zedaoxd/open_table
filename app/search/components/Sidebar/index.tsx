import { Cuisine, Location } from "@prisma/client";
import React from "react";

interface ISidebarProps {
  locations: Location[];
  cuisines: Cuisine[];
}

export default function Sidebar({ locations, cuisines }: ISidebarProps) {
  return (
    <div className="w-1/5">
      <div className="border-b pb-4">
        <h1 className="mb-2">Region</h1>
        {locations.map((loc) => (
          <p
            key={loc.id}
            className="font-light text-reg capitalize cursor-pointer"
          >
            {loc.name}
          </p>
        ))}
        {/* <p className="font-light text-reg">Toronto</p>
        <p className="font-light text-reg">Ottawa</p>
        <p className="font-light text-reg">Montreal</p>
        <p className="font-light text-reg">Hamilton</p>
        <p className="font-light text-reg">Kingston</p>
        <p className="font-light text-reg">Niagara</p> */}
      </div>
      <div className="border-b pb-4 mt-3">
        <h1 className="mb-2">Cuisine</h1>
        {cuisines.map((c) => (
          <p
            key={c.id}
            className="font-light text-reg capitalize cursor-pointer"
          >
            {c.name}
          </p>
        ))}
        {/* <p className="font-light text-reg">Mexican</p>
        <p className="font-light text-reg">Italian</p>
        <p className="font-light text-reg">Chinese</p> */}
      </div>
      <div className="mt-3 pb-4">
        <h1 className="mb-2">Price</h1>
        <div className="flex">
          <button className="border w-full text-reg font-light rounded-l p-2">
            $
          </button>
          <button className="border-r border-t border-b w-full text-reg font-light p-2">
            $$
          </button>
          <button className="border-r border-t border-b w-full text-reg font-light p-2 rounded-r">
            $$$
          </button>
        </div>
      </div>
    </div>
  );
}
