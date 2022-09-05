# Trickle - The Social media app
(FKA itext because it was originally intended to be just a chat app but i blew it out of proportion, I'm sorry)
Side gist - The name trickle was birthed by my kid sis which represents a drop of water so the whole app plays on the name.

## DESCRIPTION
Trickle is a social media app built with the awesome tag team: __REACTJS__, __TailwindCSS__ and __Firebase__.
It leverages on React code reusablility and Firebase rapid server-side development.

ReactJS handles all the client-side functionalities like:
State Management, UI rendering, Caching and so on.

Firebase handles the server-side infastructure, such as:
Authentication, Database management, CRUD operations, Realtime client updates with database listeners, Storage etc. basically all operartions you would normally do on the backend which is super-awesome!!!

## INSTALLATION GUIDE
1. Go ahead and clone this repo to your local machine.
2. Make sure you have node installed.
3. On your command line type and run ### `npm install` to install all dependencies.
4. This project uses some environment variables so create a __.env__ file
5. When done creating your .env file, you environment variables would contain your Firebase configurations
   Create a new project on Firebase, the instruction for that is out of the scope of this, but the instrucitons firebase gives in the doc is pretty easy.
6. Now in your __.env__ file; ADD the following variables
   __REACT_APP_API_KEY__ is your apiKey
   __REACT_APP_PROJECT_ID__ is your projectId
   __REACT_APP_DATABASE_URL__ is your database URL
   __REACT_APP_STORAGE_BUCKET__ is your storageBucket
   __REACT_APP_MESSAGING_SENDER_ID__ is your messagingSenderId
   __REACT_APP_APP_ID__ is your appId
7. now RUN ### `npm start`

That is all you need to run the project 

## SOFT CAUTION
My idea of this app was for testing and fun purposes so when writing an ideal app for commercial purposes, you will want to move your CRUD operations to a cloud function on the server-side, and query by some sort of routing although this is still sufficient.
   

