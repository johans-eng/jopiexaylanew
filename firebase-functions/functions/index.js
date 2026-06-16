const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendPush = functions.firestore
  .document("messages/{id}")
  .onCreate(async (snap) => {
    const data = snap.data();

    const userDoc = await admin.firestore()
      .collection("users")
      .doc(data.to)
      .get();

    const token = userDoc.data()?.fcmToken;

    if (!token) return;

    return admin.messaging().send({
      token,
      notification: {
        title: "❤️ New message",
        body: data.text
      }
    });
  });