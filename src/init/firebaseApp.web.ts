import { initializeApp } from "firebase/app";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCF365l8zUac096MFPLUtbPE6sqH182G2Q",
    authDomain: "eurofurence-de86f.firebaseapp.com",
    databaseURL: "https://eurofurence-de86f.firebaseio.com",
    projectId: "eurofurence-de86f",
    storageBucket: "eurofurence-de86f.appspot.com",
    messagingSenderId: "1003745003618",
    appId: "1:1003745003618:web:6eca6a1ec8f5d5bfe9e93b",
    measurementId: "G-83EP75M02N",
};

/**
 * Firebase web app config. Only used on web, as react-native-firebase does not
 * integrate with web deployment.
 */
export const firebaseApp = initializeApp(firebaseConfig);
