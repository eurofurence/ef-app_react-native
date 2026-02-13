import { initializeApp } from 'firebase/app'

import {
  firebaseApiKey,
  firebaseAppId,
  firebaseAuthDomain,
  firebaseDatabaseUrl,
  firebaseMeasurementId,
  firebaseMessagingSenderId,
  firebaseProjectId,
  firebaseStorageBucket,
} from '../configuration'

// Initialize Firebase
const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  databaseURL: firebaseDatabaseUrl,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId,
  measurementId: firebaseMeasurementId,
}

/**
 * Firebase web app config. Only used on web, as react-native-firebase does not
 * integrate with web deployment.
 */
export const firebaseApp = initializeApp(firebaseConfig)
