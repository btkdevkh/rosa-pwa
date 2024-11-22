"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState, Suspense, useContext } from "react";
import toastSuccess from "../helpers/notifications/toastSuccess";
import { useRouter, useSearchParams } from "next/navigation";
import toastError from "../helpers/notifications/toastError";
import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import signin from "../firebase/auth/signin";
import LoadingButton from "../components/LoadingButton";

type LoginInfosType = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reset_pass = searchParams.get("reset");

  const { authenticatedUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputErrors, setInputErrors] = useState<LoginInfosType | null>(null);

  // Confirm reset password message to user
  useEffect(() => {
    if (reset_pass === "ok") {
      toastSuccess("E-mail de réinitialisation envoyé", "reset-password-sent");
      router.replace("/login");
    }
  }, [reset_pass, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInputErrors(null);
    setLoading(true);

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|io|info|biz|co|us|uk|de|fr|ca|au|in)$/;

    // Email validation
    if (!email || (email && !emailRegex.test(email))) {
      setLoading(false);
      return setInputErrors(
        o =>
          ({
            ...o,
            email: "Veuillez saisir une adresse e-mail valide",
          } as LoginInfosType)
      );
    }

    // Password validation
    if (!password) {
      setLoading(false);
      return setInputErrors(
        o =>
          ({
            ...o,
            password: "Veuillez saisir un mot de passe",
          } as LoginInfosType)
      );
    }

    // Process to firebase stuff
    const response = await signin(email, password);
    setLoading(false);

    // Error from firebase auth
    if (response === "auth/invalid-email") {
      return setInputErrors(
        o =>
          ({
            ...o,
            email: "Veuillez saisir une adresse e-mail valide",
          } as LoginInfosType)
      );
    }
    if (response === "auth/user-not-found") {
      return setInputErrors(
        o =>
          ({
            ...o,
            email: "Cet identifiant n’existe pas",
          } as LoginInfosType)
      );
    }
    if (response === "auth/wrong-password") {
      return setInputErrors(
        o =>
          ({
            ...o,
            password: "Mot de passe incorrect",
          } as LoginInfosType)
      );
    }
    if (response === "auth/invalid-credential") {
      return setInputErrors(
        o =>
          ({
            ...o,
            email: "Cet identifiant n’existe pas",
          } as LoginInfosType)
      );
    }
  };

  // Confirm errors input
  useEffect(() => {
    if (inputErrors) {
      toastError(inputErrors.email, "error-email");
      toastError(inputErrors.password, "error-password");
    }
  }, [inputErrors]);

  return (
    <>
      <title>Rospot | Connexion</title>
      {!authenticatedUser && (
        <div className="container">
          <br />

          {/* Logos */}
          <div className="flex flex-col justify-center items-center gap-9">
            <Image
              src="/logo-rospot.svg"
              width={150}
              height={0}
              priority
              alt="Logo de Rospot"
            />
            <Image
              src="/title-rospot.svg"
              width={175}
              height={0}
              priority
              alt="Rospot"
            />
            <Image
              src="/logo-greenshield.svg"
              width={200}
              height={0}
              priority
              alt="Logo de Greenshield"
            />

            <form className="w-full" onSubmit={handleSubmit}>
              <div className="w-full mx-auto">
                <label className="input input-primary flex items-center gap-2 border-txton2 bg-background rounded-md">
                  <input
                    // required
                    type="text"
                    className="grow"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-5 w-5 opacity-70"
                  >
                    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                  </svg>
                </label>

                <br />

                <label className="mb-3 input input-primary flex items-center gap-2 border-txton2 bg-background rounded-md">
                  <input
                    // required
                    type={seePassword ? "text" : "password"}
                    className="grow"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />

                  {seePassword && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-5 w-5 opacity-70"
                      onClick={() => setSeePassword(false)}
                    >
                      <path
                        fill="currentColor"
                        d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"
                      />
                    </svg>
                  )}

                  {!seePassword && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-5 w-5 opacity-70"
                      onClick={() => setSeePassword(true)}
                    >
                      <path
                        fill="currentColor"
                        d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3zm-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7"
                      />
                    </svg>
                  )}
                </label>

                <br />

                {loading && <LoadingButton />}
                {!loading && (
                  <div>
                    <button className="btn bg-primary w-full border-none text-txton3 text-lg hover:bg-primary">
                      Connexion
                    </button>
                  </div>
                )}
              </div>

              <br />

              <div className="text-center text-blue-900">
                <Link className="underline" href="/resetPassword">
                  Mot de passe oublié ?
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const LoginPageWithSuspense = () => {
  return (
    <Suspense fallback={<Loader />}>
      <LoginPage />
    </Suspense>
  );
};

export default LoginPageWithSuspense;
