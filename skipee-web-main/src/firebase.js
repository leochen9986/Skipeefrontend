// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getStorage } from 'firebase/storage'
const firebaseConfig = {
  apiKey: 'AIzaSyC5mnFyx_YD-QuB47ISw82lNt4Cbx2pkoA',
  authDomain: 'skipee-ba66f.firebaseapp.com',
  projectId: 'skipee-ba66f',
  storageBucket: 'skipee-ba66f.appspot.com',
  messagingSenderId: '930105587541',
  appId: '1:930105587541:web:0ae18859a4c78e9195e1dc',
  measurementId: 'G-8VQ0H6C1KQ',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const storage = getStorage(app)

export { storage, app }
