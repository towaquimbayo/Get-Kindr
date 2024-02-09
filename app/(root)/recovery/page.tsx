import React from "react";
import "../../globals.css";
import Image from "next/image";

export default function Recovery() {
  return (
    <div className="w-full h-full flex justify-center">
      <div className="z-10 w-2/3 h-fit flex-none border-4 rounded-lg border-secondary flex flex-col items-center bg-white">
        <p className="text-center font-display font-bold text-4xl md:text-5xl mb-12 mt-6">Forgot Password?</p>
        <p className="text-center font-display text-xl font-bold text-gray-700 mb-4">Enter the email connected to your account.</p>
        <input className="h-12 w-2/3 rounded-lg border border-[#EAEAEA] px-4 mb-10" placeholder="example@email.com"></input>
        <div className="w-full flex justify-evenly mb-4">
          <button className="text-md h-12 w-1/3 rounded-md bg-secondary bg-opacity-60 text-white focus:outline-none">Back</button>
          <button className="text-md h-12 w-1/3 rounded-md bg-primary text-white focus:outline-none">Recover</button>
        </div>
        <p className="text-center font-display text-lg font-bold text-primary opacity-0">A reminder will be sent shortly.</p>
      </div>
      <img src="public\auth-support-image.jpg" alt="temp" className="absolute h-10 z-0" />
      <Image
        src="/auth-support-image.jpg"
        alt="2 females hug each other in support of each other."
        style={{ objectFit: "fill", objectPosition: "center", paddingTop: "72px", opacity: "0.5" }}
        fill
      />
    </div>
  );
}
