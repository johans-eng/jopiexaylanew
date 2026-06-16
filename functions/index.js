const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendMemoryNotification = functions.firestore
  .document("memories/{id}")
  .onCreate(async (snap, context) => {
    const data = snap.data();

    const tokensSnap = await admin.firestore().collection("tokens").get();

    const tokens = tokensSnap.docs.map(doc => doc.data().token);

    const message = {
      notification: {
        title: "📸 New Memory!",
        body: "Someone added a new photo ❤️"
      },
      tokens: tokens
    };

    return admin.messaging().sendMulticast(message);
  });