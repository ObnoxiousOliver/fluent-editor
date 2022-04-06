// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyD96WdikqgMJ8yVT03fBakNmdfWJQEAcQY',
  authDomain: 'fluent-editor.firebaseapp.com',
  projectId: 'fluent-editor',
  storageBucket: 'fluent-editor.appspot.com',
  messagingSenderId: '538636308133',
  appId: '1:538636308133:web:6951b4495e95eadbd5c74c',
  measurementId: 'G-29WXSDC792'
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
export const auth = getAuth(app)
