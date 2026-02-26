import { FirebaseOptions, initializeApp, getApp, getApps } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyC2pcRhcntD9xZh2XQ9AkYtzsWQiZGs0AM",
  authDomain: "traders-a113a.firebaseapp.com",
  projectId: "traders-a113a",
  storageBucket: "traders-a113a.appspot.com",
  messagingSenderId: "1095426541731",
  appId: "1:1095426541731:web:7be9cbd8bd872d499e1716"
};

// Initialize Firebase
function initializeFirebase() {
    return !getApps().length ? initializeApp(firebaseConfig) : getApp();
}

export { initializeFirebase, firebaseConfig };
