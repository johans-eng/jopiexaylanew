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

      const userDoc = await admin.firestore()
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
          notification: {
            title: "❤️ New message",
            body: data.text,
            icon: "/icon.png",
          },
          fcmOptions: {
            link: "https://johans-eng-website-bwbf.vercel.app/",
          },
        },

        apns: {
          payload: {
            aps: {
              sound: "default",
            },
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

      const tokensSnap = await admin.firestore()
        .collection("tokens")
        .get();

      const rawTokens = tokensSnap.docs.map(doc => doc.data()?.token);

      // clean tokens
      const filteredTokens = rawTokens.filter(
        (t) => typeof t === "string" && t.length > 0
      );

      if (filteredTokens.length === 0) return null;

      const response = await admin.messaging().sendEachForMulticast({
        tokens: filteredTokens,

        notification: {
          title: "📸 New Memory!",
          body: "Someone added a new photo ❤️",
        },

        webpush: {
          notification: {
            title: "📸 New Memory!",
            body: "Someone added a new photo ❤️",
            icon: "/icon.png",
          },
          fcmOptions: {
            link: "https://johans-eng-website-bwbf.vercel.app/",
          },
        },

        apns: {
          payload: {
            aps: {
              sound: "default",
            },
          },
        },
      });

      // OPTIONAL: clean invalid tokens (VERY IMPORTANT)
      if (response?.responses) {
        const invalidTokens = [];

        response.responses.forEach((res, idx) => {
          if (!res.success) {
            invalidTokens.push(filteredTokens[idx]);
          }
        });

        if (invalidTokens.length > 0) {
          console.log("Invalid tokens:", invalidTokens);
        }
      }

      return response;

    } catch (error) {
      console.error("sendMemoryNotification error:", error);
      return null;
    }
  });