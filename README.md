# Kindr - Volunteer App
> A gamified web app that connects volunteers seeking opportunities and organizations hosting events by allowing volunteers to apply for available events and organizations to create new volunteer opportunities.

View the live project [_here_](https://getkindr.com/).

## Table of Contents
* [Screenshots](#screenshots)
* [Technologies](#technologies)
* [Features](#features)
* [Acknowledgements](#acknowledgements)

## Screenshots
| ![Login Page](screenshots/login.png) | ![Home Page](screenshots/home.png) |
|:--:|:--:|
| _Login Page_ | _Home Page_ |
| ![Events Page](screenshots/events.png) | ![Event Page](screenshots/event.png) |
| _Events Page_ | _Event Page_ |
| ![Profile Page](screenshots/profile.png) | ![My Events Page](screenshots/my_events.png) |
| _Profile Page_ | _My Events Page_ |

## Technologies
- Next.js `v13.5.5`
- TypeScript
- TailwindCSS
- PostgreSQL
- Prisma
- Vercel
- JWT Authentication
- Google Maps API

## Features
- __User Authentication__: Implement JSON Web Tokens for secure user authentication and session management.
  - __Forgot Password__: Functionality for users to reset their password through a secure OTP process.
  - __Profile Management__: Users can update their profile information and change their password.
- __Event Management__: Organizations can easily create and manage their event listings.
  - __Event Details__: Comprehensive event information, including location, date, time, tags, available seats, token rewards, and description.
  - __Apply to Events__: Volunteers can browse and apply to events that match their interests and skills.
  - __Event Filtering and Sorting__: Users can filter events by name, tags, and location. Events can also be sorted by number of tokens and date.
  - __Maps Integration__: Display event locations on an interactive map using the Google Maps API.
- __Token System__: Users can earn tokens by volunteering at events and spend them on rewards.

## Acknowledgements
* [Towa Quimbayo](https://github.com/towaquimbayo)
* [Juan Escalada](https://github.com/jescalada/)
* [Maximillian Yong](https://github.com/MaximillianYong)
* [Braden Rogers](https://github.com/BRogers-BCIT)