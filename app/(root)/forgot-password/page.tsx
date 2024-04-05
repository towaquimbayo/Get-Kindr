"use client";
import React from "react";
import "../../globals.css";
import Link from "next/link";
import recover from "../recover-password/page";
// Lock to prevent multiple submissions.
let lock = false;

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

  const lockAndSubmit = () => {
    // Set submit button to disabled.
    const submitButton = document.getElementById('submit') as HTMLInputElement;
    submitButton.disabled = true;
    // If the lock is true, return.
    if (lock) {
      return;
    }
    // Otherwise set the lock to true, send an email, and set a timeout to unlock the button.
    lock = true;
    submitEmail();
    setTimeout(() => {
      lock = false;
      submitButton.disabled = false;
    }, 3000);
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
      responseElement.classList.remove('brightness-90');
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
        email: email
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
          responseElement.innerHTML = "Sending an email to your account ...";
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
            responseElement.classList.add('brightness-90');
          } else {
            console.log("test")
            // If the email was not sent successfully, update the response element and its color to indicate failure.
            responseElement.innerHTML = "Error encountered sending the email. Please try again.";
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
    <div id="forgotPasswordBody" className="flex flex-1 flex-col items-center place-content-center bg-gradient-to-r from-start to-end w-full h-4/5">
      <div id="innerContainer" className="flex flex-col items-center bg-gray-50 border-4 rounded-lg border-secondary w-11/12 h-fit md:w-2/3 mb-20 px-6 mt-20 md:px-0 md:mb-8 md:mt-0">
        <p className="text-center font-display font-bold text-secondary text-4xl md:text-5xl mb-16 mt-6 md:mb-12">Forgot Password?</p>
        <p className="text-center font-display font-bold text-base text-secondary opacity-80 md:text-xl mb-4">Enter the email connected to your account.</p>
        <input onChange={(e) => updateEmail(e)} className="rounded-lg border border-[#EAEAEA] h-16 w-full md:h-12 md:w-2/3 px-6 mb-10 mt-2 md:mt-0" placeholder="example@email.com"></input>
        <div id="buttonsContainer" className="flex justify-evenly w-full mb-8 mt-8 mb:mt-0">
          <Link href="/" className="w-1/3 "><button id="return" className="rounded-md bg-secondary bg-opacity-60 font-semibold text-md text-white focus:outline-none hover:opacity-80 transition-all duration-300 h-12 w-full">Cancel</button></Link>
          <button onClick={lockAndSubmit} id="submit" className="bloc rounded-md focus:outline-none border-primary bg-primary !bg-[#E5E5E5] text-white text-[#BDBDBD] text-md transition-all duration-300 hover:opacity-80 h-12 w-1/3 px-4 cursor-not-allowed">Submit</button>
        </div>
        <p id="response" className="text-center font-bold font-display text-2xl opacity-100 w-4/5 mt-4 mb-6"></p>
      </div>
    </div>
  );
}
