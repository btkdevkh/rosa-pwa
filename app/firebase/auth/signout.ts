import { getAuth, signOut } from "firebase/auth";
import firebase_app from "../config";

const signout = async () => {
  try {
    await signOut(getAuth(firebase_app));
  } catch (error) {
    console.log("Error :", error);
  }
};

export default signout;
