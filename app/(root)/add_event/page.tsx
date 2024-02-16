import React from "react";
import "../../globals.css";

export default function Add_Event() {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    return (
        console.log(formattedDate),
        <div className="flex flex-1 flex-col items-center w-full bg-blue-100 pb-12">
            <div className="flex flex-col w-10/12">
                <p className="mt-4 pl-12 ext-left font-display text-2xl font-bold text-tertiary">Create Event</p>
                <p className="md:mb-12 mb-16 pl-12 font-display font-bold text-4xl md:text-6xl">Host the future of giving back.</p>
                <div className="flex flex-col items-center border-4 rounded-lg border-secondary bg-gray-50">
                    <div className="flex justify-between w-4/5 pt-12">
                        <div className="flex flex-col w-5/12">
                            <label htmlFor="Position" className="font-semibold pl-4">Position</label>
                            <input id="Position" className="rounded-lg border-2 border border-[#EAEAEA] pl-6 font-semibold text-gray-800" placeholder="Volunteer Position"></input>
                        </div>
                        <div className="flex flex-col w-5/12">
                            <label htmlFor="Supervisor" className="font-semibold pl-4">Supervisor</label>
                            <input id="Supervisor" className="rounded-lg border-2 border border-[#EAEAEA] pl-6 font-semibold text-gray-800" placeholder="Event Coordinator"></input>
                        </div>
                    </div>
                    <div className="flex justify-evenly w-full pt-12">
                        <div className="flex flex-col w-4/5">
                            <label htmlFor="Supervisor" className="font-semibold pl-4">Address</label>
                            <input id="Supervisor" className="rounded-lg border-2 border border-[#EAEAEA] pl-6 font-semibold text-gray-800" placeholder="555 Seymour St, Vancouver BC V6B 3H6, Canada"></input>
                        </div>
                    </div>
                    <div className="flex justify-between w-4/5 pt-12">
                        <div className="flex flex-col w-5/12">
                            <label htmlFor="Date" className="font-semibold pl-4">Date</label>
                            <input type="date" id="Date" className="rounded-lg border-2 border border-[#EAEAEA] pl-24 font-semibold text-gray-800" placeholder={formattedDate}></input>
                        </div>
                        <div className="flex flex-col w-5/12">
                            <label htmlFor="time" className="font-semibold pl-4">Time</label>
                            <div className="bg-white flex flex-row w-full rounded-lg border-2 border border-[#EAEAEA]">
                                <input type="time" id="time" className="border-0 m-auto font-semibold text-gray-800" placeholder="12:00"></input>
                                <h1 className="text-3xl margin-auto">-</h1>
                                <input type="time" id="time" className="border-0 m-auto font-semibold text-gray-800" placeholder="23:59"></input>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between w-4/5 pt-12">
                        <div className="flex flex-col w-1/3">
                            <label htmlFor="Phone" className="font-semibold pl-4">Phone</label>
                            <input type="tel" id="Phone" className="font-semibold rounded-lg border-2 border border-[#EAEAEA] pl-6 text-gray-800" placeholder="(123) - 456 - 7890"></input>
                        </div>
                        <div className="flex flex-col w-1/5">
                            <label htmlFor="Spots" className="font-semibold pl-4">Available Spots</label>
                            <input type="number" id="Spots" className="font-semibold rounded-lg border-2 border border-[#EAEAEA] pl-6 text-gray-800" placeholder="0"></input>
                        </div>
                        <div className="flex flex-col w-1/4 border-4 rounded-lg border-gray-400 mr-6 py-2">
                            <div className="mt-2 w-full ml-2">
                                <input id="Virtual" type="checkbox"
                                    className="ml-4 mb-1 before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-secondary transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-secondary before:opacity-0 before:transition-opacity checked:border-primary checked:bg-primary before:bg-secondary hover:before:opacity-10 focus:ring-tertiary focus:border-tertiary focus:checked:ring-tertiary hover:checked:border-tertiary hover:checked:bg-tertiary focus:checked:bg-tertiary" />
                                <label className="mt-px font-light text-gray-700 cursor-pointer select-none pl-4" htmlFor="Virtual">
                                    Virtual
                                </label>
                            </div>
                            <div className="mt-2 w-full ml-2">
                                <input id="Recurring" type="checkbox"
                                    className="ml-4 mb-1 before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-secondary transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-secondary before:opacity-0 before:transition-opacity checked:border-primary checked:bg-primary before:bg-secondary hover:before:opacity-10 focus:ring-tertiary focus:border-tertiary focus:checked:ring-tertiary hover:checked:border-tertiary hover:checked:bg-tertiary focus:checked:bg-tertiary" />
                                <label className="mt-px font-light text-gray-700 cursor-pointer select-none pl-4" htmlFor="Recurring">
                                    Recurring
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-evenly w-full pt-12">
                        <div className="flex flex-col w-4/5">
                            <label htmlFor="Description" className="font-semibold pl-4">Description</label>
                            <textarea id="Description" rows={6} className="rounded-lg border-2 border border-[#EAEAEA] pl-6 font-semibold text-gray-800 max-h-44"></textarea>
                        </div>
                    </div>
                    <div className="flex justify-evenly w-full pt-12">
                        <div className="flex flex-col w-4/5">
                            <label htmlFor="Tags" className="font-semibold pl-4">Tags</label>
                            <input id="Tags" className="rounded-lg border-2 border border-[#EAEAEA] pl-6 font-semibold text-primary" placeholder="Enter tags related to your event ..."></input>
                        </div>
                    </div>
                    <div className="flex justify-evenly w-full md:mb-4 mb-8 mb:mt-0 mt-8 pt-12">
                        <button className="text-md h-12 w-1/5 rounded-md bg-secondary bg-opacity-60 text-white focus:outline-none">Cancel</button>
                        <button className="text-md h-12 w-1/5 rounded-md bg-primary text-white focus:outline-none">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
