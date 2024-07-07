"use client"
import React, { useState } from 'react';

const ChoixMaitreMemoire = () => {
  const [choix, setChoix] = useState({
    premierChoix: '',
    deuxiemeChoix: ''
  });
  const [message, setMessage] = useState('');

  // Liste fictive de maîtres de mémoire disponibles
  const maitresDisponibles = [
    "Dr. Martin Dupont",
    "Pr. Sophie Laurent",
    "Dr. Jean Dubois",
    "Pr. Marie Curie",
    "Dr. Albert Einstein",
    "Pr. Ada Lovelace"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChoix(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (choix.premierChoix === choix.deuxiemeChoix) {
      setMessage("Erreur : Veuillez choisir deux maîtres différents.");
    } else {
      setMessage("Vos choix ont été enregistrés avec succès.");
      console.log("Choix enregistrés :", choix);
      // Ici, vous pouvez envoyer les données à votre backend
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Choix des Maîtres de Mémoire</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="premierChoix" className="block text-sm font-medium text-gray-700 mb-2">
            Premier choix
          </label>
          <select
            id="premierChoix"
            name="premierChoix"
            value={choix.premierChoix}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Sélectionnez un maître</option>
            {maitresDisponibles.map((maitre, index) => (
              <option key={index} value={maitre}>{maitre}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="deuxiemeChoix" className="block text-sm font-medium text-gray-700 mb-2">
            Deuxième choix
          </label>
          <select
            id="deuxiemeChoix"
            name="deuxiemeChoix"
            value={choix.deuxiemeChoix}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Sélectionnez un maître</option>
            {maitresDisponibles.map((maitre, index) => (
              <option key={index} value={maitre}>{maitre}</option>
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
      {message && (
        <p className={`mt-4 text-center ${message.includes('Erreur') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ChoixMaitreMemoire;