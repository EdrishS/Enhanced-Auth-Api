# Authentication-Service

JWT authentication

## Setup

node verison: v16.20.1

### DB:

Install Mongo DB Atlas,  

### Install:

npm install

### Start:

npm run dev

### /register POST

Example URL: http://localhost:3000/register

Request: JSON body

`{ "first-name: "Auth", "last-name": "Service", "username": "EdrishS", "phone": "123456789", "email":"authapi123@gmail.com", "password":"authapi123", }`

Expected response: Status 200.
