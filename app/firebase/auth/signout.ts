import { getAuth, signOut } from "firebase/auth";
import firebase_app from "../config";
import { signOut as signOutFromNextAuth } from "next-auth/react";

const signout = async () => {
  try {
    // signout from next auth
    await signOutFromNextAuth();

    // signout from firebase auth
    await signOut(getAuth(firebase_app));
  } catch (error) {
    console.log("Error :", error);
  }
};

export default signout;
