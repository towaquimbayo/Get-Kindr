import React from "react";
import "../../globals.css";
import Image from "next/image";

export default function Recovery() {
  return (
    <div className="w-full h-full flex justify-center bg-gradient-to-r from-cyan-500 to-blue-500">
      <div className="  mt-0 w-2/3 h-fit border-4 rounded-lg border-secondary flex flex-col items-center">
        <p className="text-center font-display font-bold text-4xl md:text-5xl mb-12 mt-6">Forgot Password?</p>
        <p className="text-center font-display text-xl font-bold text-gray-700 mb-4">Enter the email connected to your account.</p>
        <input className="h-12 w-2/3 rounded-lg border border-[#EAEAEA] px-4 mb-10" placeholder="example@email.com"></input>
        <div className="w-full flex justify-evenly mb-4">
          <button className="text-md h-12 w-1/3 rounded-md bg-secondary bg-opacity-60 text-white focus:outline-none">Back</button>
          <button className="text-md h-12 w-1/3 rounded-md bg-primary text-white focus:outline-none">Submit</button>
        </div>
        <p className="text-center font-display text-lg font-bold text-primary opacity-0">A reminder will be sent shortly.</p>
      </div>
    </div>
  );
}
