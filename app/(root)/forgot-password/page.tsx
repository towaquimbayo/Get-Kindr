"use client";
import React from "react";
import "../../globals.css";
import Link from "next/link";
import recover from "../recover-password/page";

export default function Recovery() {
  const [email, setEmail] = React.useState("");

  const updateEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    updateButton(e.target.value);
  }

  const updateButton = (newEmail: string) => {
    const submitButton = document.getElementById('submit');
    if (submitButton && validateEmail(newEmail)) {
      submitButton.classList.remove('!bg-[#E5E5E5]');
      submitButton.classList.remove('cursor-not-allowed');
    } else if (submitButton) {
      submitButton.classList.add('!bg-[#E5E5E5]');
      submitButton.classList.add('cursor-not-allowed');
    }
  }

  const validateEmail = (newEmail: string) => {
    let validateEmail = false;
    let validateDomain = false;
    const basicEmail = ["@"];
    const basicDomain = [".ca", ".com", ".net", ".org"];
    for (let i = 0; i < newEmail.length; i++) {
      if (basicEmail.includes(newEmail[i])) {
        validateEmail = true;
      }
    }
    for (let i = 0; i < basicDomain.length; i++) {
      if (newEmail.includes(basicDomain[i])) {
        validateDomain = true;
      }
    }
    if (newEmail.length > 5 && validateEmail && validateDomain) {
      return true;
    }
    return false;
  }

  const submitEmail = async () => {
    if (!validateEmail(email)) {
      return;
    }

    const responseElement = document.getElementById('response');
    if (responseElement) {
      responseElement.innerHTML = "Checking for a matching email...";
      responseElement.classList.add('text-secondary');
      const res = await fetch('/api/emails/?email=' + email, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const result = await recover(email);
        if (result) {
          responseElement.innerHTML = "An email has been sent to your account.";
          responseElement.classList.add('text-tertiary');
        }
      } else {
        responseElement.innerHTML = "No account with that email found. Please try again.";
        responseElement.classList.add('text-primary');;
      }
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center place-content-center w-full h-4/5 bg-gradient-to-r from-start to-end">
      <div className="flex flex-col items-center md:w-2/3 w-11/12 h-fit mb-20 md:px-0 px-6 md:mb-8 border-4 rounded-lg border-secondary bg-gray-50">
        <p className="md:mb-12 mb-16 mt-6 text-center font-display font-bold text-4xl md:text-5xl">Forgot Password?</p>
        <p className="mb-4 text-center font-display md:text-xl text-base font-bold text-secondary ">Enter the email connected to your account.</p>
        <input onChange={(e) => updateEmail(e)} className="md:h-12 h-16 md:w-2/3 w-full px-6 mb-10 md:mt-0 mt-2 rounded-lg border border-[#EAEAEA]" placeholder="example@email.com"></input>
        <div className="flex justify-evenly w-full mb-8 mb:mt-0 mt-8">
          <Link href="/" className="w-1/3 "><button className="text-md h-12 w-full rounded-md bg-secondary bg-opacity-60 text-white focus:outline-none font-semibold hover:opacity-80 transition-all duration-300">Cancel</button></Link>
          <button onClick={submitEmail} id="submit" className="text-md h-12 w-1/3 rounded-md focus:outline-none border-primary transition-all duration-300 block px-4 bg-primary text-white hover:opacity-80 !bg-[#E5E5E5] text-[#BDBDBD] cursor-not-allowed">Submit</button>
        </div>
        <p id="response" className="text-center w-4/5 font-display text-2xl font-bold opacity-100 mt-4 mb-6"></p>
      </div>
    </div>
  );
}
