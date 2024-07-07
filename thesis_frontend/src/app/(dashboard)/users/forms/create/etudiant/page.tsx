"use client"
import { useState, useRef, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useRouter } from 'next/navigation';
import AlertMessage from "@/components/AlertMessage/page";

const AddEtudiant = () => {
  const router = useRouter()

  const [error, setError] = useState("");
  const [filiereOptions, setFiliereOptions] = useState([]);
  const [messageType, setMessageType] = useState<"success" | "error" | undefined>(undefined);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    nom: "",
    prenoms: "",
    matricule: "",
    filiere_id: "",
    email: "",
    annee_id: "",
    username: "",
  });

  const handleNomChange = (event) => {
    const newNomValue = event.target.value;

    setFormData((prevState) => ({
      ...prevState,
      nom: newNomValue,
    }));
    console.log(newNomValue);
  };

  const handlePrenomChange = (event) => {
    const newPrenomValue = event.target.value;

    setFormData((prevState) => ({
      ...prevState,
      prenoms: newPrenomValue,
    }));
    console.log(newPrenomValue);
  };

  const handleMatriculeChange = (event) => {
    const newMatriculeValue = event.target.value;

    setFormData((prevState) => ({
      ...prevState,
      matricule: newMatriculeValue,
    }));
    console.log(newMatriculeValue);
  };

  const handleFiliereChange = (event) => {
    const newFiliereValue = event.target.value;

    setFormData((prevState) => ({
      ...prevState,
      filiere_id: newFiliereValue,
    }));
    console.log(newFiliereValue);
  };


  const handleUsernameChange = (event) => {
    const newUsernameValue = event.target.value;

    setFormData((prevState) => ({
      ...prevState,
      username: newUsernameValue,
    }));
    console.log(newUsernameValue);
  };
const handleReset = (e) => {
        e.preventDefault();
        // document.getElementById("sub").disabled = true;
        const inputs = document.querySelectorAll("input , textarea");
        for (let i = 0; i < inputs.length; i++) {
          inputs[i].value = "";
        }
      };
 
 
  useEffect(() => {
     const fetchFiliereOptions = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/etudiants/get_filieres/?limit=20&offset=0"
        );
        if (response.ok) {
          const filieres = await response.json();
          setFiliereOptions(
            filieres.map((filiere) => ({
              value: filiere.id,
              label: filiere.nom,
            }))
          );
        } else {
          console.error(
            "Erreur lors de la récupération des filières :",
            response.status
          );
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des filières :", error);
      }
    };
    fetchFiliereOptions();
  
  }, []);

const handleSubmit = async (e) => {
    e.preventDefault();
    const { nom, prenoms, matricule, filiere_id, username } = formData;
    if (!nom || !prenoms || !matricule || !filiere_id || !username) {
      setMessageType("error");
      setMessage("Tous les champs sont obligatoires !!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      setMessageType("error");
      setMessage("Email invalide !!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/etudiants/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      console.log(responseData);
      console.log(formData);

      if (response.ok) {
        alert("Enregistrement effectué avec succès !!!");
         router.push("/users/Table/etudiant");
      } else {
        setError(`Échec de la connexion : ${response.statusText}`);
      }
    } catch (error) {
      setError(
        `Une erreur est survenue lors de la connexion : ${error.message}`
      );
    }
  };
  

  return (
    <DefaultLayout>
      <div className="flex justify-center gap-9 pt-20">
       <div className="w-full max-w-4xl px-4"> 

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
         
          <div className="border-b border-stroke px-6.5  py-4 dark:border-strokedark">
            <h3 className="font-black text-3xl text-blue-500 dark:text-white">
              Ajouter un étudiant
            </h3>
             <div className="mt-5">

             {message && <AlertMessage type={messageType || 'success'} message={message} />}
              </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Nom{" "}
                  </label>
                  <input
                    placeholder="Entrez votre nom"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    type="text"
                    value={formData.nom}
                    onChange={handleNomChange}
                  />
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Prénom
                  </label>
                  <input
                    placeholder="Entrez votre prénom"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    type="text"
                    value={formData.prenoms}
                    onChange={handlePrenomChange}
                  />
                </div>
              </div>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Matricule <span className="text-meta-1">*</span>
                  </label>
                  <input
                    placeholder="Entrez votre matricule"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    type="number"
                    value={formData.matricule}
                    onChange={handleMatriculeChange}
                  />
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Email
                  </label>
                  <input
                    placeholder="Entrez votre mail"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    type="email"
                    value={formData.username}

                    onChange={handleUsernameChange}
                  />
                </div>
               
               
              </div>
              
              
              <div className="mb-4.5 gap-6">
              <div className="">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Filière{" "}
                  </label>
                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <select
                      className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary "
                      value={formData.filiere_id}
                      onChange={handleFiliereChange}
                    >
                      <option value="">Sélectionnez une filière</option>
                      {filiereOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                      <svg
                        className="fill-current"
                        width={24}
                        height={24}
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
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>
                 
                </div>
              <div className="flex justify-center space-x-20 mt-6">
                <div className="">

                  <button
                    className=" w-25 h-12 rounded bg-blue-500 p-3 font-medium text-gray hover:bg-opacity-80 border-r-3 "
                    id="sub"
                  >
                    Envoyer
                  </button>
                </div>
                <div className="">

                  <button
                    className="w-25 h-12 border-r-3 rounded bg-black p-3 font-medium text-gray hover:bg-opacity-80"
                    id="" onClick={handleReset}
                  >
Annuler                  </button>
                </div>
                </div>
            </div>
          </form>
        </div>
      </div>
      </div>
    </DefaultLayout>
  );
};
export default AddEtudiant;
