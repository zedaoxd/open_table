import React from "react";
import Navbar from "../../components/Navbar";
import Description from "./components/Description";
import Header from "./components/Header";
import Images from "./components/Images";
import MyRating from "./components/MyRating";
import ReservationCard from "./components/ReservationCard";
import RestaurantNavbar from "./components/RestaurantNavbar";
import Reviews from "./components/Reviews";
import Title from "./components/Title";

export default function RestaurantDetails() {
  return (
    <main className="bg-gray-100 min-h-screen">
      <main className="max-w-screen-2xl m-auto bg-white">
        <Navbar />
        <Header />
        <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">
          <div className="bg-white text-black w-[70%] rounded p-3 shadow">
            <RestaurantNavbar />
            <Title />
            <MyRating />
            <Description />
            <Images />
            <Reviews />
          </div>
          <div className="w-[27%] relative text-reg">
            <ReservationCard />
          </div>
        </div>
      </main>
    </main>
  );
}
