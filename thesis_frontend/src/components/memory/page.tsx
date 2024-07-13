"use client";
import React, { useState, useEffect } from 'react';
import AlertMessage from '../AlertMessage/page';

const ChoixMaitreMemoire = () => {
  const [choix, setChoix] = useState({
    numero: null,
    choix1_id: null,
    choix2_id: null
  });
  const [messageType, setMessageType] = useState<"success" | "error" | undefined>(undefined);
  const [message, setMessage] = useState("");
  const [etudiantInfo, setEtudiantInfo] = useState<any>(null);
  const [memoireInfo, setMemoireInfo] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [enseignantOptions, setEnseignantOptions] = useState([]);

  useEffect(() => {
    const storedEtudiantInfo = localStorage.getItem('etudiantInfo');
    const storedUserInfo = localStorage.getItem('userInfo');
    const storedMemoireInfo = localStorage.getItem('memoireInfo');

    if (storedEtudiantInfo) {
      const parsedEtudiantInfo = JSON.parse(storedEtudiantInfo);
      setEtudiantInfo(parsedEtudiantInfo);

      if (storedUserInfo) {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedUserInfo);
      
        if (storedMemoireInfo) {
          const parsedMemoireInfo = JSON.parse(storedMemoireInfo);
          setMemoireInfo(parsedMemoireInfo);
              
          // Fonction pour récupérer le label du rôle depuis l'API backend
          const fetchRoleLabel = async () => {
            try {
              const url = `http://127.0.0.1:8000/enseignants/by-departement/${parsedEtudiantInfo.filiere.departement_id}?limit=1000&offset=0`; 
              const response = await fetch(url, {
                method: 'GET',
              });
              if (response.ok) {
                const data = await response.json();
                console.log('Données récupérées pour le departement', parsedEtudiantInfo.filiere.departement_id, data);
                
                setEnseignantOptions(
                  data.map((enseignant) => ({
                    value: enseignant.id,
                    label: enseignant.utilisateur.nom,
                    label1: enseignant.utilisateur.prenoms,
                  }))
                );
                } else {
                  console.error('Le champ libelle est manquant dans les données retournées:', data);
                }
                
            } catch (error) {
              console.error('Erreur lors de la récupération du label du rôle :', error);
            }
          };
          
          fetchRoleLabel();
        }
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChoix(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (choix.choix1_id === choix.choix2_id) {
      setMessageType("error");
      setMessage("Erreur : Veuillez choisir deux maîtres différents.");
    } else {
      try {
        // Assurez-vous que `numero` est défini avant d'envoyer la requête
        const updatedChoix = { ...choix, numero: memoireInfo.numero };
        console.log(updatedChoix);

        // Créez un objet FormData
        const formData = new FormData();
        formData.append('updated_data', JSON.stringify(updatedChoix));

        const response = await fetch(`http://127.0.0.1:8000/thesis/${memoireInfo.numero}?utilisateur_id=${userInfo.utilisateur_id}`, {
          method: "PATCH",
          body: formData,
        });

        if (response.ok) {
          setMessageType("success");
          setMessage("Vos choix ont été enregistrés avec succès.");
          console.log("Choix enregistrés :", updatedChoix);
        } else {
          const errorData = await response.json();
          setMessageType("error");
          setMessage(`Erreur lors de l'enregistrement des choix: ${errorData.detail}`);
          console.error("Erreur lors de l'enregistrement des choix :", errorData);
        }
      } catch (error) {
        setMessageType("error");
        setMessage("Erreur lors de l'enregistrement des choix.");
        console.error("Erreur lors de l'enregistrement des choix :", error);
      }
    }
  };


  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Choix des Maîtres de Mémoire</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
      {message && <AlertMessage type={messageType || 'success'} message={message} />}
        <div>
          <label htmlFor="choix1_id" className="block text-sm font-medium text-gray-700 mb-2">
            Premier choix
          </label>
          <select
            id="choix1_id"
            name="choix1_id"
            value={choix.choix1_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Sélectionner un enseignant</option>
            {enseignantOptions.map((enseignant) => (
              <option key={enseignant.value} value={enseignant.value}>
                {enseignant.label} {enseignant.label1}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="choix2_id" className="block text-sm font-medium text-gray-700 mb-2">
            Deuxième choix
          </label>
          <select
            id="choix2_id"
            name="choix2_id"
            value={choix.choix2_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Sélectionner un enseignant</option>
            {enseignantOptions.map((enseignant) => (
              <option key={enseignant.value} value={enseignant.value}>
                {enseignant.label} {enseignant.label1}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Soumettre mes choix
        </button>
      </form>
      
    </div>
  );
};

export default ChoixMaitreMemoire;
