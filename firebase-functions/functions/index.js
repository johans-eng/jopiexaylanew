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
        body: data.text,
      },
    });
  });

exports.sendMemoryNotification = functions.firestore
  .document("memories/{id}")
  .onCreate(async (snap) => {
    const data = snap.data();
    const senderId = data.sender;

    const tokensSnap = await admin.firestore().collection("tokens").get();
    const tokens = tokensSnap.docs
      .filter((doc) => doc.id !== senderId && doc.data().token)
      .map((doc) => doc.data().token);

    if (tokens.length === 0) return;

    return admin.messaging().sendEachForMulticast({
      notification: {
        title: "📸 New Memory!",
        body: "Someone added a new photo ❤️",
      },
      tokens,
    });
  });