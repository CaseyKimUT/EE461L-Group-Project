# HaaS System

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Functionality
This is a HaaS System that allows users to access hardware resources for projects on the system using secured user accounts. 

## Deployment
Our app is being deployed through Heroku using this Github repository. Every commit into the main branch is reflected on our deployed app. 

## Database
Our app stores all user and hardware information on a MongoDB database. The app uses a Flask server to communicate with the database and send responses back to the client.

## Available Scripts

In the project directory, you can run:

### `npm install`
***Run this first***

Installs all the needed packages that the project utilizes

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `flask run`
OR `python -m flask run`

Runs the flask server which the React App communicates with.

Note: you may need to install flask first using `pip install flask`
