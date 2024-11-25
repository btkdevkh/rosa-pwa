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
      <title>Rospot | Mot de passe oublié</title>
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
