// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { ref as dbRef } from 'firebase/database';
// import { getFirestore, collection, getDocs } from 'firebase/firestore';

// const devFirebaseConfig = {
//     apiKey: "AIzaSyBSZrE_1Usz1hzZ0a9R8jpAUoRAfjidE4Y",
//     authDomain: "testing-6cabc.firebaseapp.com",
//     databaseURL: "https://testing-6cabc-default-rtdb.europe-west1.firebasedatabase.app",
//     projectId: "testing-6cabc",
//     storageBucket: "testing-6cabc.appspot.com",
//     messagingSenderId: "138583430407",
//     appId: "1:138583430407:web:a37f99093f59d28a74e1a2"
// };

// const prodFirebaseConfig = {
//     apiKey: "AIzaSyAFVIvoY9GWHRAFqWpu3XZAGuHA8etP3Mk",
//     authDomain: "slip-tangle.firebaseapp.com",
//     databaseURL: "https://slip-tangle-default-rtdb.europe-west1.firebasedatabase.app",
//     projectId: "slip-tangle",
//     storageBucket: "slip-tangle.appspot.com",
//     messagingSenderId: "745331579681",
//     appId: "1:745331579681:web:43654830fd242458fe7c60",
//     measurementId: "G-5GN8Q14M88"
// };

// const app = initializeApp(import.meta.env.VITE_ENVIRONMENT === 'development' ? devFirebaseConfig : prodFirebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// const initializeAuth = new Promise(resolve => {
//     // this adds a hook for the initial auth-change event
//     getAuth().onAuthStateChanged(user => {
//         authService.setUser(user)
//         resolve(user)
//     })
// })

// const authService = {
//     user: null,

//     authenticated () {
//       return initializeAuth.then(user => {
//         return user;
//       })
//     },

//     setUser (user) {
//       this.user = user
//     },

//     logout () {
//       getAuth().signOut().then(() => {
//         console.log('logout done')
//       })
//     }
// }

// // Function to list Firestore collections
// async function listFirestoreCollections() {
//   const collections = await dbRef(db);
//   console.log('Collections:', collections);
//   for (const collection of collections) {
//       console.log('Collection ID:', collection.id);
//   }
// }

// // Function to get data from a specific collection
// async function getDataFromCollection(collectionName) {
//     const querySnapshot = await getDocs(collection(db, collectionName));
//     querySnapshot.forEach((doc) => {
//         console.log(`${doc.id} =>`, doc.data());
//     });
// }

// export { app, auth, authService, listFirestoreCollections, getDataFromCollection };
