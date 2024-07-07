"use client"
import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const soutenances = [
  {
    heure: "09:00",
    date: "2024-07-15",
    theme: "Intelligence Artificielle et Apprentissage Profond",
    jury: {
      numero: 1,
      membres: ["Dr. Martin Dupont", "Pr. Sophie Laurent", "M. Jean Dubois"]
    },
    salle: "A101",
    anneeAcademique: "2023-2024",
    etudiant1: { nom: "Dupont", prenom: "Marie" },
    etudiant2: { nom: "Martin", prenom: "Jean" }
  },
  {
    heure: "10:30",
    date: "2024-07-15",
    theme: "Développement Durable et Énergies Renouvelables",
    jury: {
      numero: 2,
      membres: ["Dr. Claire Leroy", "Pr. Thomas Bernard", "Mme. Marie Petit"]
    },
    salle: "B205",
    anneeAcademique: "2023-2024",
    etudiant1: { nom: "Durand", prenom: "Sophie" },
    etudiant2: null
  },
  // Ajoutez d'autres soutenances ici...
];

const PlanificationSoutenances = () => {
  const downloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Planification des Soutenances', 14, 22);
    
    const columns = ["Date", "Heure", "Thème", "Jury n°", "Membres du jury", "Salle", "Année académique", "Étudiant 1", "Étudiant 2"];
    
    const data = soutenances.map(s => [
      s.date,
      s.heure,
      s.theme,
      s.jury.numero,
      s.jury.membres.join(", "),
      s.salle,
      s.anneeAcademique,
      s.etudiant1 ? `${s.etudiant1.nom} ${s.etudiant1.prenom}` : '-',
      s.etudiant2 ? `${s.etudiant2.nom} ${s.etudiant2.prenom}` : '-'
    ]);

    doc.autoTable({
      head: [columns],
      body: data,
      startY: 30,
      styles: { fontSize: 8 },
      columnStyles: { 
        2: { cellWidth: 40 },
        4: { cellWidth: 60 }
      }
    });

    doc.save("planification_soutenances.pdf");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Planification des Soutenances</h1>
        <button 
          onClick={downloadPDF}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Télécharger PDF
        </button>
      </div>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-6 py-3">Heure</th>
              <th scope="col" className="px-6 py-3">Thème</th>
              <th scope="col" className="px-6 py-3">Jury n°</th>
              <th scope="col" className="px-6 py-3">Salle</th>
              <th scope="col" className="px-6 py-3">Année académique</th>
              <th scope="col" className="px-6 py-3">Étudiant 1</th>
              <th scope="col" className="px-6 py-3">Étudiant 2</th>
            </tr>
          </thead>
          <tbody>
            {soutenances.map((soutenance, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">{soutenance.date}</td>
                <td className="px-6 py-4">{soutenance.heure}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{soutenance.theme}</td>
                <td className="px-6 py-4">{soutenance.jury.numero}</td>
                <td className="px-6 py-4">{soutenance.salle}</td>
                <td className="px-6 py-4">{soutenance.anneeAcademique}</td>
                <td className="px-6 py-4">
                  {soutenance.etudiant1 ? `${soutenance.etudiant1.nom} ${soutenance.etudiant1.prenom}` : '-'}
                </td>
                <td className="px-6 py-4">
                  {soutenance.etudiant2 ? `${soutenance.etudiant2.nom} ${soutenance.etudiant2.prenom}` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlanificationSoutenances;