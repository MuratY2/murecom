// src/app/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyB9O6U9C45ItwZnylqaYCzYIgQwdFMkje4",
  authDomain: "murecom.firebaseapp.com",
  projectId: "murecom",
  storageBucket: "murecom.firebasestorage.app",
  messagingSenderId: "750257625067",
  appId: "1:750257625067:web:a93ea5054e7123941a6bae",
  measurementId: "G-6RGW39GHS4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
