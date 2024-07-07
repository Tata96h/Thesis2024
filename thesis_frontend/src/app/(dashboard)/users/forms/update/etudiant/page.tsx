"use client"
import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Field, Label, Switch } from "@headlessui/react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useRouter } from 'next/navigation';

const AddEtudiant = () => {
  const router = useRouter()

  const [error, setError] = useState("");
  const [newPassconfirmValue, setNewPassconfirmValue] = useState("");
  const [filiereOptions, setFiliereOptions] = useState([]);

  const [formData, setFormData] = useState({
    nom: "",
    prenoms: "",
    matricule: "",
    filiere_id: "",
    email: "",
    bio: "",
    annee_id: "",
    username: "",
    password: "",
    departement_id: "",
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
 

  const handleBioChange = (event) => {
    const newBioValue = event.target.value;

    setFormData((prevState) => ({
      ...prevState,
      bio: newBioValue,
    }));
    console.log(newBioValue);
  };

  const handleAnneeChange = (event) => {
    const newAnneeValue = event.target.value;

    setFormData((prevState) => ({
      ...prevState,
      annee_id: newAnneeValue,
    }));
    console.log(newAnneeValue);
  };

  const handleEmailChange = (event) => {
    const newEmailValue = event.target.value;

    setFormData((prevState) => ({
      ...prevState,
      email: newEmailValue,
    }));
    console.log(newEmailValue);
  };

  const handlePasswordChange = (event) => {
    const newPasswordValue = event.target.value;

    setFormData((prevState) => ({
      ...prevState,
      password: newPasswordValue,
    }));
    console.log(newPasswordValue);
  };

  const handlePassconfirmChange = (event) => {
    const newPassconfirmValue = event.target.value;
    setNewPassconfirmValue(newPassconfirmValue);
    console.log(newPassconfirmValue);
  };
  const handleUsernameChange = (event) => {
    const newUsernameValue = event.target.value;

    setFormData((prevState) => ({
      ...prevState,
      username: newUsernameValue,
    }));
    console.log(newUsernameValue);
  };
 const handleDepartementChange = (event) => {
    const newDepartementValue = event.target.value;

    setFormData((prevState) => ({
      ...prevState,
      departement: newDepartementValue,
    }));
    console.log(newDepartementValue);
  };
  useEffect(() => {
     const fetchFiliereOptions = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/etudiants/get_filieres/"
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
    console.log(formData);
    const passconfirm = newPassconfirmValue;
    const password = formData.password;
    console.log(passconfirm);
    console.log(password);

    // Vérifier que le mot de passe et la confirmation sont identiques
    if (password !== passconfirm) {
      setError("Les mots de passe doivent être identiques !!!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/etudiants/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        cache: "no-store"
      });
      const responseData = await response.json();
      console.log(responseData);
      console.log(formData);

      if (response.ok) {
        alert("Enregistrement effectué avec succès!");
        router.push("/users/Table/etudiant");
        router.refresh()
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
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-blue-500 dark:text-white">
              Ajouter un étudiant
            </h3>
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
                    onChange={handleMatriculeChange}
                  />
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Filière{" "}
                  </label>
                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <select
                      className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary "
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
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Année académique{" "}
                  </label>
                  <input
                    placeholder="Entrez votre année"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    type="number"
                    onChange={handleAnneeChange}
                  />
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Email{" "}
                  </label>
                  <input
                    placeholder="Entrez un mail"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    type="email"
                    onChange={handleEmailChange}
                  />
                </div>
              </div>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Mot de passe{" "}
                  </label>
                  <input
                    placeholder="Entrez votre mot de passe"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    type="password"
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Mot de passe confirmé
                  </label>
                  <input
                    placeholder="Confirmez votre mot de passe"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    type="password"
                    onChange={handlePassconfirmChange}
                  />
                </div>

              </div>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">

               
             <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
Biographie                  </label>
                  <textarea
  className="w-full h-48 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
  placeholder="Entrez une biographie..."
   onChange={handleBioChange}

>

</textarea>

                 </div>
                 <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Username
                  </label>
                  <input
                    placeholder="Entrez votre nom d'utilisateur"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    type="text"
                    onChange={handleUsernameChange}
                  />
                </div>
                </div>
              <button
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                id="sub"
              >
                Envoyez
              </button>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};
export default AddEtudiant;
