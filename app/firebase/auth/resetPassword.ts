import firebase_app from "../config";
import { FirebaseError } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const resetPassword = async (email: string): Promise<string> => {
  const auth = getAuth(firebase_app);

  try {
    await sendPasswordResetEmail(auth, email);
    return "Ok";
  } catch (error) {
    console.log("Error :", error);

    if (error instanceof FirebaseError) {
      // Handle Firebase-specific errors
      switch (error.code) {
        case "auth/invalid-email":
          return "auth/invalid-email";
        case "auth/user-disabled":
          return "auth/user-disabled";
        case "auth/user-not-found":
          return "auth/user-not-found";
        case "auth/wrong-password":
          return "auth/wrong-password";
        case "auth/too-many-requests":
          return "auth/too-many-requests";
        default:
          return "Unknown Firebase Authentication";
      }
    } else {
      // Handle non-Firebase errors
      return "An unknown error occurred";
    }
  }
};

export default resetPassword;
