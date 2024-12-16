import React, { FormEvent, useState } from "react";
import SingleSelect, {
  OptionType,
} from "@/app/components/selects/SingleSelect";

const ObserveRosierForm = () => {
  const [loading, setLoading] = useState(false);
  const [stadePheno, setStadePheno] = useState<OptionType | null>(null);
  const [nbTotalFeuilles, setNbTotalFeuilles] = useState<number | string>("");
  const [nbFeuilleToucheesParLaRouille, setNbFeuilleToucheesParLaRouille] =
    useState<number | string>("");
  const [intensiteAttaqueDeLaRouille, setIntensiteAttaqueDeLaRouille] =
    useState<number | string>("");
  const [nbFeuilleToucheesParEcidies, setNbFeuilleToucheesParEcidies] =
    useState<number | string>("");
  const [nbFeuilleToucheesParUredos, setNbFeuilleToucheesParUredos] = useState<
    number | string
  >("");
  const [nbFeuilleToucheesParTeleutos, setNbFeuilleToucheesParTeleutos] =
    useState<number | string>("");
  const [nbFeuilleToucheesParMarsonia, setNbFeuilleToucheesParMarsonia] =
    useState<number | string>("");
  const [comment, setComment] = useState<string>("");

  // Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    console.log("Submit");

    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          {/* Stade phenologique */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">Stade phénologique</p>
            <SingleSelect
              data={[]}
              selectedOption={stadePheno}
              setSelectedOption={option => setStadePheno(option)}
            />
            <small>1 - Premier stade le 06/05</small>
          </div>

          {/* Nombre total de feuilles */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">
              Nombre total de feuilles <span className="text-error">*</span>
            </p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-background rounded-md h-9 p-2">
              <input
                type="number"
                className="grow"
                value={nbTotalFeuilles}
                onChange={e => setNbTotalFeuilles(e.target.value)}
              />
            </label>
            <small>30 le 06/05</small>
          </div>

          {/* Nombre de feuilles touchées par la rouille */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">
              Nombre de feuilles touchées par la rouille
            </p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-background rounded-md h-9 p-2">
              <input
                type="number"
                className="grow"
                value={nbFeuilleToucheesParLaRouille}
                onChange={e => setNbFeuilleToucheesParLaRouille(e.target.value)}
              />
            </label>
            <small>15 le 06/05</small>
          </div>

          {/* Intensité d'attaque de la rouille */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">Intensité d&apos;attaque de la rouille</p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-background rounded-md h-9 p-2">
              <input
                type="number"
                className="grow"
                value={intensiteAttaqueDeLaRouille}
                onChange={e => setIntensiteAttaqueDeLaRouille(e.target.value)}
              />
            </label>
            <small>9 le 06/05</small>
          </div>

          {/* Nombre de feuilles touchées par écidies */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">Nombre de feuilles touchées par écidies</p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-background rounded-md h-9 p-2">
              <input
                type="number"
                className="grow"
                value={nbFeuilleToucheesParEcidies}
                onChange={e => setNbFeuilleToucheesParEcidies(e.target.value)}
              />
            </label>
            <small>5 le 06/05</small>
          </div>

          {/* Nombre de feuilles touchées par urédos */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">Nombre de feuilles touchées par urédos</p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-background rounded-md h-9 p-2">
              <input
                type="number"
                className="grow"
                value={nbFeuilleToucheesParUredos}
                onChange={e => setNbFeuilleToucheesParUredos(e.target.value)}
              />
            </label>
            <small>4 le 06/05</small>
          </div>

          {/* Nombre de feuilles touchées par téleutos */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">
              Nombre de feuilles touchées par téleutos
            </p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-background rounded-md h-9 p-2">
              <input
                type="number"
                className="grow"
                value={nbFeuilleToucheesParTeleutos}
                onChange={e => setNbFeuilleToucheesParTeleutos(e.target.value)}
              />
            </label>
            <small>4 le 06/05</small>
          </div>

          {/* Nombre de feuilles touchées par marsonia */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">
              Nombre de feuilles touchées par marsonia
            </p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-background rounded-md h-9 p-2">
              <input
                type="number"
                className="grow"
                value={nbFeuilleToucheesParMarsonia}
                onChange={e => setNbFeuilleToucheesParMarsonia(e.target.value)}
              />
            </label>
            <small>4 le 06/05</small>
          </div>

          {/* Comment */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">Commentaire</p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-background rounded-md h-9 p-2">
              <input
                type="number"
                className="grow"
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </label>
            <small>&quot;Rien à signaler&quot; le 06/05</small>
          </div>

          <button className="btn btn-sm bg-primary w-full border-none text-txton3 hover:bg-primary font-normal h-10 rounded-md">
            {loading ? (
              <span className="loading loading-spinner text-txton3"></span>
            ) : (
              "Valider"
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default ObserveRosierForm;
