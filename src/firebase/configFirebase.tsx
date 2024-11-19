// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Firebase Auth

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};

console.log(firebaseConfig);

// Initialize Firebase and Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize and export Firebase Auth

export { auth }; // Export only `auth` for authentication use in other files
export default app; // Export `app` if needed elsewhere