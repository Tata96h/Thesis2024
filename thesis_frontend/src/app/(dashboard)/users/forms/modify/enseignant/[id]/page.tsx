"use client";
import { useState, useRef, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AlertMessage from "@/components/AlertMessage/page";
import { useRouter } from 'next/navigation';


const ModifyEnseignant = ({ params }) => {
  const router = useRouter()
  const [error, setError] = useState("");
  const [gradeOptions, setGradeOptions] = useState([]);
  const [departementOptions, setDepartementOptions] = useState([]);
  const [messageType, setMessageType] = useState<"success" | "error" | undefined>(undefined);
  const [message, setMessage] = useState("");
  

  const [formData, setFormData] = useState({
    nom: "",
    prenoms: "",
    grade_id: "",
    username: "",
    departement_id: "",
    matricule: "",
  });

  const fetchEnseignantDetails = async () => {
    try {
      const response = await fetch(` http://127.0.0.1:8000/enseignants/{utlisateur_id}?utilisateur_id=${params.id}`);
     
      if (response.ok) {
        const enseignantData = await response.json();
        console.log(enseignantData);
        
        // Update formData state with enseignantData
        setFormData({
          nom: enseignantData.utilisateur.nom,
          prenoms: enseignantData.utilisateur.prenoms,
          grade_id: enseignantData.grade.id,
          username: enseignantData.utilisateur.username,
          departement_id: enseignantData.departement.id,
          matricule: enseignantData.matricule,
        
        });
      } else {
        console.error("Erreur lors de la récupération des détails de l'étudiant :", response.status);
        setError(`Erreur lors de la récupération des détails de l'étudiant : ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des détails de l'étudiant :", error);
      setError(`Erreur lors de la récupération des détails de l'étudiant : ${error.message}`);
    }
  };


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

  
  
  const handleGradeChange = (event) => {
    const newGradeValue = event.target.value;

    setFormData((prevState) => ({
      ...prevState,
      grade_id: newGradeValue,
    }));
    console.log(newGradeValue);
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
      departement_id: newDepartementValue,
    }));
    console.log(newDepartementValue);
  };

  useEffect(() => {
   
    const fetchGradeOptions = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/enseignants/get_grades/"
        );
        if (response.ok) {
          const grades = await response.json();
          setGradeOptions(grades.map((grade) => ({ value: grade.id, label: grade.nom })))
          
        } else {
          console.error(
            "Erreur lors de la récupération des grades :",
            response.status
          );
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des grades :", error);
      }
    };
    fetchGradeOptions();
    fetchEnseignantDetails();

    const fetchDepartementOptions = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/enseignants/get_departements/"
        );
        if (response.ok) {
          const departements = await response.json();
          setDepartementOptions(departements.map((departement) => ({ value: departement.id, label: departement.nom })));
 
        } else {
          console.error(
            "Erreur lors de la récupération des départements :",
            response.status
          );
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des départements :", error);
      }
    };

    fetchDepartementOptions();
    fetchEnseignantDetails();
  }, []);

 const handleReset = (e) => {
        e.preventDefault();
        // document.getElementById("sub").disabled = true;
        const inputs = document.querySelectorAll("input , textarea");
        for (let i = 0; i < inputs.length; i++) {
          inputs[i].value = "";
        }
      };
   
const handleSubmit = async (e) => {
  e.preventDefault();
  const { nom, prenoms, grade_id, departement_id, username } = formData;

  console.log(formData); 

  if (!nom || !prenoms  || !grade_id || !departement_id || !username) {
    setMessageType('error');
    setMessage('Tous les champs sont obligatoires !!');
    return;
  }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      setMessageType("error");
      setMessage("Email invalide !!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/enseignants/", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      console.log(responseData);
      console.log(formData);

      if (response.ok) {
        alert("Enregistrement effectué avec succès !!!");
        router.push("/users/Table/enseignant");
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
    <div className="flex justify-center pt-20"> 
      <div className="w-full max-w-4xl px-4"> 
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
           
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark mb-3">
              <h3 className="font-black text-3xl text-blue-500 dark:text-white ">
                Modifier un enseignant
              </h3>
              <div className="mt-5">

             {message && <AlertMessage type={messageType || 'success'} message={message} />}
              </div>

            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Matricule
                    </label>
                    <input
                      placeholder="Entrez votre nom"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      type="text"
                      readOnly
                      value={formData.matricule}

                    />
                  </div>
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Nom
                    </label>
                    <input
                      placeholder="Entrez votre nom"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      type="text"
                      onChange={handleNomChange}
                      value={formData.nom}
                    />
                  </div>
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Prénom
                    </label>
                    <input
                      placeholder="Entrez votre prénom"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      type="text"
                      onChange={handlePrenomChange}
                      value={formData.prenoms}
                    />
                  </div>
                </div>
                <div className="mb-4.5 grid grid-cols-1 md:grid-cols gap-6">
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Email
                    </label>
                    <input
                      placeholder="Entrez votre mail"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      type="email"
                      onChange={handleUsernameChange}
                      value={formData.username}
                    
                    />
                  </div>
                </div>
                <div className="mb-4.5 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Département
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        onChange={handleDepartementChange}
                        value={formData.departement_id}
                      >
                        <option>                   Sélectionnez un département</option>
                        {departementOptions.map((option) => (
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
                          />
                        </g>
                      </svg>
                    </span> 
                  </div>
                  </div>
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Grade
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        onChange={handleGradeChange}
                        value={formData.grade_id}
                      >
                        <option value="">Selectionnez un grade</option>
                        {gradeOptions.map((option) => (
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
                    className=" w-25 h-12 border-r-3 rounded bg-blue-500 p-3 font-medium text-gray hover:bg-opacity-80"
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
         Annuler        
                  </button>
                </div>
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
export default ModifyEnseignant;
