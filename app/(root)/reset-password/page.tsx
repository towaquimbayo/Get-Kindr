"use client";
import React, { useState } from "react";
import "../../globals.css";
import Link from "next/link";

export default function Recovery() {
  const [passIcon, setPassIcon] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passColor, setPassColor] = useState<string>('red');
  const [repPassIcon, setRepPassIcon] = useState<string>('');
  const [repPassColor, setRepPassColor] = useState<string>('red');

  const checkPassword = (password: string) => {
    let capital = false;
    if (password.toLowerCase() !== password) {
      capital = true;
    }
    let number = false;
    let symbol = false;
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    const letters = /^[A-Za-z0-9]+$/;
    for (let i = 0; i < password.length; i++) {
      if (numbers.includes(password[i])) {
        number = true;
      }
      if (!password[i].match(letters)) {
        symbol = true;
      }
    }
    if (capital && (number || symbol) && password.length >= 8) {
      return true;
    } else {
      return false;
    }
  }


  const checkUpdatePassword = (password: string) => {
    let goodPass = checkPassword(password);
    if (goodPass) {
      setPassIcon('M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z');
      setPassColor('green');
    } else {
      setPassIcon('m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z');
      setPassColor('red');
    }
  }

  const checkRepPassword = (repPassword: string) => {
    if (password === repPassword) {
      setRepPassIcon('M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z');
      setRepPassColor('green');
      if (checkPassword(password)) {
        // set the submit button to be enabled
        const submitButton = document.getElementById('submit');
        if (submitButton) {
          submitButton.classList.remove('!bg-[#E5E5E5]');
          submitButton.classList.remove('cursor-not-allowed');
        }
      }
    } else {
      setRepPassIcon('m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z');
      setRepPassColor('red');
    }
  }

  const [viewPassIcon, setViewPassIcon] = useState<string>('M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z');
  const [viewPassColor, setViewPassColor] = useState<string>('black');
  const [showPassType, setShowPassType] = useState<string>('password');

  const updatePassView = () => {
    const blocked = "M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
    const unblocked = "M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
    if (viewPassIcon == unblocked) {
      setViewPassIcon(blocked)
      setViewPassColor('grey');
      setShowPassType('password');
    } else {
      setViewPassIcon(unblocked)
      setViewPassColor('black');
      setShowPassType('text');
    }
  }

  const [viewRepPassIcon, setRepViewPassIcon] = useState<string>('M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z');
  const [viewRepPassColor, setRepViewPassColor] = useState<string>('black');
  const [showRepPassType, setRepShowPassType] = useState<string>('password');

  const updateRepPassView = () => {
    const blocked = "M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
    const unblocked = "M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
    if (viewRepPassIcon == unblocked) {
      setRepViewPassIcon(blocked)
      setRepViewPassColor('grey');
      setRepShowPassType('password');
    } else {
      setRepViewPassIcon(unblocked)
      setRepViewPassColor('black');
      setRepShowPassType('text');
    }
  }

  const [OTP, setOTP] = useState<string>('password');
  const resetPassword = async () => {
    const pass = document.getElementsByTagName('input')[0].value;
    const repPass = document.getElementsByTagName('input')[1].value;
    let responseText = "Verifying One Time Passcode..."
    if (pass == repPass) {
      if (checkPassword(pass)) {
        const response = document.getElementById('response');
        if (response) {
          response.classList.remove('opacity-0');
          response.classList.remove('h-0');
          response.classList.remove('mt-0');
          response.classList.remove('mb-0');
          response.innerHTML = responseText;
        }
        const res = await fetch('/api/one-time-pass/verify/?otp=' + OTP, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) {
          if (response) {
            const del = await fetch('/api/one-time-pass/delete', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ otp: OTP }),
            });
            response.innerHTML = "Password Reset.";
            response.classList.add('text-tertiary');
          }
        } else {
          if (response) {
            response.innerHTML = "Invalid One Time Passcode.";
            response.classList.add('text-primary');
          }
        }
      }
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center place-content-center w-full h-4/5 bg-gradient-to-r from-start to-end">
      <div className="flex flex-col items-center md:w-2/3 w-11/12 h-fit mb-20 md:px-0 px-6 md:mb-8 border-4 rounded-lg border-secondary bg-gray-50 mt-24">
        <p className="md:mb-12 mb-16 mt-6 text-center font-display font-bold text-4xl md:text-5xl">Password Reset?</p>
        <p className="mb-4 pl-4 sm:pl-10 font-display text-xl sm:text-2xl font-bold  text-secondary md:w-2/3 w-full ">Enter your One Time Passcode.</p>
        <div className="md:w-2/3 w-full flex mb-8 md:pr-14 pr-20">
          <input className="md:h-12 h-16 px-6 md:mt-0 mt-2 rounded-lg border border-[#EAEAEA] w-full" onChange={(e) => setOTP(e.target.value)} placeholder=""></input>
        </div>
        <p className="mb-4 pl-4 sm:pl-10 font-display text-xl sm:text-2xl font-bold text-secondary md:w-2/3 w-full ">Enter your new password.</p>
        <div className="md:w-2/3 w-full flex">
          <input className="md:h-12 h-16 px-6 md:mt-0 mt-2 rounded-lg border border-[#EAEAEA] w-full" type={showPassType} onBlur={(e) => checkUpdatePassword(e.target.value)} onChange={(e) => setPassword(e.target.value)} placeholder=""></input>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke={passColor} className="ml-4 md:w-12 md:h-12 w-20 h-20">
            <path stroke-linecap="round" stroke-linejoin="round" d={passIcon} />
          </svg>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke={viewPassColor} onClick={updatePassView} className="ml-4 md:w-6 md:h-6 w-10 h-10 mt-5 md:mt-3 relative inset-x-1/4 mr-16 mb:mr-8 sm:mr-0 md:mr-20 lg:mr-16 2xl:mr-8 bottom-20 md:bottom-12">
          <path stroke-linecap="round" stroke-linejoin="round" d={viewPassIcon} />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
        <p className="mb-4 pl-4 sm:pl-10 font-display text-xl sm:text-2xl font-bold  text-secondary md:w-2/3 w-full ">Repeat your new password.</p>
        <div className="md:w-2/3 w-full flex">
          <input className="md:h-12 h-16 px-6 md:mt-0 mt-2 rounded-lg border border-[#EAEAEA] w-full" type={showRepPassType} onChange={(e) => checkRepPassword(e.target.value)} placeholder=""></input>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke={repPassColor} className="ml-4 md:w-12 md:h-12 w-20 h-20">
            <path stroke-linecap="round" stroke-linejoin="round" d={repPassIcon} />
          </svg>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke={viewRepPassColor} onClick={updateRepPassView} className="ml-4 md:w-6 md:h-6 w-10 h-10 mt-5 md:mt-3 relative inset-x-1/4 mr-16 mb:mr-8 sm:mr-0 md:mr-20 lg:mr-16 2xl:mr-8 bottom-20 md:bottom-12">
          <path stroke-linecap="round" stroke-linejoin="round" d={viewRepPassIcon} />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
        <p className="flex items-center justify-center w-4/5 gap-1 mt-4 font-sans text-lg antialiased font-bold leading-normal text-tertiary opacity-60 mb-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="min-w-10 max-w-10 min-h-10 max-h-10 -mt-px mr-2">
            <path fill-rule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
              clip-rule="evenodd"></path>
          </svg>
          Use at least 8 characters, one uppercase, and one number or symbol.
        </p>
        <div className="flex justify-evenly w-full md:mb-4 mb-8 mb:mt-0 mt-8">
          <Link href="/" className="w-1/3"><button className="w-full text-md h-12 rounded-md bg-secondary bg-opacity-60 text-white focus:outline-none hover:opacity-80 transition-all duration-300">Cancel</button></Link>
          <button id="submit" className="text-md h-12 w-1/3 text-md h-12 w-1/3 rounded-md focus:outline-none border-primary transition-all duration-300 block px-4 bg-primary text-white hover:opacity-80 !bg-[#E5E5E5] text-[#BDBDBD] cursor-not-allowed" onClick={resetPassword}>Reset</button>
        </div>
        <p id="response" className="text-center font-display text-2xl font-bold text-secondary mt-6 mb-6 opacity-0 h-0 mb-0 mt-0">Password Reset.</p>
      </div>
    </div>
  );
}
