"use client";
import React from "react";
import CardDataStats from "../CardDataStats";
import ChartOne from "../Charts/ChartOne";

const ECommerce: React.FC = () => {
  // Supposons que vous ayez récupéré ces données d'une API
  const stats = {
    etudiants: 85,
    enseignants: 20,
    jurys: 15,
    maitreMemoireProgramme: 10,
    memoires: {
      deposes: 30,
      valides: 25
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mt-20">
        <CardDataStats title="Étudiants" total={stats.etudiants} rate="">
          {/* Icône pour étudiants */}
        </CardDataStats>
        <CardDataStats title="Enseignants" total={stats.enseignants} rate="">
          {/* Icône pour enseignants */}
        </CardDataStats>
        <CardDataStats title="Jurys" total={stats.jurys} rate="">
          {/* Icône pour jurys */}
        </CardDataStats>
        <CardDataStats title="Maîtres de mémoire" total={stats.maitreMemoireProgramme} rate="">
          {/* Icône pour maîtres de mémoire */}
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
        <CardDataStats title="Mémoires déposés" total={stats.memoires.deposes} rate="">
          {/* Icône pour mémoires déposés */}
        </CardDataStats>
        <CardDataStats title="Mémoires validés" total={stats.memoires.valides} rate="">
          {/* Icône pour mémoires validés */}
        </CardDataStats>
        <ChartOne />

      </div>
    </>
  );
};

export default ECommerce;