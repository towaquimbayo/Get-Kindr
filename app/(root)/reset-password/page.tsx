"use client";
import React, { useState } from "react";
import "../../globals.css";
import Link from "next/link";
// Lock to prevent multiple submissions.
let lock = false;

export default function Recovery() {
  // Set states for the password success / failure icons and their colors
  const [passIcon, setPassIcon] = useState<string>('M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z');
  const [passColor, setPassColor] = useState<string>('gray');
  const [repPassIcon, setRepPassIcon] = useState<string>('M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z');
  const [repPassColor, setRepPassColor] = useState<string>('gray');

  // Set state for the password.
  const [password, setPassword] = useState<string>('');

  // Check if the base password is valid.
  const checkPassword = (password: string) => {
    // Check if the password has a capital letter.
    let capital = false;
    if (password.toLowerCase() !== password) {
      capital = true;
    }
    // Set the number and symbol to false and define numbers and letters.
    let number = false;
    let symbol = false;
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    const letters = /^[A-Za-z0-9]+$/;
    // Check password for numbers and symbols by iterating through the characters.
    for (let i = 0; i < password.length; i++) {
      // If the character is a number, set number to true.
      if (numbers.includes(password[i])) {
        number = true;
      }
      // If the character is not a letter or number, set symbol to true.
      if (!password[i].match(letters) && !numbers.includes(password[i])) {
        symbol = true;
      }
    }
    // If the password has a capital letter, number, symbol, and is at least 8 characters long, return true.
    if (capital && number && symbol && password.length >= 8) {
      return true;
    } else {
      // Otherwise, return false
      return false;
    }
  }

  // Check the password to update if the password is valid.
  const checkUpdatePassword = (password: string) => {
    document.getElementById('validPassIcon')?.classList.remove('opacity-40');
    // Get password validity.
    let goodPass = checkPassword(password);
    // If the password is valid, set the icon to a checkmark and change its color to green.
    if (goodPass) {
      setPassIcon('M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z');
      setPassColor('green');
    } else {
      // Otherwise, set the icon to an x and change its color to red.
      setPassIcon('m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z');
      setPassColor('red');
    }
    if (password.length != 0) {
      checkRepPassword((document.getElementById('repPassword') as HTMLInputElement)?.value);
    }
  }

  // Check the repeated password to update if the password is valid.
  const checkRepPassword = (repPassword: string) => {
    document.getElementById('validRepPassIcon')?.classList.remove('opacity-40');
    // If the repeated password is the same as the password, set the icon to a checkmark and change its color to green.
    if (password === repPassword) {
      setRepPassIcon('M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z');
      setRepPassColor('green');
      // If the repeated password is the same as the password and the password is valid.
      if (checkPassword(password)) {
        // Set the submit button to be enabled
        const submitButton = document.getElementById('submit');
        if (submitButton) {
          submitButton.classList.remove('!bg-[#E5E5E5]');
          submitButton.classList.remove('cursor-not-allowed');
        }
      }
    } else {
      // Otherwise, set the icon to an x and change its color to red.
      setRepPassIcon('m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z');
      setRepPassColor('red');
    }
  }

  // Set the view password icon and color to the blocked icon and color.
  const [viewPassIcon, setViewPassIcon] = useState<string>('M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z');
  const [viewPassColor, setViewPassColor] = useState<string>('grey');
  // Set the password to be hidden.
  const [showPassType, setShowPassType] = useState<string>('password');

  // Update the view password icon and color.
  const updatePassView = () => {
    // Define the blocked and unblocked icons.
    const blocked = "M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
    const unblocked = "M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
    // If the view password icon is unblocked, set it to blocked and change the color to grey.
    if (viewPassIcon == unblocked) {
      setViewPassIcon(blocked)
      setViewPassColor('grey');
      // Update the password to be hidden.
      setShowPassType('password');
    } else {
      // Otherwise, set the view password icon to unblocked and change the color to black.
      setViewPassIcon(unblocked)
      setViewPassColor('black');
      // Set the password to be shown.
      setShowPassType('text');
    }
  }

  // Set the view repeated password icon and color to the blocked icon and color.
  const [viewRepPassIcon, setRepViewPassIcon] = useState<string>('M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z');
  const [viewRepPassColor, setRepViewPassColor] = useState<string>('grey');
  // Set the repeated password to be hidden.
  const [showRepPassType, setRepShowPassType] = useState<string>('password');

  // Update the view repeated password icon and color.
  const updateRepPassView = () => {
    // Define the blocked and unblocked icons.  
    const blocked = "M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
    const unblocked = "M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
    // If the view repeated password icon is unblocked, set it to blocked and change the color to grey.
    if (viewRepPassIcon == unblocked) {
      setRepViewPassIcon(blocked)
      setRepViewPassColor('grey');
      // Update the repeated password to be hidden.
      setRepShowPassType('password');
    } else {
      // Otherwise, set the view repeated password icon to unblocked and change the color to black.
      setRepViewPassIcon(unblocked)
      setRepViewPassColor('black');
      // Set the repeated password to be shown.
      setRepShowPassType('text');
    }
  }

  const lockAndReset = () => {
    // Set submit button to disabled.
    const submitButton = document.getElementById('submit') as HTMLInputElement;
    submitButton.disabled = true;
    // If the lock is true, return.
    if (lock) {
      return;
    }
    // Otherwise set the lock to true, send an email, and set a timeout to unlock the button.
    lock = true;
    resetPassword();
    setTimeout(() => {
      lock = false;
      submitButton.disabled = false;
    }, 3000);
  }

  // Set the One Time Password state.
  const [OTP, setOTP] = useState<string>('password');

  // Function to reset the password.
  const resetPassword = async () => {
    // Get the password and repeated password.
    const pass = (document.getElementById('password') as HTMLInputElement)?.value;
    const repPass = (document.getElementById('repPassword') as HTMLInputElement)?.value;
    // Set the response text.
    let responseText = "Verifying One Time Passcode..."
    // Check if the passwords are the same and if the password is valid.
    if (pass == repPass) {
      if (checkPassword(pass)) {
        // Get the response text for creating the One Time Password.
        const response = document.getElementById('response');

        // If the response exists, update its view.
        if (response) {
          // Remove the class options hiding the response.
          response.classList.remove('opacity-0');
          response.classList.remove('h-0');
          response.classList.remove('mt-0');
          response.classList.remove('mb-0');
          // Set the response to the correct color.
          response.classList.add('text-secondary');
          response.classList.remove('text-primary');
          response.classList.remove('text-tertiary');
          response.classList.remove('brightness-90');
          // Set the response text.
          response.innerHTML = responseText;
        }

        // Fetch the One Time Password to verify.
        const res = await fetch('/api/one-time-pass/verify/?otp=' + OTP, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.ok && res.status == 200) {
          // Wait for the response data.
          let data = await res.json();
          if (data.success) {
            // If the response is valid and the One Time Password is correct, delete the One Time Password.
            await fetch('/api/one-time-pass/delete', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ OneTimePass: OTP }),
            });

            // Update the users password to their new password.
            const update = await fetch('/api/one-time-pass/update-pass', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: data.email, password: pass }),
            });
            // Wait for the response data.
            let updateData = await update.json();
            // If the update was successful check its result.
            if (update.ok) {
              if (updateData.success) {
                // If a response exists and was successful, update the response color and text.
                if (response) {
                  response.innerHTML = updateData.result;
                  response.classList.remove('text-secondary');
                  response.classList.add('text-tertiary');
                  response.classList.add('brightness-90');
                }
              } else {
                // If a response exists and was not successful, update the response color and text.
                if (response) {
                  response.innerHTML = updateData.result;
                  response.classList.remove('text-secondary');
                  response.classList.add('text-primary');
                }
              }
            } else {
              // If a response exists and the update was not successful, update the response color and text.
              if (response) {
                response.innerHTML = "Error updating password.";
                response.classList.remove('text-secondary');
                response.classList.add('text-primary');
              }
            }
          }
        } else {
          // If the one time password was invalid, update the response color and text.
          if (response) {
            response.innerHTML = "Invalid One Time Passcode.";
            response.classList.remove('text-secondary');
            response.classList.add('text-primary');
          }
        }
      }
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center place-content-center bg-gradient-to-r from-start to-end w-full h-4/5">
      <div className="flex flex-col items-center border-4 rounded-lg border-secondary bg-gray-50 w-11/12 h-fit md:w-2/3 mt-24 mb-20 md:mb-8 px-6 md:px-0">
        <p className="text-center font-display font-bold text-secondary text-4xl md:text-5xl mb-16 mt-6 md:mb-12">Password Reset?</p>
        <p className="font-display text-xl sm:text-2xl font-bold text-secondary opacity-80 md:w-2/3 md:min-w-96 w-full mb-4 pl-4 mb:pl-8 sm:pl-12 sm:pl-10 md:pl-4">Enter your <span className="mb:hidden"><br></br></span> One Time Passcode.</p>
        <div id="otpContainer" className=" flex md:w-3/4 w-full mb:px-4 sm:px-8 mb-8 md:px-0">
          <input id="otpInput" className="rounded-lg border border-[#EAEAEA] w-full h-16 md:h-12 mt-2 md:mt-0 px-6" onChange={(e) => setOTP(e.target.value)} placeholder=""></input>
        </div>
        <p className="font-display font-bold text-secondary opacity-80 text-xl sm:text-2xl md:w-2/3 md:min-w-96 w-full mb-4 pl-4 mb:pl-8 sm:pl-12 sm:pl-10 md:pl-4">Enter your new password.</p>
        <div id="passwordContainer" className="flex w-full md:w-3/4 mb:pl-4 sm:pl-6 md:pl-0">
          <input id="password" className=" rounded-lg border border-[#EAEAEA] w-full h-16 md:h-12 md:mt-0 mt-2 px-6" type={showPassType} onBlur={(e) => checkUpdatePassword(e.target.value)} onChange={(e) => setPassword(e.target.value)} placeholder=""></input>
          <svg id="validPassIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke={passColor} className="w-20 h-20 md:w-12 md:h-12 ml-4 opacity-40">
            <path strokeLinecap="round" strokeLinejoin="round" d={passIcon} />
          </svg>
        </div>
        <svg id="showPassIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke={viewPassColor} onClick={updatePassView} className="ml-4 md:w-6 md:h-6 w-10 h-10 mt-5 md:mt-3 relative inset-x-1/4 mr-20 mb:mr-12 sm:mr-0 md:mr-12 lg:ml-12 2xl:ml-20 bottom-20 md:bottom-12">
          <path strokeLinecap="round" strokeLinejoin="round" d={viewPassIcon} />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
        <p className="font-display font-bold  text-secondary opacity-80 text-xl sm:text-2xl md:w-2/3 md:min-w-96 w-full mb-4 pl-4 mb:pl-8 sm:pl-12 sm:pl-10 md:pl-4">Repeat your new password.</p>
        <div id="repPasswordContainer" className="flex w-full md:w-3/4 mb:pl-4 sm:pl-6 md:pl-0">
          <input id="repPassword" className="rounded-lg border border-[#EAEAEA] w-full h-16 md:h-12 md:mt-0 mt-2 px-6" type={showRepPassType} onChange={(e) => checkRepPassword(e.target.value)} placeholder=""></input>
          <svg id="validRepPassIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke={repPassColor} className="w-20 h-20 md:w-12 md:h-12 ml-4 opacity-40">
            <path strokeLinecap="round" strokeLinejoin="round" d={repPassIcon} />
          </svg>
        </div>
        <svg id="showRepPassIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke={viewRepPassColor} onClick={updateRepPassView} className="ml-4 md:w-6 md:h-6 w-10 h-10 mt-5 md:mt-3 relative inset-x-1/4 mr-20 mb:mr-12 sm:mr-0 md:mr-12 lg:ml-12 2xl:ml-20 bottom-20 md:bottom-12">
          <path strokeLinecap="round" strokeLinejoin="round" d={viewRepPassIcon} />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
        <p id="passwordReminder" className="flex items-center justify-center antialiased opacity-40 font-sans text-lg font-bold leading-normal text-tertiary brightness-90 w-full sm:w-11/12 gap-1 mt-4 mb-10 ml-4 mb:mr-0">
          <svg id="reminderIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="min-w-10 max-w-10 min-h-10 max-h-10 -mt-px mr-2">
            <path fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
              clipRule="evenodd"></path>
          </svg>
          <span className="max-w-64 mb:px-2 sm:max-w-100 sm:px-0 sm:text-center md:max-w-64 md:px-2 md:text-left lg:max-w-100 lg:pr-0 lg:pl-2 lg:text-center">Use at least 8 characters, one uppercase character, and one number or symbol.</span>
        </p>
        <div id="buttonsContainer" className="flex justify-evenly w-full md:mb-4 mb-8 mb:mt-0 mt-8">
          <Link href="/" className="w-1/3"><button className="rounded-md bg-secondary bg-opacity-60 text-md text-white focus:outline-none hover:opacity-80 transition-all duration-300 w-full h-12">Cancel</button></Link>
          <button id="submit" className="block rounded-md focus:outline-none bg-primary !bg-[#E5E5E5] border-primary transition-all duration-300 text-md text-white text-[#BDBDBD] hover:opacity-80 cursor-not-allowed h-12 w-1/3 px-4" onClick={lockAndReset}>Reset</button>
        </div>
        <p id="response" className="text-center font-display font-bold text-2xl mt-6 mb-6 opacity-0 h-0 mb-0 mt-0">Password Reset.</p>
      </div>
    </div>
  );
}
