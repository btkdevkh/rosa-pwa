"use client";

import { FormEvent, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
import toastError from "../helpers/notifications/toastError";
import resetPassword from "../firebase/auth/resetPassword";
import LoadingButton from "../components/LoadingButton";

const ResetPasswordPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputErrors, setInputErrors] = useState<{ email: string } | null>(
    null
  );

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
          } as { email: string })
      );
    }

    // OK, process to firebase stuff & redirect user to login
    const response = await resetPassword(email);
    setLoading(false);

    if (response === "Ok") {
      router.push("/login?reset=ok");
    }
  };

  // Confirm errors input
  useEffect(() => {
    if (inputErrors) {
      toastError(inputErrors.email, "error-email");
    }
  }, [inputErrors]);

  return (
    <>
      <Navbar title="Mot de passe oublié" back={true} />

      <div className="container">
        <p>
          Veuillez saisir l&apos;adresse e-mail associée à votre compte. Nous
          vous enverrons un mail pour réinitaliser votre mot de passe.
        </p>

        <br />

        <form className="w-full" onSubmit={handleSubmit}>
          <div className="w-full mx-auto">
            <label>
              Adresse e-mail <span className="text-error">*</span>
            </label>
            <label className="input input-primary border-txton2 flex items-center gap-2 bg-background rounded-md">
              <input
                // required
                type="text"
                className="grow"
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

            {loading && <LoadingButton />}
            {!loading && (
              <div>
                <button className="btn bg-primary w-full border-none text-txton3 text-lg hover:bg-primary">
                  Valider
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default ResetPasswordPage;
