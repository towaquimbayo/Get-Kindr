"use client";
import React from "react";
import "../../globals.css";
import Link from "next/link";
import recover from "../recover-password/page";

export default function Recovery() {

  // Define the email state and set the initial value to an empty string/
  const [email, setEmail] = React.useState("");

  // Define handler to update email and check if the email is valid.
  const updateEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    updateButton(e.target.value);
  }

  // Define function to update the submit button based on the email.
  const updateButton = (newEmail: string) => {
    // Get the submit button and check if the email is valid.
    const submitButton = document.getElementById('submit');
    if (submitButton && validateEmail(newEmail)) {
      // If the email is valid, remove the disabled class from the submit button and update the color.
      submitButton.classList.remove('!bg-[#E5E5E5]');
      submitButton.classList.remove('cursor-not-allowed');
    } else if (submitButton) {
      // If the email is not valid, add the disabled class to the submit button, and reset the color.
      submitButton.classList.add('!bg-[#E5E5E5]');
      submitButton.classList.add('cursor-not-allowed');
    }
  }

  // Define a function to validate the email.
  const validateEmail = (newEmail: string) => {
    // Start by assuming the email and domain are invalid.
    let validateEmail = false;
    let validateDomain = false;
    // Define the basic email and domain formats.
    const basicEmail = ["@"];
    const basicDomain = [".ca", ".com", ".net", ".org"];
    // Check if the email contains the basic email by checking each char.
    for (let i = 0; i < newEmail.length; i++) {
      if (basicEmail.includes(newEmail[i])) {
        validateEmail = true;
      }
    }
    // Check if each domain is in the email by iteration through the domains.
    for (let i = 0; i < basicDomain.length; i++) {
      if (newEmail.includes(basicDomain[i])) {
        validateDomain = true;
      }
    }
    // If the email is longer than 5 characters and the email and domain are valid, return true.
    // Smallest possible email is X@X.X so 5 characters is minimum.
    if (newEmail.length > 5 && validateEmail && validateDomain) {
      return true;
    }
    // If the email is invalid, return false.
    return false;
  }

  // Define the submit email handler.
  const submitEmail = async () => {

    // Check if the email is valid.
    if (!validateEmail(email)) {
      return;
    }
    
    // Get the field to display the response.
    const responseElement = document.getElementById('response');
    if (responseElement) {
      // Update the response element to show that the email is being checked and change its color.
      responseElement.innerHTML = "Checking for a matching email...";
      responseElement.classList.remove('text-primary');
      responseElement.classList.remove('text-tertiary');
      responseElement.classList.add('text-secondary');
      // Fetch the email from the database.
      const res = await fetch('/api/emails/?email=' + email, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Define the data for the OTP (One Time Pass).
      const OTPdata = {
        email: email,
        expiration_date: new Date(new Date().getTime() + 15 * 60 * 1000).toISOString(),
      }

      // Get the response from the fetch.
      let found = await res.json();

      // If the email is found.
      if (found) {
        // Check for an existing OTP for the email and replace it.
        let replaced = false;
        const replaceRes = await fetch('/api/one-time-pass/replace/?email=' + email, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // If the replace request is successful, get the response and delete the old OTP.
        if (replaceRes.ok) {
          // Get the response and check for the OTP to delete.
          const json = await replaceRes.json();
          let success = json.success;
          let OTP = json.one_time_pass;
          // Call API to delete the old OTP.
          if (success) {
            const del = await fetch('/api/one-time-pass/delete', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ OneTimePass: OTP }),
            });
          }
        }

        // Create a new OTP for the email.
        const res = await fetch('/api/one-time-pass/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(OTPdata),
        });

        // Define the success and OTP variables.
        let success = false;
        let OTP = "";

        // If the response is okay, get the response and set the success and OTP variables.
        if (res.ok) {
          const json = await res.json();
          success = json.success;
          OTP = json.one_time_pass;
        }

        // If the OTP was created successfully, send an email to the user.
        if (success) {
          // Call the recover function to send the email.
          const result = await recover(email, OTP);
          // If the email was sent successfully, update the response element.
          if (result.success) {
            // Update the response element to show that the email was sent and change its color to indicate success.
            responseElement.innerHTML = "An email has been sent to your account.";
            if (replaced) {
              // Add additional text if the OTP was replaced.
              responseElement.innerHTML += "A new email has been sent to your account.\n The previous OTP has been is now invalid.";
            }
            responseElement.classList.add('text-tertiary');
          } else {
            // If the email was not sent successfully, update the response element and its color to indicate failure.
            responseElement.innerHTML = "No account with that email found. Please try again.";
            responseElement.classList.remove('text-secondary');
            responseElement.classList.add('text-primary');;
          }
        } else {
          // If the OTP was not created successfully, update the response element and its color to indicate failure.
          responseElement.innerHTML = "An error occurred. Please try again.";
          responseElement.classList.remove('text-secondary');
          responseElement.classList.add('text-primary');
        }
      } else {
        // If the email was not found, update the response element and its color to indicate failure.
        responseElement.innerHTML = "No account with that email found. Please try again.";
        responseElement.classList.remove('text-secondary');
        responseElement.classList.add('text-primary');
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
