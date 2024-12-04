import {
  browserSessionPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import firebase_app from "../config";
import { FirebaseError } from "firebase/app";
import { signIn } from "next-auth/react";

const signin = async (
  email: string,
  password: string
): Promise<User | string> => {
  const auth = getAuth(firebase_app);

  try {
    // sigin to next auth
    await signIn("credentials", { redirect: false, email, password });

    // sigin to firebase auth
    await setPersistence(auth, browserSessionPersistence);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (!userCredential.user) {
      throw new Error("Credential compromised !");
    }

    return userCredential.user;
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
        case "auth/invalid-credential":
          return "auth/invalid-credential";
        default:
          return "Unknown Firebase Authentication";
      }
    } else {
      // Handle non-Firebase errors
      return "An unknown error occurred";
    }
  }
};

export default signin;
