// "use client";
// import React from "react";
// import CardDataStats from "../CardDataStats";
// import ChartOne from "../Charts/ChartOne";

// const ECommerce: React.FC = () => {
//   // Supposons que vous ayez récupéré ces données d'une API
//   const stats = {
//     etudiants: 85,
//     enseignants: 20,
//     jurys: 15,
//     maitreMemoireProgramme: 10,
//     memoires: {
//       deposes: 30,
//       valides: 25
//     }
//   };

//   return (
//     <>
//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mt-20">
//         <CardDataStats title="Étudiants" total={stats.etudiants} rate="">
//           {/* Icône pour étudiants */}
//         </CardDataStats>
//         <CardDataStats title="Enseignants" total={stats.enseignants} rate="">
//           {/* Icône pour enseignants */}
//         </CardDataStats>
//         <CardDataStats title="Jurys" total={stats.jurys} rate="">
//           {/* Icône pour jurys */}
//         </CardDataStats>
//         <CardDataStats title="Maîtres de mémoire" total={stats.maitreMemoireProgramme} rate="">
//           {/* Icône pour maîtres de mémoire */}
//         </CardDataStats>
//       </div>

//       <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
//         <CardDataStats title="Mémoires déposés" total={stats.memoires.deposes} rate="">
//           {/* Icône pour mémoires déposés */}
//         </CardDataStats>
//         <CardDataStats title="Mémoires validés" total={stats.memoires.valides} rate="">
//           {/* Icône pour mémoires validés */}
//         </CardDataStats>
//         <ChartOne />

//       </div>
//     </>
//   );
// };

// export default ECommerce;



"use client";
import React, { useState, useEffect } from "react";
import CardDataStats from "../CardDataStats";
import ChartOne from "../Charts/ChartOne";
import { log } from "util";

const ECommerce: React.FC = () => {
  const [etudiants, setEtudiants] = useState(0);
  const [enseignants, setEnseignants] = useState(0);
  const [jurys, setJurys] = useState(0);
  const [maitreMemoireProgramme, setMaitreMemoireProgramme] = useState(0);
  const [memoiresDeposees, setMemoiresDeposees] = useState(0);
  const [memoiresValides, setMemoiresValides] = useState(0);

  const fetchEtudiants = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/etudiants/?limit=1000&offset=0");
      const data = await response.json();
      setEtudiants(data); // Utilisation de length pour obtenir le nombre d'étudiants
    
      
    } catch (error) {
      console.error("Erreur lors de la récupération des étudiants :", error);
    }
  };

  const fetchEnseignants = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/enseignants/?limit=1000&offset=0");
      const data = await response.json();
      setEnseignants(data); // Utilisation de length pour obtenir le nombre d'enseignants
    } catch (error) {
      console.error("Erreur lors de la récupération des enseignants :", error);
    }
  };

  const fetchJurys = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/jurys/?limit=1000&offset=0");
      const data = await response.json();
      setJurys(data.length); // Utilisation de length pour obtenir le nombre de jurys
    } catch (error) {
      console.error("Erreur lors de la récupération des jurys :", error);
    }
  };

  const fetchMaitreMemoireProgramme = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/maitres/stats");
      const data = await response.json();
      setMaitreMemoireProgramme(data.length); // Utilisation de length pour obtenir le nombre de maîtres de mémoire
    } catch (error) {
      console.error("Erreur lors de la récupération des maîtres de mémoire :", error);
    }
  };

  const fetchMemoiresDeposees = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/thesis/4?limit=1000&offset=0");
      const data = await response.json();
      const nonNullThemes = data.filter(thesis => thesis.theme !== null && thesis.fichier !== null);
      setMemoiresDeposees(nonNullThemes.length); // Utilisation de length pour obtenir le nombre de mémoires avec des thèmes non nuls
    } catch (error) {
      console.error("Erreur lors de la récupération des mémoires déposées :", error);
    }
  };

  const fetchMemoiresValides = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/thesis/4?limit=1000&offset=0");
      const data = await response.json();
      const nonNullThemes = data.filter(thesis => thesis.is_theme_valide == true);
      setMemoiresValides(nonNullThemes.length); // Utilisation de length pour obtenir le nombre de mémoires avec des thèmes non nuls
    } catch (error) {
      console.error("Erreur lors de la récupération des mémoires valides :", error);
    }
  };

  useEffect(() => {
    fetchEtudiants();
    fetchEnseignants();
    fetchJurys();
    fetchMaitreMemoireProgramme();
    fetchMemoiresDeposees();
    fetchMemoiresValides();
  }, []);

  // Mettre à jour les données après ajout ou suppression
  const handleUpdate = () => {
    fetchEtudiants();
    fetchEnseignants();
    fetchJurys();
    fetchMaitreMemoireProgramme();
    fetchMemoiresDeposees();
    fetchMemoiresValides();
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mt-20">
        <CardDataStats title="Étudiants" total={etudiants.total_users} rate="" />
        <CardDataStats title="Enseignants" total={enseignants.total_users} rate="" />
        <CardDataStats title="Jurys" total={jurys} rate="" />
        <CardDataStats title="Maîtres de mémoire" total={maitreMemoireProgramme} rate="" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
        <CardDataStats title="Mémoires déposés" total={memoiresDeposees} rate="" />
        <CardDataStats title="Mémoires validés" total={memoiresValides} rate="" />
        <ChartOne />
      </div>
    </>
  );
};

export default ECommerce;
