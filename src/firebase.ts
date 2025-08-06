import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration for Diako Travel Connect
// NOTE: Update these values in a `.env` file for security when deploying.
const firebaseConfig = {
  apiKey: "AIzaSyAGzwqfAEJLJSakQjbhbyn3Tf0HN7-KLAo",
  authDomain: "diako-9f413.firebaseapp.com",
  projectId: "diako-9f413",
  storageBucket: "diako-9f413.appspot.com", // corrected bucket domain
  messagingSenderId: "839499626614",
  appId: "1:839499626614:web:79d3410423ea01ed74c757",
  measurementId: "G-SNSSW9W72Y"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase services used in this project.
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

/**
 * Initialize a reCAPTCHA verifier for phone number authentication.
 * Provide a container ID to attach the invisible widget. You can
 * optionally configure size and callback in your signup/login pages.
 */
export const initRecaptcha = (containerId: string) => {
  return new RecaptchaVerifier(containerId, { size: "invisible" }, auth);
};
