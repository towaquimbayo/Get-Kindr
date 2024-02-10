import React from "react";
import "../../globals.css";


export default function Add_Event() {
    return (
        <div className="flex flex-1 flex-col items-center w-full bg-blue-100">
            <div className="flex flex-col w-11/12">
                <p className="mt-4 pl-20 ext-left font-display text-2xl font-bold text-tertiary">Create Event</p>
                <p className="md:mb-12 mb-16 pl-20 font-display font-bold text-4xl md:text-6xl">Host the future of giving back.</p>
                <div className="flex flex-col items-center border-4 rounded-lg border-secondary bg-gray-50">
                    <div className="flex justify-evenly w-full pt-6">
                        <div className="flex flex-col w-1/3">
                            <label htmlFor="Position" className="font-semibold">Position</label>
                            <input id="Position" className="rounded-lg border-2 border border-[#EAEAEA]" placeholder="Volunteer Position"></input>
                        </div>
                        <div className="flex flex-col w-1/3">
                            <label htmlFor="Supervisor" className="font-semibold ">Supervisor</label>
                            <input id="Supervisor" className="rounded-lg border-2 border border-[#EAEAEA]" placeholder="Event Coordinator"></input>
                        </div>
                    </div>
                    <div className="flex justify-evenly w-full md:mb-4 mb-8 mb:mt-0 mt-8">
                        <button className="text-md h-12 w-1/5 rounded-md bg-secondary bg-opacity-60 text-white focus:outline-none">Cancel</button>
                        <button className="text-md h-12 w-1/5 rounded-md bg-primary text-white focus:outline-none">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
