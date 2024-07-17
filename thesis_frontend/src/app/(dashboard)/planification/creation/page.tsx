"use client";
import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import AlertMessage from "@/components/AlertMessage/page";
import { useRouter } from "next/navigation";

const FormulairePlanificationSoutenance = () => {
  const [messageType, setMessageType] = useState<"success" | "error" | undefined>(undefined);
  const [message, setMessage] = useState("");
  const [enseignantInfo, setEnseignantInfo] = useState<any>(null);
  const [salleOptions, setSalleOptions] = useState([]);

  const router = useRouter();

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
    salles: []
  });

  useEffect(() => {
    const fetchSalleOptions = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/thesis/get_salles/?limit=1000&offset=0"
        );
        if (response.ok) {
          const salles = await response.json();
          console.log("Salles récupérées :", salles);
          setSalleOptions(
            salles.map((salle) => ({
              value: salle.id,
              label: salle.libelle,
            }))
          );
        } else {
          console.error(
            "Erreur lors de la récupération des salles :",
            response.status
          );
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des salles :", error);
      }
    };
    fetchSalleOptions();
  }, []);

  const handleInputChange = (event) => {
    const { name, value, type, selectedOptions } = event.target;
    if (type === "select-multiple") {
      const values = Array.from(selectedOptions, (option) => option.value);
      console.log("Salles sélectionnées :", values);
      setFormData((prevState) => ({
        ...prevState,
        [name]: values,
      }));
    } else {
      console.log("Changement de formulaire :", { [name]: value });
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
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
        console.log("Enseignant Info :", enseignantInfo);
        console.log("Données du formulaire :", formData);
        
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
          localStorage.setItem("planificationInfo", JSON.stringify(data));
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
      salles: []
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

              <div className="flex space-x-4">
                <select
                  className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  name="salles"
                  value={formData.salles}
                  onChange={handleInputChange}
                  multiple
                >
                  {salleOptions.map((option) => (
                    <option key={option.label} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </select>
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