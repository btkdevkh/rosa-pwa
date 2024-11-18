"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const [inputErrors, setInputErrors] = useState<LoginInfosType | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInputErrors(null);

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|io|info|biz|co|us|uk|de|fr|ca|au|in)$/;

    // Email validation
    if (!email || (email && !emailRegex.test(email))) {
      return setInputErrors(
        o =>
          ({
            ...o,
            email: "Veuillez saisir une adresse e-mail valide",
          } as LoginInfosType)
      );
    }
    if (email && email != "bunthoeun.kong@greenshield.fr") {
      return setInputErrors(
        o =>
          ({
            ...o,
            email: "Cet identifiant n’existe pas",
          } as LoginInfosType)
      );
    }

    // Password validation
    if (!password) {
      return setInputErrors(
        o =>
          ({
            ...o,
            password: "Veuillez saisir un mot de passe",
          } as LoginInfosType)
      );
    }
    if (password && password != "123") {
      return setInputErrors(
        o =>
          ({
            ...o,
            password: "Mot de passe incorrect",
          } as LoginInfosType)
      );
    }
  };

  return (
    <div className="">
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
            <label className="input flex items-center gap-2 border-txton2 bg-background rounded-md">
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

            <label className="mb-3 input input-bordered flex items-center gap-2 border-txton2 bg-background rounded-md">
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

            {/* Errors */}
            <div>
              {inputErrors && (
                <div
                  role="alert"
                  className="bg-error text-txton3 mb-1 rounded-md flex gap-1 p-2 items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                    className="text-3xl"
                  >
                    <path
                      fill="currentColor"
                      d="M12 17q.425 0 .713-.288T13 16t-.288-.712T12 15t-.712.288T11 16t.288.713T12 17m-1-4h2V7h-2zm1 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
                    />
                  </svg>
                  <span>{inputErrors.email}</span>
                  <span>{inputErrors.password}</span>
                </div>
              )}

              <button className="btn bg-primary w-full border-none text-txton3 text-lg">
                Connexion
              </button>
            </div>
          </div>

          <br />

          <div className="text-center text-blue-900">
            <Link className="underline" href="/forgetPassword">
              Mot de passe oublié ?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

type LoginInfosType = {
  email: string;
  password: string;
};
