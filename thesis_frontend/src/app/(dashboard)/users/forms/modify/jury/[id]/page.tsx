"use client";
import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AlertMessage from "@/components/AlertMessage/page";
import { useRouter } from 'next/navigation';

const ModifyJury = ({ params }) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [juryOptions, setJuryOptions] = useState([]);
  const [enseignantOptions, setEnseignantOptions] = useState([]);
  const [grades, setGrades] = useState({
    president: "",
    examinateur: "",
    rapporteur: ""
  });
  const [messageType, setMessageType] = useState<"success" | "error" | undefined>(undefined);
  const [message, setMessage] = useState("");
  
  const [formData, setFormData] = useState({
    numero: "",
    president_id: "",
    examinateur_id: "",
    rapporteur_id: "",
  });

  useEffect(() => {
    const storedEnseignant = localStorage.getItem("enseignantInfo");
    if (storedEnseignant) {
      const parsedEnseignant = JSON.parse(storedEnseignant);

    }
  }, []);

  const fetchJuryDetails = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/jurys/jury_by_numero/${params.id}`);
      if (response.ok) {
        const juryRes = await response.json();
        const juryData = juryRes.jurys[0];
        setFormData({
          numero: juryData.numero,
          president_id: juryData.president.id,
          examinateur_id: juryData.examinateur.id,
          rapporteur_id: juryData.rapporteur.id,
        });

        
      } else {
        console.error("Erreur lors de la récupération des détails du jury :", response.status);
        setError(`Erreur lors de la récupération des détails du jury : ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du jury :", error);
      setError(`Erreur lors de la récupération des détails du jury : ${error.message}`);
    }
  };
  
  const handleEnseignantChange = (event, role) => {
  const enseignantId = event.target.value;
  const selectedEnseignant = enseignantOptions.find(option => option.value === enseignantId);

  setFormData((prevState) => ({
    ...prevState,
    [`${role}_id`]: enseignantId,
  }));

  if (selectedEnseignant) {
    setGrades((prevGrades) => ({
      ...prevGrades,
      [role]: selectedEnseignant.grade
    }));
  } else {
    setGrades((prevGrades) => ({
      ...prevGrades,
      [role]: ""
    }));
  }
};

  useEffect(() => {
    const storedEnseignant = localStorage.getItem("enseignantInfo");
    if (storedEnseignant) {
      const parsedEnseignant = JSON.parse(storedEnseignant);

      const fetchEnseignantOptions = async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/enseignants/by-departement/${parsedEnseignant.departement_id}?limit=1000&offset=0`
          );
          if (response.ok) {
            const enseignants = await response.json();
            console.log(enseignants);
            
            setEnseignantOptions(
              enseignants.map((enseignant) => ({
                value: enseignant.id,
                label: `${enseignant.utilisateur.nom} ${enseignant.utilisateur.prenoms}`,
                grade: enseignant.grade.nom
              }))
            );
          } else {
            console.error("Erreur lors de la récupération des enseignants :", response.status);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des enseignants :", error);
        }
      };

      fetchEnseignantOptions();
      fetchJuryDetails();
    }
  }, []);

  const handleReset = (e) => {
    e.preventDefault();
    setFormData({
      numero: "",
      president_id: "",
      examinateur_id: "",
      rapporteur_id: "",
    });
    setGrades({
      president: "",
      examinateur: "",
      rapporteur: ""
    });
  };
   
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://127.0.0.1:8000/jurys/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Enregistrement effectué avec succès !!!");
        router.push("/users/Table/jury");
      } else {
        setError(`Échec de la connexion : ${response.statusText}`);
      }
    } catch (error) {
      setError(`Une erreur est survenue lors de la connexion : ${error.message}`);
    }
  };


  return (
    <DefaultLayout>
      <div className="flex justify-center pt-20"> 
        <div className="w-full max-w-4xl px-4"> 
          <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark mb-3">
                <h3 className="font-black text-3xl text-blue-500 dark:text-white">
                  Modifier un jury
                </h3>
                <div className="mt-5">
                  {message && <AlertMessage type={messageType || 'success'} message={message} />}
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="p-6.5">
                  <div className="mb-4.5">
                    <div className="w-full">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Numero
                      </label>
                      <input
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        type="text"
                        readOnly
                        value={formData.numero}
                      />
                    </div>
                  </div>
                  
                  {["president", "examinateur", "rapporteur"].map((role) => (
                    <div key={role} className="mb-4.5">
                      <div className="w-full">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white capitalize">
                          {role}
                        </label>
                        {enseignantOptions.map((option) => (
                          <p className="mb-3 text-sm font-medium text-black dark:text-white">
                            Grade: {option.grade}
                          </p>
                         ))}
                        <div className="relative z-20 bg-transparent dark:bg-form-input">
                          <select
                            className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            onChange={(e) => handleEnseignantChange(e, role)}
                            value={formData[`${role}_id`]}
                          >
                            <option> Sélectionnez un {role}</option>
                            {enseignantOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))} 
                          </select>
                          <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                            <svg
                              className="fill-current"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g opacity="0.8">
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                  fill=""
                                ></path>
                              </g>
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mb-6 flex gap-4">
                    <button
                      className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
                      type="submit"
                    >
                      Enregistrer
                    </button>
                    <button
                      className="flex w-full justify-center rounded bg-gray p-3 font-medium text-black dark:bg-meta-4"
                      onClick={handleReset}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ModifyJury;
