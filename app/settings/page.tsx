"use client";

import React, { useEffect, useState } from "react";
import { OptionType } from "../components/selects/SingleSelect";
import Loading from "../components/Loading";
import SettingPageClient from "../components/clients/settings/SettingPageClient";
import { Exploitation } from "../models/interfaces/Exploitation";
import { useSession } from "next-auth/react";
// import axios from "axios";

const SettingPage = () => {
  // Access connected user's infos
  const { data: session, status } = useSession();
  console.log("session :", session);

  const [userExploitations, setUserExploitations] = useState<
    OptionType[] | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExploitations = async () => {
      try {
        const userUID = session?.user?.name;

        // JS fetch api
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/exploitations?userUID=${userUID}`
        );

        if (response.ok) {
          const exploitations: Exploitation[] = await response.json();
          const exploitationOptions = exploitations.map(exploitation => ({
            id: exploitation.id,
            value: exploitation.nom,
            label: exploitation.nom,
          }));

          setUserExploitations(exploitationOptions);
        } else {
          console.error("response: ", response);
          console.error("Failed to fetch exploitations: ", response.status);
        }

        console.log("response :", response);

        // Axios fetch api
        // const response = await axios.get(
        //   `${process.env.NEXT_PUBLIC_API_URL}/api/exploitations?userUID=${userUID}`
        // );

        // console.log("response :", response);

        // if (response.status === 200) {
        //   const exploitations: Exploitation[] = response.data;
        //   const exploitationOptions = exploitations.map(exploitation => ({
        //     id: exploitation.id,
        //     value: exploitation.nom,
        //     label: exploitation.nom,
        //   }));

        //   setUserExploitations(exploitationOptions);
        // } else {
        //   console.error("Failed to fetch exploitations: ", response.status);
        // }
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

/*
// Server Component
// -------------------------------------------------------------
import React, { Suspense } from "react";
import { OptionType } from "../components/selects/SingleSelect";
import Loading from "../components/Loading";
import SettingPageClient from "../components/clients/settings/SettingPageClient";
import { Exploitation } from "../models/interfaces/Exploitation";
import { getServerSession } from "next-auth";
import authOptions from "../api/auth/authOptions";
import axios from "axios";

// Url "/settings"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const SettingPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.name) {
    return (
      <Suspense fallback={<Loading />}>
        <SettingPageClient exploitations={[]} />
      </Suspense>
    );
  }

  const exploitations = await getExploitations(session.user.name);

  if (Array.isArray(exploitations) && exploitations.length === 0) {
    return (
      <Suspense fallback={<Loading />}>
        <SettingPageClient exploitations={[]} />
      </Suspense>
    );
  }

  const exploitationOptions = exploitations.map((expl: Exploitation) => ({
    id: expl.id,
    value: expl.nom,
    label: expl.nom,
  }));

  const userExploitations: OptionType[] = exploitationOptions ?? [];

  return (
    <Suspense fallback={<Loading />}>
      <SettingPageClient exploitations={userExploitations} />
    </Suspense>
  );
};

export default SettingPage;

const getExploitations = async (userUID?: string | null) => {
  try {
    // JS fetch api
    // const response = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_URL}/api/exploitations?userUID=${userUID}`
    // );
    // if (!response.ok) {
    //   throw new Error("Data fetching failed");
    // }
    // const data = await response.json();

    if (!userUID) {
      throw new Error("There's no user uid passed");
    }

    // Axios fetch api
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/exploitations?userUID=${userUID}`
    );

    if (response.status !== 200) {
      throw new Error("Data fetching failed");
    }

    return response.data;
  } catch (error) {
    console.log("error :", error);
    return [];
  }
};
// -------------------------------------------------------------
*/
