"use client";

import { useState } from "react";
import { partySize as partySizes, times } from "../../../../../data";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useAvailabities from "../../../../../hooks/useAvailabities";

type Props = {
  openTime: string;
  closeTime: string;
  slug: string;
};

export default function ReservationCard({ openTime, closeTime, slug }: Props) {
  const { data, loading, error, fetchAvailabities } = useAvailabities();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState<string>(openTime);
  const [partySize, setPartySize] = useState<number>(1);
  const [day, setDay] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const handleChangeDate = (date: Date | null) => {
    if (date) {
      setDay(date.toISOString().split("T")[0]);
      return setSelectedDate(date);
    }
    return setSelectedDate(null);
  };

  const filterTimeByRestaurantOpenWindow = () => {
    const timesWithInWindow: typeof times = [];
    let isWithinWindow = false;
    times.forEach((time) => {
      if (time.time === openTime) isWithinWindow = true;
      if (isWithinWindow) timesWithInWindow.push(time);
      if (time.time === closeTime) isWithinWindow = false;
    });
    return timesWithInWindow;
  };

  const handleClickFindTime = () => {
    fetchAvailabities({
      day,
      partySize,
      time,
      slug,
    });
  };

  return (
    <div className="fixed w-[15%] bg-white rounded p-3 shadow">
      <div className="text-center border-b pb-2 font-bold">
        <h4 className="mr-7 text-lg">Make a Reservation</h4>
      </div>
      <div className="my-3 flex flex-col">
        <label htmlFor="">Party size</label>
        <select
          name=""
          className="py-3 border-b font-light"
          id=""
          value={partySize}
          onChange={(e) => setPartySize(Number(e.target.value))}
        >
          {partySizes.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleChangeDate}
            className="py-3 border-b font-light text-reg w-[100%]"
            dateFormat="MMMM d"
            wrapperClassName="w-[48]"
          />
        </div>
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Time</label>
          <select
            name=""
            id=""
            className="py-3 border-b font-light"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            {filterTimeByRestaurantOpenWindow().map(({ time, displayTime }) => (
              <option key={time} value={time}>
                {displayTime}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <button
          className="bg-red-600 rounded w-full px-4 text-white font-bold h-16"
          onClick={handleClickFindTime}
        >
          Find a Time
        </button>
      </div>
    </div>
  );
}
