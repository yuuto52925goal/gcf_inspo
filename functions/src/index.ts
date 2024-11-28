/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import {onRequest} from "firebase-functions/v2/https";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
// import {getStorage} from "firebase-admin/storage";

initializeApp();

interface requestType {
  uri: string
  uid: string
  date: string
  time: string
}

export const outFit = onRequest(async (request, response) => {
  try {
    const {uri, uid, time, date}: requestType = request.body;

    const db = await getFirestore()
      .collection(`users/${uid}/outfit`)
      .add({
        outfit: uri,
        time: time,
        date: date,
      });
    const output = `${db.id} at ${uid}`;
    response.json({result: output});
  } catch (e: unknown) {
    console.error("Error:", (e as Error).message);
    const error = e as { message: string; code?: number };
    if (error.message.includes("App Check")) {
      response.status(403).send("App Check validation error");
    } else if (error.code === 7) {
      response.status(403).send("IAM or Firestore Rules");
    } else {
      response.status(500).send("Unexpected error occurred");
    }
  }
});


