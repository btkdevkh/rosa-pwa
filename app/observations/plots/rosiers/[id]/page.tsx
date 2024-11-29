"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import PageWrapper from "@/app/components/PageWrapper";

const IdRosierPage = () => {
  // const router = useRouter();
  const searchParams = useSearchParams();
  const rosierParamUID = searchParams.get("uid");
  const rosierParamName = searchParams.get("nom");

  return (
    <PageWrapper
      pageTitle="Rospot | Rosier"
      navBarTitle={rosierParamName ?? "n/a"}
      back={true}
    >
      <div className="container mx-auto">
        {rosierParamUID}
        {rosierParamName}
      </div>
    </PageWrapper>
  );
};

export default IdRosierPage;
