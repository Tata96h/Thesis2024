"use client"
import React, { useState } from 'react';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import AlertMessage from "@/components/AlertMessage/page";


const FormulairePlanificationSoutenance = () => {
  const [messageType, setMessageType] = useState<"success" | "error" | undefined>(undefined);
  const [message, setMessage] = useState("");
  const [soutenance, setSoutenance] = useState({
    heure: "",
    date: "",
    theme: "",
    jury: {
      numero: "",
      membres: ["", "", ""]
    },
    salle: "",
    anneeAcademique: "",
    etudiant1: { nom: "", prenom: "" },
    etudiant2: { nom: "", prenom: "" }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSoutenance(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleJuryChange = (index, value) => {
    setSoutenance(prev => ({
      ...prev,
      jury: {
        ...prev.jury,
        membres: prev.jury.membres.map((membre, i) => i === index ? value : membre)
      }
    }));
  };

  const handleStudentChange = (student, field, value) => {
    setSoutenance(prev => ({
      ...prev,
      [student]: {
        ...prev[student],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, vous pouvez envoyer les données du formulaire à votre backend
    console.log("Données de la soutenance:", soutenance);
    // Réinitialiser le formulaire après soumission
    setSoutenance({
      heure: "",
      date: "",
      theme: "",
      jury: {
        numero: "",
        membres: ["", "", ""]
      },
      salle: "",
      anneeAcademique: "",
      etudiant1: { nom: "", prenom: "" },
      etudiant2: { nom: "", prenom: "" }
    });
  };
  const handleReset = (e) => {
        e.preventDefault();
        // document.getElementById("sub").disabled = true;
        const inputs = document.querySelectorAll("input , textarea");
        for (let i = 0; i < inputs.length; i++) {
          inputs[i].value = "";
        }
      };

  return (
    <DefaultLayout>
      <div className="flex justify-center gap-9 pt-20">
       <div className="w-full max-w-4xl px-4"> 

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
         
          <div className="border-b border-stroke px-6.5  py-4 dark:border-strokedark">
            <h3 className="font-black text-3xl text-blue-500 dark:text-white">
              Faire une planification
            </h3>
             <div className="mt-5">

             {message && <AlertMessage type={messageType || 'success'} message={message} />}
              </div>
          </div>
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-8 space-y-6 mb-7">
            
            <div className="flex space-x-4 ">
              <input
                type="date"
                name="date"
                value={soutenance.date}
                onChange={handleInputChange}
                className="flex-1 border p-2 rounded"
                required
              />
              <input
                type="time"
                name="heure"
                value={soutenance.heure}
                onChange={handleInputChange}
                className="flex-1 border p-2 rounded"
                required
              />
            </div>

            <input
              type="text"
              name="theme"
              value={soutenance.theme}
              onChange={handleInputChange}
              placeholder="Thème de la soutenance"
              className="w-full border p-2 rounded"
              required
            />

            <div className="flex space-x-4">
              <input
                type="number"
                name="jury.numero"
                value={soutenance.jury.numero}
                onChange={(e) => setSoutenance(prev => ({...prev, jury: {...prev.jury, numero: e.target.value}}))}
                placeholder="Numéro du jury"
                className="flex-1 border p-2 rounded"
                required
              />
              <input
                type="text"
                name="salle"
                value={soutenance.salle}
                onChange={handleInputChange}
                placeholder="Salle"
                className="flex-1 border p-2 rounded"
                required
              />
            </div>

            

            <input
              type="text"
              name="anneeAcademique"
              value={soutenance.anneeAcademique}
              onChange={handleInputChange}
              placeholder="Année académique"
              className="w-full border p-2 rounded"
              required
            />

            <div className="flex space-x-4">
              <input
                type="text"
                value={soutenance.etudiant1.nom}
                onChange={(e) => handleStudentChange('etudiant1', 'nom', e.target.value)}
                placeholder="Nom étudiant 1"
                className="flex-1 border p-2 rounded"
                required
              />
              <input
                type="text"
                value={soutenance.etudiant1.prenom}
                onChange={(e) => handleStudentChange('etudiant1', 'prenom', e.target.value)}
                placeholder="Prénom étudiant 1"
                className="flex-1 border p-2 rounded"
                required
              />
            </div>

            <div className="flex space-x-4">
              <input
                type="text"
                value={soutenance.etudiant2.nom}
                onChange={(e) => handleStudentChange('etudiant2', 'nom', e.target.value)}
                placeholder="Nom étudiant 2 (optionnel)"
                className="flex-1 border p-2 rounded"
              />
              <input
                type="text"
                value={soutenance.etudiant2.prenom}
                onChange={(e) => handleStudentChange('etudiant2', 'prenom', e.target.value)}
                placeholder="Prénom étudiant 2 (optionnel)"
                className="flex-1 border p-2 rounded"
              />
            </div>

            <div className="flex justify-center space-x-20 mt-6 ">
                <div className="">

                  <button
                    className=" w-25 h-12 rounded bg-blue-500 p-3 font-medium text-gray hover:bg-opacity-80 border-r-3 "
                    id="sub"
                  >
                    Planifier
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
          </form>
         </div>
       </div>
    </div>
    </DefaultLayout>
  );
};

export default FormulairePlanificationSoutenance;