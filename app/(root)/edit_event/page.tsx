"use client";
import React, { useState } from "react";
import "../../globals.css";
import Link from "next/link";
import { url } from "inspector";
import { on } from "events";

let load = 0;

export default function Add_Event() {

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [errorFields, setErrorFields] = useState<string>('');
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const [valueDate, setPlaceValueDate] = useState<string>(formattedDate);
    const [placeholderPhone, setPlaceValuePhone] = useState<string>('123 - 456 - 7890');
    const [valuePhone, setValuePhone] = useState<string>('');
    const [placeholderVolNum, setPlaceValueVolNum] = useState<string>('0');
    const [valueVolNum, setValueVolNum] = useState<number>(0);
    const [valueTags, setTagsValue] = useState<string>('');
    const [valueName, setValueName] = useState<string>('');
    const [valueSupervisor, setValueSupervisor] = useState<string>('');
    const [valuePosition, setValuePosition] = useState<string>('');
    const [valueAddress, setValueAddress] = useState<string>('');
    const [valueCity, setValueCity] = useState<string>('');
    const [valueStartTime, setValueStartTime] = useState<string>('');
    const [valueEndTime, setValueEndTime] = useState<string>('');
    const [valueRecurring, setValueRecurring] = useState<boolean>(false)
    const [valueOnline, setValueOnline] = useState<boolean>(false)
    const [valueDescription, setValueDescription] = useState<string>('');

    const url = new URL(window.location.href);
    const eventID = url.searchParams.get("eventID");
    const updateValues = (event: object) => {
        setValueName(event.name);
        setValueAddress(event.address);
        setValueCity(event.city);
        setPlaceValueDate(event.start_time);
        setValueStartTime(event.start_time);
        setValueEndTime(event.end_time);

        // setValuePhone(event.phone);
        // setValuePosition(event.position);
        // setValueSupervisor(event.supervisor);

        setValueVolNum(event.number_of_spots);
        setValueDescription(event.description);
        let tagsString = ''
        for (let i = 0; i < event.tags.length; i++) {
            tagsString = tagsString + event.tags[i] + ' ';
        }
        setTagsValue(tagsString);
        let start_date = event.start_time;
        let end_date = event.end_time;
        let date = start_date.slice(0, 10);
        setPlaceValueDate(date);
        let start_time = start_date.slice(11, 16);
        let end_time = end_date.slice(11, 16);
        setValueStartTime(start_time);
        setValueEndTime(end_time);
        setValueOnline(event.online);
        setValueRecurring(event.recurring);
    }
    const readEvent = async () => {
        console.log("read");
        const res = await fetch('/api/events/?eventID=' + eventID, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const result = (await res.json())
        updateValues(result);
        return 1;
    }

    // Only load the event once.
    if (load === 0) {
        readEvent();
        load = 1;
    }

    const formatDate = (event: string) => {
        if (event.length == 11) {
            event = event.slice(0, 4) + event.slice(5, 11);
        }
        if (event.length == 12) {
            event = event.slice(0, 4) + event.slice(6, 12);
        }
        setPlaceValueDate(event);
    }
    const handleInputClickPhone = () => {
        // Clear the placeholder value when the user clicks on the input field
        setPlaceValuePhone('');
    };
    const handleInputBlurPhone = () => {
        if (placeholderPhone !== '') return;
        // Reset the placeholder value when the user clicks outside the input field
        setPlaceValuePhone('123 - 456 - 7890');
    }
    const formatPhone = (event: string) => {
        // Check for a valid phone number with extra digits at the end
        if (event.length > 16) {
            const correctLen = event.slice(0, 16);
            event = correctLen;
        }
        // Remove all non-numeric characters from the input value
        const cleaned = event.replace(/\D/g, '');
        // Apply formatting based on the cleaned value
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
        if (match) {
            // Check if all digits are entered, otherwise, return formatted string with only entered digits
            event = match[1] ? '(' + match[1] + (match[2] ? ') ' + match[2] + (match[3] ? ' - ' + match[3] : '') : '') : '';
        } else {
            event = ''
        }
        setValuePhone(event);
    }
    const handleInputClickVolNum = () => {
        // Clear the placeholder value when the user clicks on the input field
        setPlaceValueVolNum('');
    };
    const handleInputBlurVolNum = () => {
        if (placeholderPhone !== '') return;
        // Reset the placeholder value when the user clicks outside the input field
        setPlaceValueVolNum('0');
    }
    const handleInputChangeVolNum = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
        if (event.target.value.length == 0) {
            setValueVolNum(0);
            return;
        }
        const newValue = event.target.value;
        // Validate if the input is a number before updating the state
        if (newValue.length > 3) {
            const correctLen = newValue.slice(0, 3);
            setValueVolNum(parseInt(correctLen, 10))
        } else {
            setValueVolNum(parseInt(newValue, 10));
        }
    }
    const updateValueTags = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTagsValue(event.target.value);
    }
    const formatValueTags = (event: string) => {
        if (event.length > 0) {
            const tags = valueTags.split(' ');
            let formattedTags = '';
            for (let i = 0; i < tags.length; i++) {
                if (tags[i].charAt(0) !== "#" && tags[i].length > 0) {
                    tags[i] = '#' + tags[i];
                }
                if (i === 0) {
                    formattedTags = tags[i];
                } else {
                    formattedTags = formattedTags + ' ' + tags[i];
                }
            }
            setTagsValue(formattedTags);
        }
    }
    const submitEvent = async () => {
        // Removed Elements:
        // - valuePosition
        // - valueSupervisor
        const eventInfo = {
            id: eventID,
            name: valueName,
            description: valueDescription,
            start_time: valueDate + " " + valueStartTime,
            end_time: valueDate + " " + valueEndTime,
            organization_id: "clsn6cghj0001vbewrz1qrso4",
            tags: valueTags.split(' '),
            address: valueAddress,
            city: valueCity,
            recurring: valueRecurring,
            online: valueOnline,
            token_bounty: 100,
            number_of_spots: valueVolNum,
        };
        const data = JSON.stringify(eventInfo);
        console.log(data);
        const res = await fetch('/api/events/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data,
        });

        console.log("Response: ", res.text());
        if (!res) {
            console.log("An error occurred. Please try again.");
        } else if (res.ok) {
            console.log("Successfully created event.");
            window.location.href = "/events";
        } else {
            invalidSubmit();
            console.log("Rejected event creation. Please try again.")
        }
    }

    const invalidSubmit = () => {
        var missingFields = [];
        if (valueName.length === 0) {
            missingFields.push("Event Name");
        }
        if (valueAddress.length === 0) {
            missingFields.push("Address");
        }
        if (valueCity.length === 0) {
            missingFields.push("City");
        }
        if (valueDate.length === 0) {
            missingFields.push("Date");
        }
        if (valueStartTime.length === 0) {
            missingFields.push("Start Time");
        }
        if (valueEndTime.length === 0) {
            missingFields.push("End Time");
        }
        if (valueVolNum === 0) {
            missingFields.push("Available Spots");
        }
        setErrorMessage("Fill all required fields for an event");
        var errorFields = "";
        for (let i = 0; i < missingFields.length; i++) {
            if (i === missingFields.length - 1) {
                errorFields = errorFields + missingFields[i];
                break;
            }
            errorFields = errorFields + missingFields[i] + ',   ';
        }
        setErrorFields(errorFields);
    }

    return (
        <div className="flex flex-1 flex-col items-center w-full bg-blue-100 pb-12">
            <div className="flex flex-col w-10/12">
                <p className="ext-left font-display text-3xl font-bold text-tertiary mt-16 pl-6">Edit Event</p>
                <p className="font-display font-bold text-4xl max-w-xs mb-12 pl-6 sm:max-w-full md:max-w-2xl md:text-6xl  lg:max-w-full">Host the future of giving back.</p>
                <div className="flex flex-col items-center border-4 rounded-lg border-secondary bg-gray-50">
                    <div className="flex justify-evenly w-full mt-12">
                        <div className="flex flex-col w-5/6">
                            <label htmlFor="Name" className="font-semibold pl-4 ">Event Name</label>
                            <input id="Name" onChange={(e) => setValueName(e.target.value)} value={valueName} className="rounded-lg border-2 border border-[#EAEAEA] pl-6 font-semibold text-gray-800 sm:text-lg text-ellipsis" placeholder="Enter Your Event Name"></input>
                        </div>
                    </div>
                    <div className="flex justify-evenly w-full pt-12">
                        <div className="flex flex-col w-5/12">
                            <label htmlFor="Position" className="font-semibold pl-4">Position</label>
                            <input id="Position" onChange={(e) => setValuePosition(e.target.value)} className="rounded-lg border-2 border border-[#EAEAEA] font-semibold text-gray-800 text-sm pl-4 min-w-30 sm:text-lg" placeholder="Volunteer Title"></input>
                        </div>
                        <div className="flex flex-col w-5/12">
                            <label htmlFor="Supervisor" className="font-semibold pl-4">Supervisor</label>
                            <input id="Supervisor" onChange={(e) => setValueSupervisor(e.target.value)} className="rounded-lg border-2 border border-[#EAEAEA] font-semibold text-gray-800 text-sm pl-4 min-w-30 sm:text-lg" placeholder="Coordinator"></input>
                        </div>
                    </div>
                    <div className="flex justify-evenly w-full pt-12">
                        <div className="flex flex-col w-5/12">
                            <label htmlFor="Position" className="font-semibold pl-4">Address</label>
                            <input id="Position" onChange={(e) => setValueAddress(e.target.value)} value={valueAddress} className="rounded-lg border-2 border border-[#EAEAEA] font-semibold text-gray-800 text-sm pl-4 min-w-30 sm:text-lg" placeholder="Event Address"></input>
                        </div>
                        <div className="flex flex-col w-5/12">
                            <label htmlFor="Supervisor" className="font-semibold pl-4">City</label>
                            <input id="Supervisor" onChange={(e) => setValueCity(e.target.value)} value={valueCity} className="rounded-lg border-2 border border-[#EAEAEA] font-semibold text-gray-800 text-sm pl-4 min-w-30 sm:text-lg" placeholder="Event City"></input>
                        </div>
                    </div>
                    <div className="flex flex-col mb:flex-row justify-evenly items-center w-full">
                        <div className="flex flex-col w-4/5 mb:w-1/3 mb:min-w-40 mt-8">
                            <label htmlFor="Date" className="font-semibold pl-4">Date</label>
                            <input type="date" id="Date" onChange={(e) => formatDate(e.target.value)} className="rounded-lg border-2 border border-[#EAEAEA] font-semibold text-gray-800 text-sm min-w-34 text-center mb:px-3 md:px-6 mb:text-base" value={valueDate}></input>
                        </div>
                        <div className="flex flex-col w-4/5 mt-8 mb:w-1/3 mb:min-w-44">
                            <label htmlFor="time" className="font-semibold pl-4">Time</label>
                            <div className="bg-white flex flex-row w-full rounded-lg border-2 border border-[#EAEAEA]">
                                <input type="time" id="startTime" value={valueStartTime} onChange={(e) => setValueStartTime(e.target.value)} className="border-0 m-auto font-semibold text-gray-800 text-sm mb:text-base" placeholder="12:00"></input>
                                <h1 className="text-xl mt-0.5 mb:text-2xl">-</h1>
                                <input type="time" id="endTime" value={valueEndTime} onChange={(e) => setValueEndTime(e.target.value)} className="border-0 m-auto font-semibold text-gray-800 text-sm mb:text-base" placeholder="23:59"></input>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center w-full mt-8 md:flex-row md:justify-evenly">
                        <div className="flex flex-col justify-evenly sm:justify-center w-3/5 sm:w-fit sm:min-w-80 md:w-1/3 md:min-w-0 m-auto md:m-0 md:max-w-56">
                            <label htmlFor="Phone" className="font-semibold pl-4 md:pl-4">Phone</label>
                            <input type="tel" id="Phone" value={valuePhone} onClick={handleInputClickPhone} onChange={(e) => formatPhone(e.target.value)} onBlur={handleInputBlurPhone} className="font-semibold rounded-lg border-2 border border-[#EAEAEA] text-gray-800 text-center mb:text-lg md:max-w-56" placeholder={placeholderPhone}></input>
                        </div>
                        <div className="flex w-full justify-evenly mt-10 md:w-1/2 md:justify-between md:mt-0">
                            <div className="flex flex-col w-1/2 sm:min-w-36 md:pt-4">
                                <label htmlFor="Spots" className="font-semibold pl-4 sm:min-w-36">Available Spots</label>
                                <input type="number" id="Spots" value={valueVolNum} onClick={handleInputClickVolNum} onChange={handleInputChangeVolNum} onBlur={handleInputBlurVolNum} className="font-semibold rounded-lg border-2 border border-[#EAEAEA] pl-6 text-gray-800 text-xl sm:text-2xl sm:min-w-40 text-center" placeholder={placeholderVolNum}></input>
                            </div>
                            <div className="flex flex-col w-32 h-20 border-4 rounded-lg border-gray-400 mt-4 md:w-34 md:w-1/3 md:h-24 md:pt-1">
                                <div className="mt-2 w-full ml-2">
                                    <input id="Virtual" type="checkbox" checked={valueOnline} onChange={(e) => setValueOnline((e.target as HTMLInputElement).checked)}
                                        className="mb-1 before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-secondary transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-secondary before:opacity-0 before:transition-opacity checked:border-primary checked:bg-primary before:bg-secondary hover:before:opacity-10 focus:ring-tertiary focus:border-tertiary focus:checked:ring-tertiary hover:checked:border-tertiary hover:checked:bg-tertiary focus:checked:bg-tertiary" />
                                    <label className="mt-px font-light text-gray-700 cursor-pointer select-none pl-2 md:text-xl" htmlFor="Virtual">
                                        Virtual
                                    </label>
                                </div>
                                <div className="mt-2 w-full ml-2">
                                    <input id="Recurring" type="checkbox" checked={valueRecurring} onChange={(e) => setValueRecurring((e.target as HTMLInputElement).checked)}
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
                            <textarea id="Description" value={valueDescription} rows={6} onChange={(e) => setValueDescription(e.target.value)} className="rounded-lg border-2 border border-[#EAEAEA] pl-3 font-semibold text-gray-800 max-h-44 min-h-36"></textarea>
                        </div>
                    </div>
                    <div className="flex justify-evenly w-full mt-8">
                        <div className="flex flex-col w-4/5">
                            <label htmlFor="Tags" className="font-semibold pl-4">Tags</label>
                            <input id="Tags" value={valueTags} onInput={updateValueTags} onBlur={(e) => formatValueTags(e.target.value)} className="rounded-lg border-2 border border-[#EAEAEA] pl-3 font-semibold text-primary" placeholder="Enter tags related to your event ..."></input>
                        </div>
                    </div>
                    <div className="flex justify-evenly w-full mb-4  mt-12">
                        <Link href="/" className="w-1/5 "><button className="text-md h-12 w-full rounded-md bg-secondary bg-opacity-60 text-white focus:outline-none font-semibold">Cancel</button></Link>
                        <button onClick={submitEvent} className="text-md h-12 w-1/5 rounded-md bg-primary text-white focus:outline-none font-semibold">Confirm</button>
                    </div>
                    <div className="flex flex-col  items-center justify-center w-full mb-4 mt-2 h-fit">
                        <h3 className="w-4/5 font-semibold text-center text-primary text-xl whitespace-pre-wrap">{errorMessage}</h3>
                        <h3 className="w-4/5 font-semibold text-center text-primary text-lg whitespace-pre-wrap">{errorFields}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
