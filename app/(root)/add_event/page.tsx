"use client";
import React, { useState, useEffect } from "react";
import "../../globals.css";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// TODO: Test without and remove
// let load = 0;
// let orgID = "";

export default function Add_Event() {

    const { data: session, status } = useSession();
    const router = useRouter();

    const isOrganization = session?.accountType.toLowerCase() === "organization";

    useEffect(() => {
        if (!session || status !== "authenticated" || !isOrganization) router.push("/login");
    }, [session, status, router, isOrganization]);

    // TODO: Test without this function and remove
    // const validateUser = async () => {
    //     const userID = session?.user.id;
    //     const res = await fetch('/api/organizations/find-by-user?userID=' + userID, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     });
    //     const data = await res.json();
    //     orgID = data.id;
    // }

    // // Only check the organizationID once.
    // if (load === 0) {
    //     validateUser();
    //     load = 1;
    // }

    // Removed Fields
    // const [valueSupervisor, setValueSupervisor] = useState<string>('');
    // const [valuePosition, setValuePosition] = useState<string>('');
    // const [placeholderPhone, setPlaceValuePhone] = useState<string>('123 - 456 - 7890');
    // const [valuePhone, setValuePhone] = useState<string>('');

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const [valueDate, setPlaceValueDate] = useState<string>(formattedDate);
    const [placeholderVolNum, setPlaceValueVolNum] = useState<string>('0');
    const [valueVolNum, setValueVolNum] = useState<number>(0);
    const [valueTags, setTagsValue] = useState<string>('');
    const [valueName, setValueName] = useState<string>('');
    const [valueAddress, setValueAddress] = useState<string>('');
    const [valueLocation, setValueLocation] = useState<string>('');
    const [valueCoordinates, setValueCoordinates] = useState<string>('');
    const [addressButtonValue, setAddressButtonValue] = useState<string>('Search for a Location');
    const [searchValue, setSearchValue] = useState('');
    const [valueStartTime, setValueStartTime] = useState<string>('');
    const [valueEndTime, setValueEndTime] = useState<string>('');
    const [valueRecurring, setValueRecurring] = useState<boolean>(false)
    const [valueOnline, setValueOnline] = useState<boolean>(false)
    const [valueDescription, setValueDescription] = useState<string>('');
    const [searchData, updateSearchData] = useState('');
    let showAddress = false;

    const updateNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValueName(event.target.value);
        validateSubmit();
    }

    const updateLocationHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
        setValueLocation(event.target.value);
        if (event.target.value.length > 4) {
            setAddressButtonValue('Select an Address');
            handleSearch();
        } else {
            updateSearchData('');
            setAddressButtonValue('Search for a Location');
            document.getElementById('addressDropdown')?.classList.add('h-0');
            document.getElementById('addressDropdown')?.classList.add('ring-0');
            showAddress = false;
        }
        validateSubmit();
    }

    const handleSearch = () => {
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchValue}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`)
            .then((response) => response.json())
            .then((data) => {
                updateSearchData(data.features);
                console.log(data)
                for (let i = 1; i <= 5; i++) {
                    const menuItem = document.getElementById('menu-item-' + i);
                    if (menuItem) {
                        menuItem.textContent = (data.features[i - 1] as any).place_name;
                    }
                }
            })
            .catch((error) => {
                console.error('Error fetching geocoding API:', error);
            });
    };

    const showAddresses = () => {
        if (searchData.length > 0 && !showAddress) {
            document.getElementById('addressDropdown')?.classList.remove('h-0');
            document.getElementById('addressDropdown')?.classList.add('ring-1');
            showAddress = true;
        } else {
            document.getElementById('addressDropdown')?.classList.add('h-0');
            document.getElementById('addressDropdown')?.classList.remove('ring-1');
            showAddress = false;
        }
    }

    const setAddress = (index: number) => {
        for (let i = 1; i <= 5; i++) {
            document.getElementById('dropdown-' + i)?.classList.remove('bg-tertiary');
        }
        document.getElementById('dropdown-' + index)?.classList.add('bg-tertiary');
        setValueCoordinates((searchData[index - 1] as any).center);
        setValueLocation((searchData[index - 1] as any).place_name);
        setValueAddress((searchData[index - 1] as any).place_name);
        setTimeout(() => {
            document.getElementById('addressDropdown')?.classList.add('h-0');
            document.getElementById('addressDropdown')?.classList.remove('ring-1');
            showAddress = false;
        }, 150);
        validateSubmit();
    }

    const updateStartTimeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValueStartTime(event.target.value);
        validateSubmit();
    }

    const updateEndTimeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValueEndTime(event.target.value);
        validateSubmit();
    }

    const updateDescriptionHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValueDescription(event.target.value);
        validateSubmit();
    }

    const handleInputClickVolNum = () => {
        // Clear the placeholder value when the user clicks on the input field
        setPlaceValueVolNum('');
    };

    const handleInputBlurVolNum = () => {
        if (placeholderVolNum !== '') return;
        // Reset the placeholder value when the user clicks outside the input field
        setPlaceValueVolNum('0');
    }

    const handleInputChangeVolNum = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        validateSubmit();
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

    const formatDate = (event: string) => {
        if (event.length == 11) {
            event = event.slice(0, 4) + event.slice(5, 11);
        }
        if (event.length == 12) {
            event = event.slice(0, 4) + event.slice(6, 12);
        }
        setPlaceValueDate(event);
        validateSubmit();
    }

    // // Deprecated as phone number moved to user info
    // const handleInputClickPhone = () => {
    //     // Clear the placeholder value when the user clicks on the input field
    //     setPlaceValuePhone('');
    // };

    // const handleInputBlurPhone = () => {
    //     if (placeholderPhone !== '') return;
    //     // Reset the placeholder value when the user clicks outside the input field
    //     setPlaceValuePhone('123 - 456 - 7890');
    // }

    // const formatPhone = (event: string) => {
    //     // Check for a valid phone number with extra digits at the end
    //     if (event.length > 16) {
    //         const correctLen = event.slice(0, 16);
    //         event = correctLen;
    //     }
    //     // Remove all non-numeric characters from the input value
    //     const cleaned = event.replace(/\D/g, '');
    //     // Apply formatting based on the cleaned value
    //     const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    //     if (match) {
    //         // Check if all digits are entered, otherwise, return formatted string with only entered digits
    //         event = match[1] ? '(' + match[1] + (match[2] ? ') ' + match[2] + (match[3] ? ' - ' + match[3] : '') : '') : '';
    //     } else {
    //         event = ''
    //     }
    //     setValuePhone(event);
    // }

    const submitEvent = async () => {
        let splitAddress = valueAddress.split(',');
        let formattedLocation = splitAddress[0] + ', ' + splitAddress[1];
        for (let i = 2; i < splitAddress.length; i++) {
            if (i + 2 < splitAddress.length) {
                formattedLocation = formattedLocation + splitAddress[i] + ', ';
            }
        }
        if (validateSubmit()) {
            // Removed Elements:
            // - valuePosition
            // - valueSupervisor
            // - valuePhone
            const eventInfo = {
                name: valueName,
                description: valueDescription,
                start_time: valueDate + " " + valueStartTime,
                end_time: valueDate + " " + valueEndTime,
                // TODO: Test without and remove
                // organization_id: orgID,
                tags: valueTags.split(' '),
                address: valueAddress,
                city: formattedLocation,
                coordinates: valueCoordinates,
                recurring: valueRecurring,
                online: valueOnline,
                token_bounty: 100,
                number_of_spots: valueVolNum,
            };
            const data = JSON.stringify(eventInfo);
            const res = await fetch('/api/events/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data,
            });

            console.log("Response: ", res);
            if (!res) {
                console.log("An error occurred. Please try again.");
            } else if (res.ok) {
                console.log("Successfully created event.")
                const eventData = await res.json();
                console.log("Returned event: ", eventData);
                window.location.href = "/events";
            } else {
                console.log("Response: ", res)
                console.log("Rejected event creation. Please try again.")
            }
        }
    }

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
        const submitButton = document.getElementById('submit');
        if (submitButton && valid) {
            submitButton.classList.remove('!bg-[#E5E5E5]');
            submitButton.classList.remove('cursor-not-allowed');
            return true;
        }
        return false;
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
                    <div className="flex flex-col mb:flex-row justify-evenly items-center w-full">
                        <div className="flex flex-col w-4/5 mb:w-1/3 mb:min-w-40 mt-8">
                            <label htmlFor="Date" className="text-lg pl-4">Date <span className="text-primary">*</span></label>
                            <input type="date" id="Date" onChange={(e) => formatDate(e.target.value)} className="rounded-lg border-2 border border-[#EAEAEA] font-semibold text-gray-800 text-sm min-w-34 text-center mb:px-3 md:px-6 mb:text-base" value={valueDate}></input>
                        </div>
                        <div className="flex flex-col w-4/5 mt-8 mb:w-1/3 mb:min-w-44">
                            <label htmlFor="time" className=" text-lg pl-4">Time <span className="text-primary">*</span></label>
                            <div className="bg-white flex flex-row w-full rounded-lg border-2 border border-[#EAEAEA]">
                                <input type="time" id="startTime" onChange={(e) => updateStartTimeHandler(e)} className="border-0 m-auto font-semibold text-gray-800 text-sm mb:text-base" placeholder="12:00"></input>
                                <h1 className="text-xl mt-0.5 mb:text-2xl">-</h1>
                                <input type="time" id="endTime" onChange={(e) => updateEndTimeHandler(e)} className="border-0 m-auto font-semibold text-gray-800 text-sm mb:text-base" placeholder="23:59"></input>
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
                        <button id="submit" onClick={submitEvent} className="text-md h-12 w-1/5 rounded-md bg-primary text-white focus:outline-none font-semibold hover:opacity-80 !bg-[#E5E5E5] text-[#BDBDBD] cursor-not-allowed">Submit</button>
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
