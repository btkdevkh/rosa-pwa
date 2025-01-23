import { db } from "@/app/lib/db";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebase_app from "@/app/firebase/config";
import { UserDetails } from "@/app/models/interfaces/UserDetails";

const auth = getAuth(firebase_app);

const authOptions: AuthOptions = {
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
          .then(async res => {
            const user = await db.utilisateurs.findFirst({
              where: {
                uid_firebase: res.user.uid,
              },
            });

            return {
              id_user_postgres: user?.id,
              name: res.user.uid,
              email: res.user.email,
            };
          })
          .catch(err => {
            const errorCode = err.code;
            throw new Error(errorCode);
          });

        return result as UserDetails;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (token.id_user_postgres) {
        // @todo: give a type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session as any).user.id_user_postgres = token.id_user_postgres;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user && "id_user_postgres" in user) {
        token.id_user_postgres = user.id_user_postgres;
      }
      return token;
    },
  },
};

export default authOptions;
