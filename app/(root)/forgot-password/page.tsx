"use client";
import React from "react";
import "../../globals.css";
import { validateEmail } from "@/components/shared/validations";


export default function Recovery() {
  const [email, setEmail] = React.useState("");

  const updateEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    validateEmail();
  }

  const validateEmail = () => {
    let validateEmail = false;
    let validateDomain = false;
    const basicEmail = ["@"];
    const basicDomain = [".ca", ".com", ".net", ".org"];
    for (let i = 0; i < email.length; i++) {
      if (basicEmail.includes(email[i])) {
        validateEmail = true;
      }
    }
    for (let i = 0; i < basicDomain.length; i++) {
      if (email.includes(basicDomain[i])) {
        validateDomain = true;
      }
    }
    if (email.length > 5 && validateEmail && validateDomain) {
    }

  }
  return (
    <div className="flex flex-1 flex-col items-center place-content-center w-full h-4/5 bg-gradient-to-r from-start to-end">
      <div className="flex flex-col items-center md:w-2/3 w-11/12 h-fit mb-20 md:px-0 px-6 md:mb-8 border-4 rounded-lg border-secondary bg-gray-50">
        <p className="md:mb-12 mb-16 mt-6 text-center font-display font-bold text-4xl md:text-5xl">Forgot Password?</p>
        <p className="mb-4 text-center font-display md:text-xl text-base font-bold text-tertiary ">Enter the email connected to your account.</p>
        <input onBlur={(e) => updateEmail(e)} className="md:h-12 h-16 md:w-2/3 w-full px-6 mb-10 md:mt-0 mt-2 rounded-lg border border-[#EAEAEA]" placeholder="example@email.com"></input>
        <div className="flex justify-evenly w-full md:mb-4 mb-8 mb:mt-0 mt-8">
          <button className="text-md h-12 w-1/3 rounded-md bg-secondary bg-opacity-60 text-white focus:outline-none hover:opacity-80 transition-all duration-300">Back</button>
          <button className="text-md h-12 w-1/3 rounded-md focus:outline-none border-primary transition-all duration-300 block px-4 bg-primary text-white hover:opacity-80 !bg-[#E5E5E5] text-[#BDBDBD] cursor-not-allowed">Submit</button>
        </div>
        <p className="text-center font-display text-lg font-bold text-primary opacity-0">A reminder will be sent shortly.</p>
      </div>
    </div>
  );
}
