"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";

export default function JWTtest() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session, status, update } = useSession();

  const testToken = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setLoading(true);
    setResponse("");
    try {
      const response = await fetch("/api/jwttest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resultText = await response.text();
      console.log("Response from server:", resultText);
      setResponse(resultText);
    } catch (error) {
      console.error("Error sending POST request:", error);
      setResponse("Error sending POST request:" + error);
    }
  };

  return (
    <div>
      <br></br>
      {session && session.user ? (
        <p>Logged in as {session.user?.name}</p>
      ) : (
        <p>Not logged in</p>
      )}
      <br></br>
      <div>
        <h1>Test api POST verification</h1>
        <br></br>
        <form onSubmit={testToken}>
          <button
            type="submit"
            className="text-md h-12 w-30 rounded-md bg-primary font-semibold text-white focus:outline-none"
            disabled={loading}
          >
            {loading ? "Sending..." : "Test POST Request"}
          </button>
        </form>
        {response && (
          <div>
            <h2>Response from the server:</h2>
            <p>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
