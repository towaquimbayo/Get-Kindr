"use client";
import React, { useState, useEffect } from "react";
import "../../globals.css";
import Link from "next/link";
import { Event } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// Singleton value to prevent multiple loadings of the event during form changes.
let load = 0;
// Lock to prevent multiple submissions of the event.
let lock = false;

export default function Add_Event() {
    // Get the session and router objects.
    const { data: session, status } = useSession();
    const router = useRouter();

    // Check if the user is an organization and get their ID.
    const isOrganization = session?.accountType.toLowerCase() === "organization";
    const organizationID = session?.organizationID;

    // Redirect the user if they are not authenticated or not an organization.
    useEffect(() => {
        if (!session || status !== "authenticated" || !isOrganization) {
            router.push("/");
        }
    }, [session, status, router, isOrganization]);

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
    const [valueVolNum, setValueVolNum] = useState<string>('0');
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


    // Load the event data from the API and update the form values.
    const updateValues = (event: Event) => {
        // Prevent multiple loads of the event data.
        if (load === 0) {
            // Set singleton to prevent multiple loads of the event data.
            load = 1;
            // Load the time data with correct formatting for the input fields. Converts to local time.
            const localStart = new Date(event.start_time).toString().slice(16, 21)
            const localEnd = new Date(event.end_time).toString().slice(16, 21)
            const localDate = new Date(event.start_time).toString().slice(0, 15)
            let month = String(new Date(event.start_time).getMonth() + 1);
            // Add a 0 to the month if it is less than 10.
            if (Number(month) < 10) {
                month = '0' + month;
            }
            // Format the date to show in the input field.
            const formattedDate = localDate.slice(11, 15) + '-' + month + '-' + localDate.slice(8, 10);
            // Update the values with the event data.
            setValueName(event.name);
            setValueAddress(event.address);
            setValueLocation(event.city);
            setPlaceValueDate(formattedDate);
            setValueStartTime(localStart);
            setValueEndTime(localEnd);
            setValueVolNum(String(event.number_of_spots));
            setValueOnline(event.online);
            setValueRecurring(event.recurring);
            setValueDescription(event.description ?? "");
            // Separate the tags load them into the input field.
            let tagsString = ''
            for (let i = 0; i < event.tags.length; i++) {
                tagsString = tagsString + event.tags[i] + ' ';
            }
            setTagsValue(tagsString);
            // Convert the coordinates to a string array and save them.
            let coordinates = String(event.latitude) + "," + String(event.longitude);
            setValueCoordinates(coordinates);
        }
    }

    // Read the event data from the API and update the form values.
    const readEvent = async () => {
        const url = window.location.href;
        const eventID = url.split('=')[1];
        // Look for event with ID matching the URL parameter.
        const res = await fetch('/api/events?eventID=' + eventID, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        // Await results
        const result = await res.json();
        // If the result is null or the organization ID does not match, redirect to the home page.
        if (result === null || result.organization_id !== organizationID) {
            router.push("/");
        } else {
            // Otherwise, update the page values.
            updateValues(result);
            // If the event has ended, show the finished event view.
            if (new Date(result.end_time) < new Date()) {
                showFinishedEvent();
            }
        }
    }

    // Load the event data on page load.
    readEvent();

    // Handler to update the event name value and check if the required fields are filled for event submission.
    const updateNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length > 80) {
            event.target.value = event.target.value.slice(0, 80);
        }
        setValueName(event.target.value);
        validateSubmit();
    }

    // Handler for changes to the location input field.
    const updateLocationHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Update the search value and location value to the input value.
        setSearchValue(event.target.value);
        setValueLocation(event.target.value);
        // If at least 5 characters are entered, update the search data and show the dropdown.
        if (event.target.value.length > 3) {
            setAddressButtonValue('Select an Address');
            document.getElementById('menu-button')?.classList.remove('bg-white');
            document.getElementById('menu-button')?.classList.add('bg-tertiary');
            document.getElementById('menu-button')?.classList.add('brightness-90');
            document.getElementById('menu-button')?.classList.add('bg-opacity-40');
            handleSearch();
        } else {
            // Otherwise clear the search data and hide the dropdown.
            updateSearchData('');
            setAddressButtonValue('Search for a Location');
            document.getElementById('menu-button')?.classList.add('bg-white');
            document.getElementById('menu-button')?.classList.remove('bg-tertiary');
            document.getElementById('menu-button')?.classList.remove('brightness-90');
            document.getElementById('menu-button')?.classList.remove('bg-opacity-40');
            document.getElementById('addressDropdown')?.classList.add('h-0');
            document.getElementById('addressDropdown')?.classList.remove('ring-1');
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
            document.getElementById('dropdown-' + i)?.classList.remove('brightness-105');
            document.getElementById('dropdown-' + index)?.classList.remove('hover:bg-opacity-60');
            document.getElementById('dropdown-' + i)?.classList.add('hover:bg-gray-100');
        }
        // Add selection indication to the selected dropdown item.
        document.getElementById('dropdown-' + index)?.classList.add('bg-tertiary');
        document.getElementById('dropdown-' + index)?.classList.add('brightness-105');
        document.getElementById('dropdown-' + index)?.classList.remove('hover:bg-gray-100');
        document.getElementById('dropdown-' + index)?.classList.add('hover:bg-opacity-60');
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

    // Check that the date is not in the passed and not more than 100 years in the future.
    const validDate = (event: string) => {
        if (new Date(event) < new Date()) {
            setPlaceValueDate(formattedDate);
        }
        if (new Date(event).getFullYear() > new Date().getFullYear() + 101) {
            setPlaceValueDate(formattedDate);
        }
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
        // Check for a max length and clip it.
        if (event.target.value.length > 1000) {
            event.target.value = event.target.value.slice(0, 1000);
        }
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
            setValueVolNum('0');
            return;
        }
        // Get the new value from the input field.
        const newValue = event.target.value;
        // Check if the input is negative.
        if (newValue.charAt(0) === '-') {
            setValueVolNum('0');
            return;
        }
        let checkZero = newValue;
        if (newValue.charAt(0) === '0' && newValue.length > 1) {
            checkZero = newValue.slice(1);
        }
        // Validate if the input is less than 3 digits before updating the state.
        if (checkZero.length > 3) {
            setValueVolNum('null');
            setValueVolNum(checkZero.slice(0, 3));
        } else {
            setValueVolNum(checkZero);
        }
        // Check if the required fields are filled for event submission.
        validateSubmit();
    }

    // Update the tags value when the user types in the tags input field.
    const updateValueTags = (event: React.ChangeEvent<HTMLInputElement>) => {
        let checkLen = event.target.value.replace(/#/g, '');
        let change = event.target.value.length - checkLen.length;
        if (checkLen.length > 100) {
            event.target.value = event.target.value.slice(0, 100 + change);
        }
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
            // Get event ID for event update.
            const url = window.location.href;
            const eventID = url.split('=')[1];
            // Create the event info object with the required fields.
            const eventInfo = {
                id: eventID,
                name: valueName,
                description: valueDescription,
                start_time: new Date(valueDate + " " + valueStartTime),
                end_time: new Date(valueDate + " " + valueEndTime),
                tags: valueTags.split(' '),
                address: valueAddress,
                city: formattedLocation,
                recurring: valueRecurring,
                online: valueOnline,
                token_bounty: 100,
                number_of_spots: parseInt(valueVolNum),
                coordinates: valueCoordinates,
            };
            // Call the API to update the event.
            const data = JSON.stringify(eventInfo);
            const res = await fetch('/api/events/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data,
            });
            // Get the response element and show it.
            let response = document.getElementById('response') as HTMLInputElement;
            response.textContent = "Updating event...";
            response.classList.remove('opacity-0');
            response.classList.remove('h-0');
            response.classList.remove('mb-0');
            response.classList.add('mb-6');
            const submitButton = document.getElementById('submit') as HTMLInputElement;
            // Log the response and redirect to the events page if successful.
            if (!res) {
                response.textContent = "Event update failed. Please try again.";
                response.classList.remove('text-secondary');
                response.classList.add('text-primary');
                lock = false;
                submitButton.disabled = false;
            } else if (res.ok) {
                console.log("Successfully updated event.")
                const eventData = await res.json();
                window.location.href = "/my-events";
            } else {
                response.textContent = "Event update failed. Please try again.";
                response.classList.remove('text-secondary');
                response.classList.add('text-primary');
                lock = false;
                submitButton.disabled = false;
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
        if (valueVolNum === '0' || valueVolNum === 'null') {
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

    // Show the finished event view when the event is closed.
    const showFinishedEvent = () => {
        // Hide the required field message and change the date input to text (hides the calender image).
        document.getElementById('reqField')?.classList.remove('opacity-80');
        document.getElementById('reqField')?.classList.add('opacity-0');
        const dateElement = document.getElementById('DateInput') as HTMLInputElement;
        dateElement.type = 'text';
        // Show the close event box and disable the edit event box.
        document.getElementById('editEventBox')?.classList.add('opacity-30');
        document.getElementById('editEventBox')?.classList.add('pointer-events-none');
        document.getElementById('closeEventBox')?.classList.remove('h-0');
        document.getElementById('closeEventBox')?.classList.remove('border-0');
        document.getElementById('closeEventBox')?.classList.add('border-4');
    }

    // Lock the close event button and prevent multiple submissions, then close the event.
    const lockAndClose = () => {
        // Set the close button to disabled.
        const submitButton = document.getElementById('closeEvent') as HTMLInputElement;
        submitButton.disabled = true;
        // Return if the lock is true.
        if (lock) {
            return;
        }
        // Otherwise set the lock to true, close the event, and set a timeout to unlock the button.
        lock = true;
        closeEvent();
    }

    // Close the event and mark it as complete in the API.
    const closeEvent = async () => {
        // Get the event ID from the URL.
        const url = window.location.href;
        const eventID = url.split('=')[1];
        // Call the API to close the event.
        const res = await fetch('/api/organizations/complete-event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ eventID: eventID }),
        });
        const submitButton = document.getElementById('closeEvent') as HTMLInputElement;
        // Log the response and redirect to the my events page if successful.
        if (!res) {
            lock = false;
            submitButton.disabled = false;
            console.log("An error occurred. Please try again.");
        } else if (res.ok) {
            console.log("Successfully closed event.")
            window.location.href = "/my-events";
        } else {
            lock = false;
            submitButton.disabled = false;
            console.log(res)
            console.log("Rejected event closure. Please try again.")
        }
    }

    return (
        <div id="bodyBox" className="flex flex-1 flex-col items-center bg-white w-full pb-12 pt-4">

            <div id="bodyContainer" className="flex flex-col w-10/12">

                <p id="title" className="text-left font-display font-bold text-tertiary brightness-90 text-3xl mt-16 pl-6">Edit Event</p>
                <p id="subTitle" className="font-display text-secondary font-bold text-4xl max-w-xs sm:max-w-full md:max-w-2xl md:text-6xl lg:max-w-full mb-12 pl-6">Host the future of giving back.</p>

                <div id="editEventBox" className="flex flex-col items-center border-4 rounded-lg border-primary bg-secondary bg-opacity-5">

                    <div id="reqFieldContainer" className="w-5/6 h-fit mt-8">
                        <h3 id="reqField" className="font-semibold text-end text-lg !text-secondary opacity-80">Required Field <span className="text-primary">*</span></h3>
                    </div>

                    <div id="eventNameContainer" className="flex justify-evenly w-full mt-4">
                        <div id="eventNameSubContainer" className="flex flex-col w-5/6">
                            <label htmlFor="NameInput" className=" text-lg pl-4 text-secondary">Event Name <span className="text-primary">*</span></label>
                            <input id="NameInput" onChange={(e) => updateNameHandler(e)} value={valueName} className="rounded-lg border-2 border border-[#EAEAEA] text-gray-800 sm:text-lg text-ellipsis pl-6 " placeholder="Enter Your Event Name"></input>
                        </div>
                    </div>

                    <div id="locationContainer" className="flex justify-evenly w-full pt-12">

                        <div id="addressSubContainer" className="flex flex-col w-1/3 min-w-36 sm:min-w-52 pl-6 mb:pl-0 mb:ml-12 md:ml-16 md:px-0 md:pr-8">
                            <label htmlFor="PositionInput" className="text-lg pl-2 w-full mb:ml-4 text-secondary">Location <span className="text-primary">*</span></label>
                            <input id="PositionInput" onChange={(e) => updateLocationHandler(e)} value={valueLocation} className="rounded-lg border-2 border border-[#EAEAEA] text-gray-800 text-sm sm:text-lg min-w-32 pl-3 mb:pl-4 mb:ml-2" placeholder="Event Address"></input>
                        </div>

                        <div id="locationDropDownContainer" className="flex flex-col w-1/2 px-4 sm:px-0 sm:mx-8 mb:mx-12 md:m-0 md:px-8 lg:pl-16">
                            <label htmlFor="AddressInput" className="text-lg pl-3 mb:pl-4 text-secondary">Address <span className="text-primary">*</span></label>
                            <button type="button" className="inline-flex justify-center gap-x-1.5 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 bg-white hover:bg-gray-200 font-semibold text-gray-900 text-sm sm:text-lg py-2.5 px-6 w-full "
                                id="menu-button" aria-expanded="true" aria-haspopup="true" onClick={showAddresses}>
                                {addressButtonValue}
                                <svg id="dropDownFormatting" className="-mr-1 h-8 w-8 my-auto text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                </svg>
                            </button>

                            <div id="addressDropdown" className="z-10 rounded-md shadow-lg ring-black ring-opacity-5 divide-y-1 divide-gray-300 bg-white focus:outline-none w-11/12 mt-2 mx-auto overflow-hidden h-0 ring-0" aria-orientation="vertical" aria-labelledby="menu-button">
                                <div className="p-1 hover:bg-gray-100 overflow-hidden" id="dropdown-1" onClick={() => setAddress(1)}>
                                    <button className="block text-gray-700 text-md truncate w-full px-4 py-2" id="menu-item-1">1</button>
                                </div>
                                <div className="py-1 hover:bg-gray-100" id="dropdown-2" onClick={() => setAddress(2)}>
                                    <button className="block text-gray-700 text-md truncate w-full px-4 py-2" id="menu-item-2">2</button>
                                </div>
                                <div className="py-1 hover:bg-gray-100" id="dropdown-3" onClick={() => setAddress(3)}>
                                    <button className="block text-gray-700 text-md truncate w-full px-4 py-2 " id="menu-item-3">3</button>
                                </div>
                                <div className="py-1 hover:bg-gray-100" id="dropdown-4" onClick={() => setAddress(4)}>
                                    <button className="block text-gray-700 text-md truncate w-full px-4 py-2 " id="menu-item-4">4</button>
                                </div>
                                <div className="py-1 hover:bg-gray-100" id="dropdown-5" onClick={() => setAddress(5)}>
                                    <button className="block text-gray-700 text-md truncate w-full px-4 py-2 " id="menu-item-5">5</button>
                                </div>
                            </div>

                        </div>

                    </div>

                    <div id="dateTimeContainer" className="flex flex-col sm:flex-row justify-evenly items-center w-full">

                        <div className="flex flex-col w-4/5 sm:w-1/3 sm:min-w-40 mt-8">
                            <label htmlFor="DateInput" className="text-lg pl-2 mb:pl-4 text-secondary">Date <span className="text-primary">*</span></label>
                            <input type="date" id="DateInput" onChange={(e) => formatDate(e.target.value)} onBlur={(e) => validDate(e.target.value)} className="rounded-lg text-center border-2 border border-[#EAEAEA] font-semibold text-gray-800 text-sm sm:text-base min-w-34 sm:px-3 md:px-6" value={valueDate}></input>
                        </div>

                        <div className="flex flex-col w-4/5 mt-8 sm:w-min lg:w-1/3">
                            <label htmlFor="timeInput" className=" text-lg pl-2 mb:pl-4 text-secondary">Time <span className="text-primary">*</span></label>
                            <div className="bg-white flex flex-row w-full p-0.5 rounded-lg border-2 border border-[#EAEAEA]">
                                <input type="time" id="startTime" onChange={(e) => updateStartTimeHandler(e)} value={valueStartTime} className="border-0 m-auto font-semibold text-gray-800 text-sm sm:text-base sm:p-2 md:px-3" placeholder="12:00"></input>
                                <h1 className="text-xl sm:text-2xl mt-0.5 ">-</h1>
                                <input type="time" id="endTime" onChange={(e) => updateEndTimeHandler(e)} value={valueEndTime} className="border-0 m-auto font-semibold text-gray-800 text-sm sm:text-base sm:p-2 md:px-3" placeholder="23:59"></input>
                            </div>
                        </div>

                    </div>

                    <div id="spotsAndCheckboxContainer" className="flex flex-col items-center justify-center md:flex-row md:justify-evenly w-full mt-8">
                        <div id="subSpotsAndCheckboxContainer" className="flex w-full justify-between md:w-4/5 mt-10 md:mt-0 mb-4">

                            <div id="" className="flex flex-col w-1/3 sm:min-w-36 ml-6 mb:ml-16 md:ml-6 md:pt-4">
                                <label htmlFor="SpotsInput" className="pl-2 sm:pl-4 text-lg mb:min-w-36 text-secondary">Available Spots <span className="text-primary">*</span></label>
                                <input type="number" id="SpotsInput" value={valueVolNum} onClick={handleInputClickVolNum} onChange={handleInputChangeVolNum} onBlur={handleInputBlurVolNum} className=" text-center rounded-lg border-2 border border-[#EAEAEA] font-semibold text-gray-800 text-xl sm:text-2xl sm:min-w-40 pl-6" placeholder={placeholderVolNum}></input>
                            </div>

                            <div className="flex flex-col rounded-lg border-4 border-secondary border-opacity-80 w-32 h-20 md:w-36 md:h-24 mt-4 mr-4 sm:mr-16 mb:mr-10 md:pt-1">

                                <div className="w-full mt-2 ml-2">
                                    <input id="VirtualInput" type="checkbox" checked={valueOnline} onChange={(e) => setValueOnline((e.target as HTMLInputElement).checked)}
                                        className="mb-1 before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-secondary transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-secondary before:opacity-0 before:transition-opacity checked:border-primary checked:bg-primary before:bg-secondary hover:before:opacity-10 focus:ring-tertiary focus:border-tertiary focus:checked:ring-tertiary hover:checked:border-tertiary hover:checked:bg-tertiary focus:checked:bg-tertiary focus:checked:brightness-90 hover:checked:brightness-90" />
                                    <label className="cursor-pointer select-none font-semibold text-secondary md:text-xl mt-px pl-2 " htmlFor="VirtualInput">
                                        Virtual
                                    </label>
                                </div>

                                <div className="w-full mt-2 ml-2">
                                    <input id="RecurringInput" type="checkbox" checked={valueRecurring} onChange={(e) => setValueRecurring((e.target as HTMLInputElement).checked)}
                                        className="mb-1 before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-secondary transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-secondary before:opacity-0 before:transition-opacity checked:border-primary checked:bg-primary before:bg-secondary hover:before:opacity-10 focus:ring-tertiary focus:border-tertiary focus:checked:ring-tertiary hover:checked:border-tertiary hover:checked:bg-tertiary focus:checked:bg-tertiary focus:checked:brightness-90 hover:checked:brightness-90" />
                                    <label className="cursor-pointer select-none font-semibold text-secondary md:text-xl mt-px pl-2" htmlFor="RecurringInput">
                                        Recurring
                                    </label>
                                </div>

                            </div>

                        </div>
                    </div>

                    <div className="flex justify-evenly w-full pt-2">
                        <div className="flex flex-col w-4/5">
                            <label htmlFor="DescriptionInput" className=" text-lg pl-4 text-secondary">Description <span className="text-primary">*</span></label>
                            <textarea id="DescriptionInput" rows={6} onChange={(e) => updateDescriptionHandler(e)} value={valueDescription} className="rounded-lg border-2 border border-[#EAEAEA] font-semibold text-gray-800 max-h-44 min-h-36 pl-3"></textarea>
                        </div>
                    </div>

                    <div className="flex justify-evenly w-full mt-8">
                        <div className="flex flex-col w-4/5">
                            <label htmlFor="TagsInput" className="text-lg pl-4 text-secondary">Tags</label>
                            <input id="TagsInput" value={valueTags} onInput={updateValueTags} onBlur={(e) => formatValueTags(e.target.value)} className="rounded-lg border-2 border border-[#EAEAEA] font-semibold text-primary pl-3" placeholder="Enter tags related to your event ..."></input>
                        </div>
                    </div>

                    <div className="flex justify-evenly w-full mb-8 mt-12">
                        <Link href="/" className="w-1/5 "><button className="rounded-md bg-secondary bg-opacity-60 font-semibold text-white text-md focus:outline-none hover:opacity-80 transition-all duration-300 h-12 w-full">Cancel</button></Link>
                        <button id="submit" onClick={lockAndSubmit} className="rounded-md bg-primary text-md text-white focus:outline-none font-semibold hover:opacity-80 !bg-[#E5E5E5] text-[#BDBDBD] h-12 w-1/5 cursor-not-allowed">Submit</button>
                    </div>
                    <div className="flex margin-auto w-fill">
                        <p id="response" className="text-center text-secondary font-display font-bold text-2xl opacity-0 h-0">Password Reset.</p>
                    </div>

                </div>

                <div id="closeEventBox" className=" absolute  flex flex-col items-center rounded-lg border-primary bg-gray-50 w-5/6 mt-56 sm:mt-48 md:mt-64 lg:mt-52 overflow-hidden h-0 border-0">
                    <div className="w-5/6 h-fit mt-8">
                        <p className="text-center font-display font-bold text-4xl md:text-5xl xl:text-6xl !text-secondary">
                            This event has ended.
                        </p>
                        <p className="text-center font-display font-bold text-2xl md:text-3xl xl:text-4xl !text-secondary mt-4">
                            Close the event to mark it as complete.
                        </p>
                        <h3 className="text-center font-display italic text-lg xl:text-2xl !text-secondary opacity-60 mt-8">
                            *This will allocate the token bounty <span className="md:hidden"><br></br></span> to the volunteers.*
                        </h3>
                    </div>
                    <div className="flex justify-evenly w-full mb-8 mt-12">
                        <Link href="/my-events" className="w-1/3 md:w-1/5"><button className="rounded-md bg-secondary bg-opacity-60 font-semibold text-md text-white focus:outline-none hover:opacity-80 transition-all duration-300 h-12 w-full ">Cancel</button></Link>
                        <button id="closeEvent" onClick={lockAndClose} className="rounded-md bg-primary font-semibold text-md text-white focus:outline-none hover:opacity-80 h-12 w-1/3 md:w-1/5">Close Event</button>
                    </div>
                </div>

            </div>
        </div>
    );
}
