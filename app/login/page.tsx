"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState, Suspense, useContext } from "react";
import toastSuccess from "../helpers/notifications/toastSuccess";
import { useRouter, useSearchParams } from "next/navigation";
import toastError from "../helpers/notifications/toastError";
import Loader from "../components/shared/Loader";
import { AuthContext } from "../context/AuthContext";
import signin from "../firebase/auth/signin";
import LoadingButton from "../components/shared/LoadingButton";

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
            email: "L'identifiant ou le mot de passe est invalide",
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
        <div className="container mx-auto">
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
                <label className="input input-primary flex items-center gap-2 focus-within:border-2 border-txton2 bg-background rounded-md h-10 p-2">
                  <input
                    // required
                    type="text"
                    className="grow"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </label>

                <br />

                <label className="mb-3 input input-primary flex items-center gap-2 focus-within:border-2 border-txton2 bg-background rounded-md h-10 p-2">
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
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => setSeePassword(false)}
                    >
                      <g clipPath="url(#clip0_2_291)">
                        <path
                          d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
                          fill="#2C3E50"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_2_291">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  )}

                  {!seePassword && (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => setSeePassword(true)}
                    >
                      <g clipPath="url(#clip0_5_4616)">
                        <path
                          d="M12 6.50005C14.76 6.50005 17 8.74005 17 11.5001C17 12.0101 16.9 12.5001 16.76 12.9601L19.82 16.0201C21.21 14.7901 22.31 13.2501 23 11.4901C21.27 7.11005 17 4.00005 12 4.00005C10.73 4.00005 9.51 4.20005 8.36 4.57005L10.53 6.74005C11 6.60005 11.49 6.50005 12 6.50005ZM2.71 3.16005C2.32 3.55005 2.32 4.18005 2.71 4.57005L4.68 6.54005C3.06 7.83005 1.77 9.53005 1 11.5001C2.73 15.8901 7 19.0001 12 19.0001C13.52 19.0001 14.97 18.7001 16.31 18.1801L19.03 20.9001C19.42 21.2901 20.05 21.2901 20.44 20.9001C20.83 20.5101 20.83 19.8801 20.44 19.4901L4.13 3.16005C3.74 2.77005 3.1 2.77005 2.71 3.16005ZM12 16.5001C9.24 16.5001 7 14.2601 7 11.5001C7 10.7301 7.18 10.0001 7.49 9.36005L9.06 10.9301C9.03 11.1101 9 11.3001 9 11.5001C9 13.1601 10.34 14.5001 12 14.5001C12.2 14.5001 12.38 14.4701 12.57 14.4301L14.14 16.0001C13.49 16.3201 12.77 16.5001 12 16.5001ZM14.97 11.1701C14.82 9.77005 13.72 8.68005 12.33 8.53005L14.97 11.1701Z"
                          fill="#2C3E50"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_5_4616">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  )}
                </label>

                <br />

                {loading && <LoadingButton />}
                {!loading && (
                  <div>
                    <button className="btn btn-sm bg-primary w-full border-none text-txton3 hover:bg-primary h-10 rounded-md">
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
