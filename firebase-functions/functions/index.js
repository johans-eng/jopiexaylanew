const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();


// -----------------------------
// 1. SINGLE USER PUSH (MESSAGE)
// -----------------------------
exports.sendPush = functions.firestore
  .document("messages/{id}")
  .onCreate(async (snap) => {
    try {
      const data = snap.data();

      if (!data?.to || !data?.text) return null;

      const userDoc = await admin
        .firestore()
        .collection("users")
        .doc(data.to)
        .get();

      if (!userDoc.exists) return null;

      const token = userDoc.data()?.fcmToken;

      if (!token) return null;

      return admin.messaging().send({
        token,
        notification: {
          title: "❤️ New message",
          body: data.text,
        },
        webpush: {
          fcmOptions: {
            link: "https://your-domain.com",
          },
        },
      });
    } catch (error) {
      console.error("sendPush error:", error);
      return null;
    }
  });


// -----------------------------
// 2. MULTI USER PUSH (MEMORIES)
// -----------------------------
exports.sendMemoryNotification = functions.firestore
  .document("memories/{id}")
  .onCreate(async (snap) => {
    try {
      const data = snap.data();
      if (!data?.sender) return null;

      const tokensSnap = await admin.firestore().collection("tokens").get();

      const tokens = tokensSnap.docs
        .map((doc) => doc.data()?.token)
        .filter((token) => typeof token === "string" && token.length > 0);

      if (tokens.length === 0) return null;

      // remove sender duplicates if needed
      const filteredTokens = tokens;

      return admin.messaging().sendEachForMulticast({
        tokens: filteredTokens,
        notification: {
          title: "📸 New Memory!",
          body: "Someone added a new photo ❤️",
        },
        webpush: {
          fcmOptions: {
            link: "https://your-domain.com",
          },
        },
      });
    } catch (error) {
      console.error("sendMemoryNotification error:", error);
      return null;
    }
  });