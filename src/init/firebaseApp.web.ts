import { initializeApp } from 'firebase/app'
import conventionConfig from '../../convention.config.json'

// Initialize Firebase
const firebaseConfig = {
    apiKey: conventionConfig.firebase.apiKey,
    authDomain: conventionConfig.firebase.authDomain,
    databaseURL: conventionConfig.firebase.authDomain,
    projectId: conventionConfig.firebase.projectId,
    storageBucket: conventionConfig.firebase.storageBucket,
    messagingSenderId: conventionConfig.firebase.messagingSenderId,
    appId: conventionConfig.firebase.appId,
    measurementId: conventionConfig.firebase.measurementId,
}

/**
 * Firebase web app config. Only used on web, as react-native-firebase does not
 * integrate with web deployment.
 */
export const firebaseApp = initializeApp(firebaseConfig)
