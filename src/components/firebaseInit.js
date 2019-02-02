import firebase from 'firebase'
import 'firebase/firestore'
import firebaseConfig from './firebaseConfig'

const firebaseApp = firebase.initializeApp(firebaseConfig)
//const db = firebase.firestore()

// const setting = {
//     timestampsInSnapshots: true
// }
// db.settings(setting)

export default firebaseApp.firestore()
// export default firebaseApp