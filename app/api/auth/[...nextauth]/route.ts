import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebase_app from "@/app/firebase/config";

const auth = getAuth(firebase_app);

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const result = await signInWithEmailAndPassword(
          auth,
          credentials?.email as string,
          credentials?.password as string
        )
          .then(res => {
            return {
              name: res.user.uid,
              email: res.user.email,
            };
          })
          .catch(err => {
            const errorCode = err.code;
            throw new Error(errorCode);
          });

        return result as User;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
