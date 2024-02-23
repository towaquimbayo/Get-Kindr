import React from "react";
import "../../globals.css";

export default function Add_Event() {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    return (
        console.log(formattedDate),
        <div className="flex flex-1 flex-col items-center w-full bg-blue-100 pb-12">
            <div className="flex flex-col w-10/12">
                <p className="ext-left font-display text-3xl font-bold text-tertiary mt-16 pl-6">Create Event</p>
                <p className="font-display font-bold text-4xl max-w-xs mb-12 pl-6 sm:max-w-full md:max-w-2xl md:text-6xl  lg:max-w-full">Host the future of giving back.</p>
                <div className="flex flex-col items-center border-4 rounded-lg border-secondary bg-gray-50">
                    <div className="flex justify-evenly w-full pt-12">
                        <div className="flex flex-col w-5/12">
                            <label htmlFor="Position" className="font-semibold pl-4">Position</label>
                            <input id="Position" className="rounded-lg border-2 border border-[#EAEAEA] font-semibold text-gray-800 text-sm pl-4 min-w-30 sm:text-lg" placeholder="Position"></input>
                        </div>
                        <div className="flex flex-col w-5/12">
                            <label htmlFor="Supervisor" className="font-semibold pl-4">Supervisor</label>
                            <input id="Supervisor" className="rounded-lg border-2 border border-[#EAEAEA] font-semibold text-gray-800 text-sm pl-4 min-w-30 sm:text-lg" placeholder="Coordinator"></input>
                        </div>
                    </div>
                    <div className="flex justify-evenly w-full mt-8">
                        <div className="flex flex-col w-5/6">
                            <label htmlFor="Supervisor" className="font-semibold pl-4 ">Address</label>
                            <input id="Supervisor" className="rounded-lg border-2 border border-[#EAEAEA] pl-6 font-semibold text-gray-800 sm:text-lg text-ellipsis" placeholder="555 Seymour St, Vancouver BC V6B 3H6, Canada"></input>
                        </div>
                    </div>
                    <div className="flex flex-col mb:flex-row justify-evenly items-center w-full">
                        <div className="flex flex-col w-4/5 mb:w-1/3 mb:min-w-40 mt-8">
                            <label htmlFor="Date" className="font-semibold pl-4">Date</label>
                            <input type="date" id="Date" className="rounded-lg border-2 border border-[#EAEAEA] font-semibold text-gray-800 text-sm min-w-34 text-center mb:px-3 md:px-6 mb:text-base" placeholder={formattedDate}></input>
                        </div>
                        <div className="flex flex-col w-4/5 mt-8 mb:w-1/3 mb:min-w-44">
                            <label htmlFor="time" className="font-semibold pl-4">Time</label>
                            <div className="bg-white flex flex-row w-full rounded-lg border-2 border border-[#EAEAEA]">
                                <input type="time" id="time" className="border-0 m-auto font-semibold text-gray-800 text-sm mb:text-base" placeholder="12:00"></input>
                                <h1 className="text-xl mt-0.5 mb:text-2xl">-</h1>
                                <input type="time" id="time" className="border-0 m-auto font-semibold text-gray-800 text-sm mb:text-base" placeholder="23:59"></input>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center w-full mt-8 md:flex-row md:justify-evenly">
                        <div className="flex flex-col justify-evenly sm:justify-center w-3/5 sm:w-fit sm:min-w-80 md:w-1/3 md:min-w-0 m-auto md:m-0 md:max-w-56">
                            <label htmlFor="Phone" className="font-semibold pl-4 md:pl-4">Phone</label>
                            <input type="tel" id="Phone" className="font-semibold rounded-lg border-2 border border-[#EAEAEA] text-gray-800 text-center mb:text-lg md:max-w-56" placeholder="(123) - 456 - 7890"></input>
                        </div>
                        <div className="flex w-full justify-evenly mt-10 md:w-1/2 md:justify-between md:mt-0">
                            <div className="flex flex-col w-1/2 sm:min-w-36 md:pt-4">
                                <label htmlFor="Spots" className="font-semibold pl-4 sm:min-w-36">Available Spots</label>
                                <input type="number" id="Spots" className="font-semibold rounded-lg border-2 border border-[#EAEAEA] pl-6 text-gray-800 text-xl sm:text-2xl sm:min-w-40 text-center" placeholder="0"></input>
                            </div>
                            <div className="flex flex-col w-32 h-20 border-4 rounded-lg border-gray-400 mt-4 md:min-w-34 md:w-1/3 md:h-24 md:pt-1">
                                <div className="mt-2 w-full ml-2">
                                    <input id="Virtual" type="checkbox"
                                        className="mb-1 before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-secondary transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-secondary before:opacity-0 before:transition-opacity checked:border-primary checked:bg-primary before:bg-secondary hover:before:opacity-10 focus:ring-tertiary focus:border-tertiary focus:checked:ring-tertiary hover:checked:border-tertiary hover:checked:bg-tertiary focus:checked:bg-tertiary" />
                                    <label className="mt-px font-light text-gray-700 cursor-pointer select-none pl-2 md:text-xl" htmlFor="Virtual">
                                        Virtual
                                    </label>
                                </div>
                                <div className="mt-2 w-full ml-2">
                                    <input id="Recurring" type="checkbox"
                                        className="mb-1 before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-secondary transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-secondary before:opacity-0 before:transition-opacity checked:border-primary checked:bg-primary before:bg-secondary hover:before:opacity-10 focus:ring-tertiary focus:border-tertiary focus:checked:ring-tertiary hover:checked:border-tertiary hover:checked:bg-tertiary focus:checked:bg-tertiary" />
                                    <label className="mt-px font-light text-gray-700 cursor-pointer select-none pl-2 md:text-xl" htmlFor="Recurring">
                                        Recurring
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-evenly w-full pt-2">
                        <div className="flex flex-col w-4/5">
                            <label htmlFor="Description" className="font-semibold pl-4">Description</label>
                            <textarea id="Description" rows={6} className="rounded-lg border-2 border border-[#EAEAEA] pl-3 font-semibold text-gray-800 max-h-44"></textarea>
                        </div>
                    </div>
                    <div className="flex justify-evenly w-full mt-8">
                        <div className="flex flex-col w-4/5">
                            <label htmlFor="Tags" className="font-semibold pl-4">Tags</label>
                            <input id="Tags" className="rounded-lg border-2 border border-[#EAEAEA] pl-3 font-semibold text-primary" placeholder="Enter tags related to your event ..."></input>
                        </div>
                    </div>
                    <div className="flex justify-evenly w-full mb-8  mt-12">
                        <button className="text-md h-12 w-1/5 rounded-md bg-secondary bg-opacity-60 text-white focus:outline-none font-semibold">Cancel</button>
                        <button className="text-md h-12 w-1/5 rounded-md bg-primary text-white focus:outline-none font-semibold">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
