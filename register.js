// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6sfkVzCViS8Gcr6PbXqmz_QQbNe4WuHk",
  authDomain: "authentication-ee0e7.firebaseapp.com",
  projectId: "authentication-ee0e7",
  storageBucket: "authentication-ee0e7.firebasestorage.app",
  messagingSenderId: "341152202948",
  appId: "1:341152202948:web:c8f35276cdb56035fbc991"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//inputs
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;


const submit = document.getElementById('submit');
submit.addEventListener("click",function(event) {
    event.preventDefault(); //when refreshing page
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const submit = document.getElementById('submit');

    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    alert("New user Logged in");
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
  });

})

