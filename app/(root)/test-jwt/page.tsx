"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";

export default function JWTtest() {
  const [response, setResponse] = useState("");
  const [myEventsResponse, setMyEventsResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMyEvents, setLoadingMyEvents] = useState(false);
  const { data: session } = useSession();

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
    } finally {
      setLoading(false);
    }
  };

  const testMyEvents = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setLoadingMyEvents(true);
    setMyEventsResponse("");
    try {
      const response = await fetch("/api/events/myevents", {
        method: "GET",
      });

      const events = await response.json();
      setMyEventsResponse(JSON.stringify(events, null, 2));
    } catch (error) {
      console.error("Error fetching events:", error);
      setMyEventsResponse("Error fetching events: " + error);
    } finally {
      setLoadingMyEvents(false);
    }
  };

  return (
    <div>
      <br />
      {session && session.user ? (
        <p>Logged in as {session.user?.name}</p>
      ) : (
        <p>Not logged in</p>
      )}
      <div>
        <h1>Test API POST Verification</h1>
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
      <div>
        <h1>Test API POST My Events</h1>
        <form onSubmit={testMyEvents}>
          <button
            type="submit"
            className="text-md h-12 w-30 rounded-md bg-primary font-semibold text-white focus:outline-none"
            disabled={loadingMyEvents}
          >
            {loadingMyEvents ? "Fetching..." : "Fetch My Events"}
          </button>
        </form>
        {myEventsResponse && (
          <div>
            <h2>My Events Response:</h2>
            <pre>{myEventsResponse}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
