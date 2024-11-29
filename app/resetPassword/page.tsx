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

      <div className="container mx-auto">
        <p>
          Veuillez saisir votre adresse e-mail. S&apos;il existe un compte
          associé à cette adresse, vous recevrez un mail pour réinitialiser
          votre mot de passe.
        </p>

        <br />

        <form className="w-full" onSubmit={handleSubmit}>
          <div className="w-full mx-auto">
            <p className="font-bold mb-2">
              Adresse e-mail <span className="text-error">*</span>
            </p>
            <label className="input input-primary border-txton2 flex items-center gap-2 bg-background rounded-md h-10 p-2">
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
                <button className="btn btn-sm bg-primary w-full border-none text-txton3 hover:bg-primary h-10 rounded-md">
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
