// Server Component : Not working on fetching data on production
// -------------------------------------------------------------

// import React, { Suspense } from "react";
// import { OptionType } from "../components/selects/SingleSelect";
// import Loading from "../components/Loading";
// import SettingPageClient from "../components/clients/settings/SettingPageClient";
// import { Exploitation } from "../models/interfaces/Exploitation";
// import { getServerSession } from "next-auth";
// import authOptions from "../api/auth/authOptions";

// // Url "/settings"
// // This page is a server component
// // that use to fetch "data" from a server (if needed)
// // and pass "data" to the client side component.
// const SettingPage = async () => {
//   const session = await getServerSession(authOptions);
//   console.log("session :", session);

//   const exploitations = await getExploitations(session?.user?.name);

//   const exploitationOptions = exploitations?.map((expl: Exploitation) => ({
//     id: expl.id,
//     value: expl.nom,
//     label: expl.nom,
//   }));

//   const userExploitations: OptionType[] = exploitationOptions ?? [];

//   return (
//     <Suspense fallback={<Loading />}>
//       <SettingPageClient exploitations={userExploitations} />
//     </Suspense>
//   );
// };

// export default SettingPage;

// const getExploitations = async (userUID?: string | null) => {
//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/api/exploitations?userUID=${userUID}`
//     );

//     if (!response.ok) {
//       throw new Error("Data fetching failed");
//     }

//     const data = await response.json();

//     return data;
//   } catch (error) {
//     return error;
//   }
// };

// ------------------------------------------------------------------------

// Client Component work on production :
"use client";

import React, { useEffect, useState } from "react";
import { OptionType } from "../components/selects/SingleSelect";
import Loading from "../components/Loading";
import SettingPageClient from "../components/clients/settings/SettingPageClient";
import { Exploitation } from "../models/interfaces/Exploitation";
import { useSession } from "next-auth/react";

const SettingPage = () => {
  const { data: session, status } = useSession(); // Use useSession hook to access session data
  console.log("session :", session);

  const [userExploitations, setUserExploitations] = useState<
    OptionType[] | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExploitations = async () => {
      if (!session?.user?.name) {
        setLoading(false);
        return;
      }

      try {
        // const response = await fetch(
        //   `${
        //     process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        //   }/api/exploitations?userUID=${session.user.name}`
        // );

        const response = await fetch(
          `http://127.0.0.1:3000/api/exploitations?userUID=${session.user.name}`
        );

        console.log("response :", response);

        if (response.ok) {
          const exploitations: Exploitation[] = await response.json();
          const exploitationOptions = exploitations.map(exploitation => ({
            id: exploitation.id,
            value: exploitation.nom,
            label: exploitation.nom,
          }));

          setUserExploitations(exploitationOptions);
        } else {
          console.error("Failed to fetch exploitations: ", response.status);
        }
      } catch (error) {
        console.error("Error fetching exploitations: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExploitations();
  }, [session]);

  if (status === "loading" || loading) {
    return <Loading />;
  }

  return <SettingPageClient exploitations={userExploitations || []} />;
};

export default SettingPage;
