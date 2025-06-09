// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA05oHeUCXb9KGF56pUxJOCfWDyionlwWc",
    authDomain: "story-weaver-backend.firebaseapp.com",
    projectId: "story-weaver-backend",
    storageBucket: "story-weaver-backend.firebasestorage.app",
    messagingSenderId: "6756095825",
    appId: "1:6756095825:web:dd516d5e7d60276e76e570",
    measurementId: "G-4DQRCL96HZ"
  };

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { auth };
