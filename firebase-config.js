import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDmx77LIC4QnN9W8DkSbjJ3o8TfqgUVtWk",
    authDomain: "penis-78223.firebaseapp.com",
    databaseURL: "https://penis-78223-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "penis-78223",
    storageBucket: "penis-78223.firebasestorage.app",
    messagingSenderId: "30650501218",
    appId: "1:30650501218:web:5dad5e8573df8826f4a93b"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };