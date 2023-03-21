import Link from "next/link";
import React from "react";

export default function RestaurantNavbar() {
  return (
    <nav className="flex text-reg border-b pb-2">
      <Link href="/restaurant/kkk" className="mr-7">
        Overview
      </Link>
      <Link href="/restaurant/kkk/menu" className="mr-7">
        Menu
      </Link>
    </nav>
  );
}
