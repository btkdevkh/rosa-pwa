"use client";

import { useEffect, useState } from "react";
import PageWrapper from "../../shared/PageWrapper";
import ModalWrapper from "../../modals/ModalWrapper";
import SearchOptions from "../../searchs/SearchOptions";
import StickyMenuBarWrapper from "../../shared/StickyMenuBarWrapper";
import AnalysesModalOptions from "../../modals/analyses/AnalysesModalOptions";
import Loading from "../../shared/Loading";
import { useRouter } from "next/navigation";

type AnalysesPageClientProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  graphiqueData: any[];
};

const AnalysesPageClient = ({ graphiqueData }: AnalysesPageClientProps) => {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const handleReorganiseGraph = () => {
    console.log(123);
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  // console.log("graphiqueData :", graphiqueData);

  return (
    <PageWrapper
      pageTitle="Rospot | Analyses"
      navBarTitle={"Analyses"}
      back={false}
    >
      <StickyMenuBarWrapper>
        {/* Search options top bar */}
        <SearchOptions
          query={query}
          setQuery={setQuery}
          setShowOptionsModal={setShowOptionsModal}
        />

        {/* Options Modal */}
        {showOptionsModal && (
          <ModalWrapper closeOptionModal={() => setShowOptionsModal(false)}>
            <AnalysesModalOptions
              onClickAddGraphique={() =>
                router.push(`/analyses/graphique/addGraphique`)
              }
              handleReorganiseGraph={handleReorganiseGraph}
            />
          </ModalWrapper>
        )}
      </StickyMenuBarWrapper>

      <div className="container mx-auto">
        <div className="flex flex-col gap-4">
          {loading && <Loading />}
          {!loading && graphiqueData.length === 0 && (
            <div className="text-center">
              <p>Aucun graphique à afficher,</p>
              <p>Veuillez créer votre graphique.</p>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default AnalysesPageClient;
