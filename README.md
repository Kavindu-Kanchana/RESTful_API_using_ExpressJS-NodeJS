# University Timetable Management System RESTful API

This project implements a RESTful API for managing a university's timetable system. It facilitates the creation, modification, and quering of class shedules for students, faculty and administrative staff. 

## Objectives

- Develop a RESTful API using Express JS (Node.js).
- Use MongoDB to store and manage data.
- Implement secure authentication and authorization mechanisms.
- Apply best practises of Software Development.

## Features

1. **User Roles and Authentication**
    * Define multiple user roles (Admin, Faculty and Student).
    * Different access levels.
    * Secure login functionality and session management using JWT.

2. **Course Management**
    * Allow Create, Read, Update, Delete on courses.
    * Different access levels.
    * Includes course name, code, description and credits.
    * Enables admins to assign Faculty to courses.

3. **Timetable Management**
    * Allow Create, Update, Delete on timetables.
    * Different access levels.
    * Includes course, date, time, faculty and location.

4. **Room and Resource Booking**
    * Allow Creation of Rooms for Admins.
    * Different access levels.
    * Can book a room, update and delete bookings.

5. **Student Enrollment**
    * Allow Students to enroll on courses.
    * Different access levels.
    * Can get current enrollment for students.
    * Admin and Faculty can view, update and delete student enrollments.

6. **Notifications and Alerts**
    * Allow send relevant notifications to users.
    * Different access levels.
    * Can view user's personal notifications and remove them.
    * Admin can manage all notifications.
    * Faculty can manage their and Student's notifications.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- JWT for authentication
- bcryptjs for hashing
- dotenv for .env
- winston for logging purposes

# Installation

- Clone this repository or downloads it
- Install dependencies using "npm install"
- Setup environment variables by creating a ".env" file.
- Define "PORT,JWT_SECRET,MONGODB_URI" inside the .env
- Start the server by using "node server.js"

# Testing

- This project was manually tested using Postman.
- All the endpoints are tested using Postman, and there are no errors in them.

# Contribution

- This project was created by Kavindu Kanchana