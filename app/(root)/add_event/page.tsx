"use client";
import React, { useState, useEffect } from "react";
import "../../globals.css";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// Lock used to prevent multiple submissions.
let lock = false;


export default function Add_Event() {

    // Get session information and check if the user is an organization
    const { data: session, status } = useSession();
    const router = useRouter();
    const isOrganization = session?.accountType.toLowerCase() === "organization";

    // If the user is not logged in, an organization, or not authenticated, redirect to the login page.
    useEffect(() => {
        if (!session || status !== "authenticated" || !isOrganization) router.push("/login");
    }, [session, status, router, isOrganization]);

    // Removed Fields: Supervisor, Volunteer Position, Phone Number.
    // const [valueSupervisor, setValueSupervisor] = useState<string>('');
    // const [valuePosition, setValuePosition] = useState<string>('');
    // const [placeholderPhone, setPlaceValuePhone] = useState<string>('123 - 456 - 7890');
    // const [valuePhone, setValuePhone] = useState<string>('');

    // Get current date for the date input field placeholder.
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const [valueDate, setPlaceValueDate] = useState<string>(formattedDate);
    // Define values for the event name, start time, and end time.
    const [valueName, setValueName] = useState<string>('');
    const [valueStartTime, setValueStartTime] = useState<string>('');
    const [valueEndTime, setValueEndTime] = useState<string>('');
    // Volunteer number is set to 0 by default.
    const [placeholderVolNum, setPlaceValueVolNum] = useState<string>('0');
    const [valueVolNum, setValueVolNum] = useState<number>(0);
    // Checkboxes for recurring and online events are set to false by default.
    const [valueRecurring, setValueRecurring] = useState<boolean>(false)
    const [valueOnline, setValueOnline] = useState<boolean>(false)
    // Tags and description are set to empty strings by default.
    const [valueDescription, setValueDescription] = useState<string>('');
    const [valueTags, setTagsValue] = useState<string>('');
    // Search value is the value the user inputs for location searching. Search data is the data returned from the API.
    const [searchValue, setSearchValue] = useState('');
    const [searchData, updateSearchData] = useState('');
    // Address is the full address from API, location is formatted without postal code and country.
    const [valueAddress, setValueAddress] = useState<string>('');
    const [valueLocation, setValueLocation] = useState<string>('');
    // Value of dropdown menu for address selection. Show address tracks if the dropdown is open.
    const [addressButtonValue, setAddressButtonValue] = useState<string>('Search for a Location');
    let showAddress = false;
    // Coordinates are the latitude and longitude of the selected address.
    const [valueCoordinates, setValueCoordinates] = useState<string>('');


    // Handler to update the event name value and check if the required fields are filled for event submission.
    const updateNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValueName(event.target.value);
        validateSubmit();
    }

    // Handler for changes to the location input field.
    const updateLocationHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Update the search value and location value to the input value.
        setSearchValue(event.target.value);
        setValueLocation(event.target.value);
        // If at least 5 characters are entered, update the search data and show the dropdown.
        if (event.target.value.length > 4) {
            setAddressButtonValue('Select an Address');
            handleSearch();
        } else {
            // Otherwise clear the search data and hide the dropdown.
            updateSearchData('');
            setAddressButtonValue('Search for a Location');
            document.getElementById('addressDropdown')?.classList.add('h-0');
            document.getElementById('addressDropdown')?.classList.add('ring-0');
            showAddress = false;
        }
        // Check if the required fields are filled for event submission.
        validateSubmit();
    }

    // Handler for the search button to fetch location data from the Mapbox API.
    const handleSearch = () => {
        // Call APU with search value.
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchValue}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`)
            .then((response) => response.json())
            .then((data) => {
                updateSearchData(data.features);
                // Update the dropdown menu with the first 5 results.
                for (let i = 1; i <= 5; i++) {
                    const menuItem = document.getElementById('menu-item-' + i);
                    if (menuItem) {
                        menuItem.textContent = (data.features[i - 1] as any).place_name;
                    }
                }
            })
            // Log any errors to the console.
            .catch((error) => {
                console.error('Error fetching geocoding API:', error);
            });
    };

    // Show or hide the address dropdown menu based on the search data.
    const showAddresses = () => {
        // If show address is false and there is search data, show the dropdown.
        if (searchData.length > 0 && !showAddress) {
            document.getElementById('addressDropdown')?.classList.remove('h-0');
            document.getElementById('addressDropdown')?.classList.add('ring-1');
            showAddress = true;
        } else {
            // Otherwise, hide the dropdown.
            document.getElementById('addressDropdown')?.classList.add('h-0');
            document.getElementById('addressDropdown')?.classList.remove('ring-1');
            showAddress = false;
        }
    }

    // Set the address value based on the selected dropdown menu item.
    const setAddress = (index: number) => {
        // Remove selection indication from all dropdown items.
        for (let i = 1; i <= 5; i++) {
            document.getElementById('dropdown-' + i)?.classList.remove('bg-tertiary');
        }
        // Add selection indication to the selected dropdown item.
        document.getElementById('dropdown-' + index)?.classList.add('bg-tertiary');
        // Set coordinates, location, and address values based on the selected dropdown item.
        setValueCoordinates((searchData[index - 1] as any).center);
        setValueLocation((searchData[index - 1] as any).place_name);
        setValueAddress((searchData[index - 1] as any).place_name);
        // Hide the dropdown menu.
        setTimeout(() => {
            document.getElementById('addressDropdown')?.classList.add('h-0');
            document.getElementById('addressDropdown')?.classList.remove('ring-1');
            showAddress = false;
        }, 150);
        // Check if the required fields are filled for event submission.
        validateSubmit();
    }

    // Handler to check if the full date is entered and update the date value.
    const formatDate = (event: string) => {
        // Format the date to convert to date object.
        if (event.length == 11) {
            event = event.slice(0, 4) + event.slice(5, 11);
        }
        if (event.length == 12) {
            event = event.slice(0, 4) + event.slice(6, 12);
        }
        // Update the date value and check if the required fields are filled for event submission.
        setPlaceValueDate(event);
        validateSubmit();
    }

    // Handler to update the start time value and check if the required fields are filled for event submission.
    const updateStartTimeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValueStartTime(event.target.value);
        validateSubmit();
    }

    // Handler to update the end time value and check if the required fields are filled for event submission.
    const updateEndTimeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValueEndTime(event.target.value);
        validateSubmit();
    }

    // Handler to update the description value and check if the required fields are filled for event submission.
    const updateDescriptionHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValueDescription(event.target.value);
        validateSubmit();
    }

    // Clear the placeholder value when the user clicks on the volunteer number field.
    const handleInputClickVolNum = () => {
        setPlaceValueVolNum('');
    };

    // Reset the placeholder value when the user clicks outside the input field if the input is empty.
    const handleInputBlurVolNum = () => {
        if (placeholderVolNum !== '') return;
        setPlaceValueVolNum('0');
    }

    // Handle changes to the phone number input field.
    const handleInputChangeVolNum = (event: React.ChangeEvent<HTMLInputElement>) => {
        // If the input is empty, set the value to 0.
        if (event.target.value.length == 0) {
            setValueVolNum(0);
            return;
        }
        // Get the new value from the input field.
        const newValue = event.target.value;
        // Validate if the input is less than 3 digits before updating the state.
        if (newValue.length > 3) {
            const correctLen = newValue.slice(0, 3);
            setValueVolNum(parseInt(correctLen, 10))
        } else {
            setValueVolNum(parseInt(newValue, 10));
        }
        // Check if the required fields are filled for event submission.
        validateSubmit();
    }

    // Update the tags value when the user types in the tags input field.
    const updateValueTags = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTagsValue(event.target.value);
    }

    // Format the tags to have a hashtag at the beginning of each tag.
    const formatValueTags = (event: string) => {
        // Split the tags by spaces.
        if (event.length > 0) {
            const tags = valueTags.split(' ');
            let formattedTags = '';
            // If the tag is not an empty space and does not start with a hashtag, add a hashtag to the beginning.
            for (let i = 0; i < tags.length; i++) {
                if (tags[i].charAt(0) !== "#" && tags[i].length > 0) {
                    tags[i] = '#' + tags[i];
                }
                // If it is the first tag, set the formatted tags to the tag.
                if (i === 0) {
                    formattedTags = tags[i];
                } else {
                    // Otherwise add the tag to the formatted tags.
                    formattedTags = formattedTags + ' ' + tags[i];
                }
            }
            // Update the tags value.
            setTagsValue(formattedTags);
        }
    }

    // Lock the submit button and prevent multiple submissions, then submit the event.
    const lockAndSubmit = () => {
        // Set submit button to disabled.
        const submitButton = document.getElementById('submit') as HTMLInputElement;
        submitButton.disabled = true;
        // If the lock is true, return.
        if (lock) {
            return;
        }
        // Otherwise set the lock to true, submit the event, and set a timeout to unlock the button.
        lock = true;
        submitEvent();
        setTimeout(() => {
            lock = false;
            submitButton.disabled = false;
        }, 3000);
    }

    // Submit the event to the API.
    const submitEvent = async () => {
        // Format the location to remove postal code and country.
        let splitAddress = valueAddress.split(',');
        let formattedLocation = splitAddress[0] + ', ' + splitAddress[1];
        for (let i = 2; i < splitAddress.length; i++) {
            if (i + 2 < splitAddress.length) {
                formattedLocation = formattedLocation + splitAddress[i] + ', ';
            }
        }
        // Check if the required fields are filled for event submission.
        if (validateSubmit()) {
            // Create the event info object with the required fields.
            const eventInfo = {
                name: valueName,
                description: valueDescription,
                start_time: new Date(valueDate + " " + valueStartTime),
                end_time: new Date(valueDate + " " + valueEndTime),
                tags: valueTags.split(' '),
                address: valueAddress,
                city: formattedLocation,
                coordinates: valueCoordinates,
                recurring: valueRecurring,
                online: valueOnline,
                token_bounty: 100,
                number_of_spots: valueVolNum,
            };
            // Call the API to create the event.
            const data = JSON.stringify(eventInfo);
            const res = await fetch('/api/events/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data,
            });
            // Log the response and redirect to the events page if successful.
            if (!res) {
                console.log("An error occurred. Please try again.");
            } else if (res.ok) {
                console.log("Successfully created event.")
                const eventData = await res.json();
                window.location.href = "/events";
            } else {
                console.log("Response: ", res)
                console.log("Rejected event creation. Please try again.")
            }
        }
    }

    // For each of the required fields, check if they are filled and enable the submit button if they are.
    const validateSubmit = () => {
        var valid = true;
        if (valueName.length === 0) {
            valid = false;
        }
        if (valueAddress.length === 0) {
            valid = false;
        }
        if (valueLocation.length === 0) {
            valid = false;
        }
        if (valueCoordinates.length === 0) {
            valid = false;
        }
        if (valueDate.length === 0) {
            valid = false;
        }
        if (valueStartTime.length === 0) {
            valid = false;
        }
        if (valueEndTime.length === 0) {
            valid = false;
        }
        if (valueVolNum === 0) {
            valid = false;
        }
        if (valueDescription.length === 0) {
            valid = false;
        }
        // If all required fields are filled, enable the submit button.
        const submitButton = document.getElementById('submit');
        if (submitButton && valid) {
            submitButton.classList.remove('!bg-[#E5E5E5]');
            submitButton.classList.remove('cursor-not-allowed');
            return true;
        } else {
            // Prevent the tags from being added twice.
            submitButton?.classList.remove('!bg-[#E5E5E5]');
            submitButton?.classList.remove('cursor-not-allowed');
            // Otherwise disable the submit button.
            submitButton?.classList.add('!bg-[#E5E5E5]');
            submitButton?.classList.add('cursor-not-allowed');
            return false;
        }
    }

    return (
        <div className="flex flex-1 flex-col items-center w-full bg-tertiary bg-opacity-10 pb-12 pt-4">
            <div className="flex flex-col w-10/12">
                <p className="text-left font-display text-3xl font-bold text-tertiary mt-16 pl-6">Create Event</p>
                <p className="font-display font-bold text-4xl max-w-xs mb-12 pl-6 sm:max-w-full md:max-w-2xl md:text-6xl  lg:max-w-full">Host the future of giving back.</p>
                <div className="flex flex-col items-center border-4 rounded-lg border-primary bg-gray-50">
                    <div className="w-5/6 mt-8 h-fit">
                        <h3 className="font-semibold text-end text-lg !text-secondary opacity-80">Required Field <span className="text-primary">*</span></h3>
                    </div>
                    <div className="flex justify-evenly w-full mt-4">
                        <div className="flex flex-col w-5/6">
                            <label htmlFor="Name" className=" text-lg pl-4 ">Event Name <span className="text-primary">*</span></label>
                            <input id="Name" onChange={(e) => updateNameHandler(e)} className="rounded-lg border-2 border border-[#EAEAEA] pl-6 text-gray-800 sm:text-lg text-ellipsis" placeholder="Enter Your Event Name"></input>
                        </div>
                    </div>
                    <div className="flex justify-evenly w-full pt-12">
                        <div className="flex flex-col w-1/3 pl-2 md:pl-6">
                            <label htmlFor="Position" className="text-lg pl-4">Location <span className="text-primary">*</span></label>
                            <input id="Position" onChange={(e) => updateLocationHandler(e)} value={valueLocation} className="rounded-lg border-2 border border-[#EAEAEA] text-gray-800 text-sm pl-6 min-w-30 sm:text-lg" placeholder="Event Address"></input>
                        </div>
                        <div className="flex flex-col w-1/2 px-6">
                            <label htmlFor="Position" className="text-lg pl-4">Address <span className="text-primary">*</span></label>
                            <button type="button" className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white text-sm sm:text-lg py-2.5 px-4 font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                id="menu-button" aria-expanded="true" aria-haspopup="true" onClick={showAddresses}>
                                {addressButtonValue}
                                <svg className="-mr-1 h-8 w-8 my-auto text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <div id="addressDropdown" className="z-10 mt-2 w-11/12 mx-auto divide-y-1 divide-gray-300 rounded-md bg-white shadow-lg ring-black ring-opacity-5 focus:outline-none h-0 overflow-hidden ring-0" aria-orientation="vertical" aria-labelledby="menu-button">
                                <div className="p-1 overflow-hidden" id="dropdown-1" onClick={() => setAddress(1)}>
                                    <button className="text-gray-700 block px-4 py-2 text-md truncate w-full" id="menu-item-1">1</button>
                                </div>
                                <div className="py-1" id="dropdown-2" onClick={() => setAddress(2)}>
                                    <button className="text-gray-700 block px-4 py-2 text-md truncate w-full" id="menu-item-2">2</button>
                                </div>
                                <div className="py-1" id="dropdown-3" onClick={() => setAddress(3)}>
                                    <button className="text-gray-700 block px-4 py-2 text-md truncate w-full" id="menu-item-3">3</button>
                                </div>
                                <div className="py-1" id="dropdown-4" onClick={() => setAddress(4)}>
                                    <button className="text-gray-700 block px-4 py-2 text-md truncate w-full" id="menu-item-4">4</button>
                                </div>
                                <div className="py-1" id="dropdown-5" onClick={() => setAddress(5)}>
                                    <button className="text-gray-700 block px-4 py-2 text-md truncate w-full" id="menu-item-5">5</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-evenly items-center w-full">
                        <div className="flex flex-col w-4/5 sm:w-1/3 sm:min-w-40 mt-8">
                            <label htmlFor="Date" className="text-lg pl-4">Date <span className="text-primary">*</span></label>
                            <input type="date" id="Date" onChange={(e) => formatDate(e.target.value)} className="rounded-lg border-2 border border-[#EAEAEA] font-semibold text-gray-800 text-sm min-w-34 text-center sm:px-3 md:px-6 sm:text-base" value={valueDate}></input>
                        </div>
                        <div className="flex flex-col w-4/5 mt-8 sm:w-1/3 sm:min-w-44">
                            <label htmlFor="time" className=" text-lg pl-4">Time <span className="text-primary">*</span></label>
                            <div className="bg-white flex flex-row w-full rounded-lg border-2 border border-[#EAEAEA]">
                                <input type="time" id="startTime" onChange={(e) => updateStartTimeHandler(e)} className="border-0 m-auto font-semibold text-gray-800 text-sm sm:text-base" placeholder="12:00"></input>
                                <h1 className="text-xl mt-0.5 sm:text-2xl">-</h1>
                                <input type="time" id="endTime" onChange={(e) => updateEndTimeHandler(e)} className="border-0 m-auto font-semibold text-gray-800 text-sm sm:text-base" placeholder="23:59"></input>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center w-full mt-8 md:flex-row md:justify-evenly">
                        <div className="flex w-full justify-between mt-10 md:w-4/5 md:justify-between md:mt-0">
                            <div className="flex flex-col w-1/3 sm:min-w-36 md:pt-4 ml-10">
                                <label htmlFor="Spots" className=" pl-4 text-lg sm:min-w-36">Available Spots <span className="text-primary">*</span></label>
                                <input type="number" id="Spots" value={valueVolNum} onClick={handleInputClickVolNum} onChange={handleInputChangeVolNum} onBlur={handleInputBlurVolNum} className="font-semibold rounded-lg border-2 border border-[#EAEAEA] pl-6 text-gray-800 text-xl sm:text-2xl sm:min-w-40 text-center" placeholder={placeholderVolNum}></input>
                            </div>
                            <div className="flex flex-col w-32 h-20 border-4 rounded-lg border-secondary border-opacity-80 mt-4 mr-10 md:w-36 md:w-1/3 md:h-24 md:pt-1 ">
                                <div className="mt-2 w-full ml-2">
                                    <input id="Virtual" type="checkbox" onChange={(e) => setValueOnline((e.target as HTMLInputElement).checked)}
                                        className="mb-1 before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-secondary transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-secondary before:opacity-0 before:transition-opacity checked:border-primary checked:bg-primary before:bg-secondary hover:before:opacity-10 focus:ring-tertiary focus:border-tertiary focus:checked:ring-tertiary hover:checked:border-tertiary hover:checked:bg-tertiary focus:checked:bg-tertiary" />
                                    <label className="mt-px font-semibold text-gray-700 cursor-pointer select-none pl-2 md:text-xl" htmlFor="Virtual">
                                        Virtual
                                    </label>
                                </div>
                                <div className="mt-2 w-full ml-2">
                                    <input id="Recurring" type="checkbox" onChange={(e) => setValueRecurring((e.target as HTMLInputElement).checked)}
                                        className="mb-1 before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-secondary transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-secondary before:opacity-0 before:transition-opacity checked:border-primary checked:bg-primary before:bg-secondary hover:before:opacity-10 focus:ring-tertiary focus:border-tertiary focus:checked:ring-tertiary hover:checked:border-tertiary hover:checked:bg-tertiary focus:checked:bg-tertiary" />
                                    <label className="mt-px font-semibold text-gray-700 cursor-pointer select-none pl-2 md:text-xl" htmlFor="Recurring">
                                        Recurring
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-evenly w-full pt-2">
                        <div className="flex flex-col w-4/5">
                            <label htmlFor="Description" className=" text-lg pl-4">Description <span className="text-primary">*</span></label>
                            <textarea id="Description" rows={6} onChange={(e) => updateDescriptionHandler(e)} className="rounded-lg border-2 border border-[#EAEAEA] pl-3 font-semibold text-gray-800 max-h-44 min-h-36"></textarea>
                        </div>
                    </div>
                    <div className="flex justify-evenly w-full mt-8">
                        <div className="flex flex-col w-4/5">
                            <label htmlFor="Tags" className="text-lg pl-4">Tags</label>
                            <input id="Tags" value={valueTags} onInput={updateValueTags} onBlur={(e) => formatValueTags(e.target.value)} className="rounded-lg border-2 border border-[#EAEAEA] pl-3 font-semibold text-primary" placeholder="Enter tags related to your event ..."></input>
                        </div>
                    </div>
                    <div className="flex justify-evenly w-full mb-8 mt-12">
                        <Link href="/" className="w-1/5 "><button className="text-md h-12 w-full rounded-md bg-secondary bg-opacity-60 text-white focus:outline-none font-semibold hover:opacity-80 transition-all duration-300">Cancel</button></Link>
                        <button id="submit" onClick={lockAndSubmit} className="text-md h-12 w-1/5 rounded-md bg-primary text-white focus:outline-none font-semibold hover:opacity-80 !bg-[#E5E5E5] text-[#BDBDBD] cursor-not-allowed">Submit</button>
                    </div>
                </div>
            </div>
        </div>
        // Deprecated phone number input
        // <div className="flex flex-col justify-evenly sm:justify-center w-3/5 sm:w-fit sm:min-w-80 md:w-1/3 md:min-w-0 m-auto md:m-0 md:max-w-56">
        //     <label htmlFor="Phone" className="pl-4 text-lg md:pl-4">Phone</label>
        //     <input type="tel" id="Phone" value={valuePhone} onClick={handleInputClickPhone} onChange={(e) => formatPhone(e.target.value)} onBlur={handleInputBlurPhone} className="font-semibold rounded-lg border-2 border border-[#EAEAEA] text-gray-800 text-center mb:text-lg md:max-w-56" placeholder={placeholderPhone}></input>
        // </div>
    );
}
