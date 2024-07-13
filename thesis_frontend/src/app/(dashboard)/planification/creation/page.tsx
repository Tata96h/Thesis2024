"use client"
import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import AlertMessage from "@/components/AlertMessage/page";
import { useRouter } from "next/navigation";


const FormulairePlanificationSoutenance = () => {
  const [messageType, setMessageType] = useState<"success" | "error" | undefined>(undefined);
  const [message, setMessage] = useState("");
  const [enseignantInfo, setEnseignantInfo] = useState<any>(null);

  useEffect(() => {
    const storedEnseignantInfo = localStorage.getItem('enseignantInfo');
    if (storedEnseignantInfo) {
      const parsedEnseignantInfo = JSON.parse(storedEnseignantInfo);
      setEnseignantInfo(parsedEnseignantInfo);
    }
  }, []);

  const [formData, setFormData] = useState({
    date: "",
    heure_debut: "",
    heure_fin: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { date, heure_debut, heure_fin } = formData;

    if (!date || !heure_debut || !heure_fin) {
      setMessageType("error");
      setMessage("Tous les champs sont obligatoires !");
      return;
    } else {
      try {
        console.log(enseignantInfo.departement_id);
        
        const response = await fetch(`http://127.0.0.1:8000/thesis/planification/4/${enseignantInfo.departement_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();

        if (response.ok) {
          setMessageType("success");
          setMessage("Soutenance planifiée avec succès.");
          console.log("Soutenance :", data);
          localStorage.setItem("planificationInfo", JSON.stringify(data));
          console.log(localStorage);

          router.push('/planification/affichage');
          
        } else {
          setMessageType("error");
          setMessage("Erreur lors de la planification.");
          console.error("Erreur lors de la planification :", response.status);
        }
      } catch (error) {
        setMessageType("error");
        setMessage("Erreur lors de l'enregistrement.");
        console.error("Erreur lors de l'enregistrement :", error);
      }
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    setFormData({
      date: "",
      heure_debut: "",
      heure_fin: "",
    });
  };

  return (
    <DefaultLayout>
      <div className="flex justify-center gap-9 pt-20">
        <div className="w-full max-w-4xl px-4"> 
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
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
                  value={formData.date}
                  onChange={handleInputChange}
                  className="flex-1 border p-2 rounded"
                  required
                />
              </div>

              <input
                type="time"
                name="heure_debut"
                value={formData.heure_debut}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
                required
              />

              <div className="flex space-x-4">
                <input
                  type="time"
                  name="heure_fin"
                  value={formData.heure_fin}
                  onChange={handleInputChange}
                  className="flex-1 border p-2 rounded"
                  required
                />
              </div>

              <div className="flex justify-center space-x-20 mt-6 ">
                <button
                  type="submit"
                  className="w-25 h-12 rounded bg-blue-500 p-3 font-medium text-gray hover:bg-opacity-80 border-r-3"
                >
                  Planifier
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-25 h-12 border-r-3 rounded bg-black p-3 font-medium text-gray hover:bg-opacity-80"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default FormulairePlanificationSoutenance;