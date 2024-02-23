import React from "react";
import "../../globals.css";


export default function Recovery() {
  return (
    <div className="flex flex-1 flex-col items-center place-content-center w-full h-4/5 bg-gradient-to-r from-start to-end">
      <div className="flex flex-col items-center md:w-2/3 w-11/12 h-fit mb-20 md:px-0 px-6 md:mb-8 border-4 rounded-lg border-secondary bg-gray-50">
        <p className="md:mb-12 mb-16 mt-6 text-center font-display font-bold text-4xl md:text-5xl">Forgot Password?</p>
        <p className="mb-4 text-center font-display md:text-xl text-base font-bold text-gray-700 ">Enter the email connected to your account.</p>
        <input className="md:h-12 h-16 md:w-2/3 w-full px-6 mb-10 md:mt-0 mt-2 rounded-lg border border-[#EAEAEA]" placeholder="example@email.com"></input>
        <div className="flex justify-evenly w-full md:mb-4 mb-8 mb:mt-0 mt-8">
          <button className="text-md h-12 w-1/3 rounded-md bg-secondary bg-opacity-60 text-white focus:outline-none">Back</button>
          <button className="text-md h-12 w-1/3 rounded-md bg-primary text-white focus:outline-none">Submit</button>
        </div>
        <p className="text-center font-display text-lg font-bold text-primary opacity-0">A reminder will be sent shortly.</p>
      </div>
    </div>
  );
}
