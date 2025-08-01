import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Initialize Firebase
const app = initializeApp({
  apiKey: process.env.REACT_APP_KEY_APIY_KEY,
  authDomain: process.env.REACT_APP_KEY_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_KEY_PROJECT_ID,
  storageBucket: process.env.REACT_APP_KEY_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_KEY_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP__KEY_APP_ID,
  measurementId: process.env.REACT_APP_KEY_MEASUREMENT_ID,
});

const google_auth = getAuth(app);
const db = getDatabase(app);
export { db, app, google_auth };
