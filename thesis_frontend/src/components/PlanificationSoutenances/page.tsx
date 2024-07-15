// "use client"
// import React, { useState, useEffect } from 'react';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';

// const PlanificationSoutenances = () => {
//   const [soutenances, setSoutenances] = useState([]);
//   const [enseignantInfo, setEnseignantInfo] = useState(null);

//   useEffect(() => {
//     const fetchEnseignantInfo = () => {
//       const storedEnseignantInfo = localStorage.getItem('enseignantInfo');
//       if (storedEnseignantInfo) {
//         try {
//           const parsedEnseignantInfo = JSON.parse(storedEnseignantInfo);
//           setEnseignantInfo(parsedEnseignantInfo);
          
          
//         } catch (error) {
//           console.error("Erreur lors du parsing des données enseignant:", error);
//         }
//       }
//     };

//     const fetchPlanificationInfo = () => {
//       const storedInfo = localStorage.getItem('planificationInfo');
//       if (storedInfo && enseignantInfo) {
//         try {
//           const parsedInfo = JSON.parse(storedInfo);
//           const filteredSoutenances = parsedInfo.filter(
//             soutenance => soutenance.departement_id === enseignantInfo.departement_id
//           );
//           setSoutenances(filteredSoutenances);
//         } catch (error) {
//           console.error("Erreur lors du parsing des données de planification:", error);
//         }
//       }
//     };

//     fetchEnseignantInfo();
//     fetchPlanificationInfo();

//     // window.addEventListener('storage', () => {
//     //   fetchEnseignantInfo();
//     //   fetchPlanificationInfo();
//     // });

//     // return () => {
//   //     window.removeEventListener('storage', () => {
//   //       fetchEnseignantInfo();
//   //       fetchPlanificationInfo();
//   //     });
//   //   };
//    }, [enseignantInfo]);

//   const downloadPDF = () => {
//     const doc = new jsPDF();
    
//     doc.setFontSize(18);
//     doc.text('Planification des Soutenances', 14, 22);
    
//     const columns = ["Date", "Heure", "Thème", "Jury", "Salle", "Étudiant 1", "Étudiant 2"];
    
//     const data = soutenances.map(s => [
//       s.date,
//       s.heure,
//       s.theme || 'N/A',
//       s.jury,
//       s.salle,
//       s.etudiant1 || '-',
//       s.etudiant2 || '-'
//     ]);

//     doc.autoTable({
//       head: [columns],
//       body: data,
//       startY: 30,
//       styles: { fontSize: 8 },
//       columnStyles: { 
//         2: { cellWidth: 40 },
//         3: { cellWidth: 30 }
//       }
//     });

//     doc.save("planification_soutenances.pdf");
//   };

//   if (!enseignantInfo) {
//     return <div>Chargement des informations...</div>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Planification des Soutenances - Département {enseignantInfo.departement.nom}</h1>
//         <button 
//           onClick={downloadPDF}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Télécharger PDF
//         </button>
//       </div>
//       {soutenances.length > 0 ? (
//         <div className="overflow-x-auto shadow-md sm:rounded-lg">
//           <table className="w-full text-sm text-left text-gray-500">
//             <thead className="text-xs text-gray-700 uppercase bg-gray-50">
//               <tr>
//                 <th scope="col" className="px-6 py-3">Date</th>
//                 <th scope="col" className="px-6 py-3">Heure</th>
//                 <th scope="col" className="px-6 py-3">Thème</th>
//                 <th scope="col" className="px-6 py-3">Jury</th>
//                 <th scope="col" className="px-6 py-3">Salle</th>
//                 <th scope="col" className="px-6 py-3">Étudiant 1</th>
//                 <th scope="col" className="px-6 py-3">Étudiant 2</th>
//               </tr>
//             </thead>
//             <tbody>
//               {soutenances.map((soutenance, index) => (
//                 <tr key={index} className="bg-white border-b hover:bg-gray-50">
//                   <td className="px-6 py-4">{soutenance.date}</td>
//                   <td className="px-6 py-4">{soutenance.heure}</td>
//                   <td className="px-6 py-4 font-medium text-gray-900">{soutenance.theme || 'N/A'}</td>
//                   <td className="px-6 py-4">{soutenance.jury}</td>
//                   <td className="px-6 py-4">{soutenance.salle}</td>
//                   <td className="px-6 py-4">{soutenance.etudiant1 || '-'}</td>
//                   <td className="px-6 py-4">{soutenance.etudiant2 || '-'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div>Aucune soutenance planifiée pour votre département.</div>
//       )}
//     </div>
//   );
// };

// export default PlanificationSoutenances;



// // h


// // "use client"
// // import React, { useEffect, useRef } from 'react';
// // import $ from 'jquery';
// // import 'datatables.net';

// // const PlanificationSoutenances: React.FC = () => {
// //   const tableRef = useRef<HTMLTableElement>(null);
// //   const dataTableRef = useRef<any>(null);

// //   useEffect(() => {
// //     if (typeof window !== 'undefined') {
// //       require('datatables.net-dt');
// //     }

// //     if (tableRef.current) {
// //       dataTableRef.current = $(tableRef.current).DataTable({
// //         pageLength: 15,
// //         language: {
// //           url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/French.json",
// //         },
// //         drawCallback: function (settings) {
// //           $("tbody tr").each(function (index) {
// //             $(this).css("animation-delay", index * 0.05 + "s");
// //           });
// //         },
// //       });
// //     }

// //     return () => {
// //       if (dataTableRef.current) {
// //         dataTableRef.current.destroy();
// //         dataTableRef.current = null;
// //       }
// //     };
// //   }, []);

// //   return (
// //     <div className="container">
// //       <h1>Dictionnaire de Données Interactif</h1>
// //       <table ref={tableRef} id="dataTable">
// //         <thead>
// //           <tr>
// //             <th>Attribut</th>
// //             <th>Description</th>
// //             <th>Type</th>
// //             <th>Taille</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {/* Copiez ici les lignes de votre table */}
// //           <tr>
// //             <td>id</td>
// //             <td>Identifiant unique</td>
// //             <td>int</td>
// //             <td>-</td>
// //           </tr>
// //           {/* ... autres lignes ... */}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // export default PlanificationSoutenances;



"use client"
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import React, { useState, useEffect } from 'react';

const PlanificationSoutenances = () => {
  const [soutenances, setSoutenances] = useState([]);
  const [enseignantInfo, setEnseignantInfo] = useState(null);

  useEffect(() => {
    const fetchEnseignantInfo = () => {
      const storedEnseignantInfo = localStorage.getItem('enseignantInfo');
      if (storedEnseignantInfo) {
        try {
          const parsedEnseignantInfo = JSON.parse(storedEnseignantInfo);
          setEnseignantInfo(parsedEnseignantInfo);
          fetchPlanificationInfo(parsedEnseignantInfo);
        } catch (error) {
          console.error("Erreur lors du parsing des données enseignant:", error);
        }
      }
    };

    const fetchPlanificationInfo = (enseignantData) => {
      const storedInfo = localStorage.getItem('planificationInfo');
      console.log(storedInfo);
      
      if (storedInfo && enseignantData) {
        try {
          const parsedInfo = JSON.parse(storedInfo);
          const filteredSoutenances = parsedInfo.filter(
            soutenance => soutenance.departement_id === enseignantData.departement_id
          );
          setSoutenances(filteredSoutenances);
          console.log(soutenances);
          
        } catch (error) {
          console.error("Erreur lors du parsing des données de planification:", error);
        }
      }
    };

    fetchEnseignantInfo();
  }, []);

  
    const downloadPDF = () => {
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text('Planification des Soutenances', 14, 22);
      
      const columns = ["Date", "Heure", "Thème", "Jury", "Salle", "Étudiant 1", "Étudiant 2"];
      
      const data = soutenances.map(s => [
        s.date,
        s.heure,
        s.theme || 'N/A',
        s.jury,
        s.salle,
        s.etudiant1 || '-',
        s.etudiant2 || '-'
      ]);
  
      doc.autoTable({
        head: [columns],
        body: data,
        startY: 30,
        styles: { fontSize: 8 },
        columnStyles: { 
          2: { cellWidth: 40 },
          3: { cellWidth: 30 }
        }
      });
  
      doc.save("planification_soutenances.pdf");
    };
  
    if (!enseignantInfo) {
      return <div>Chargement des informations...</div>;
    }

    return (
    //   <>
    // <DefaultLayout>
          <div className="container mx-auto p-4 mt-20">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Planification des Soutenances - Département {enseignantInfo.departement.nom}</h1>
              <button 
                onClick={downloadPDF}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Télécharger PDF
              </button>
            </div>
            {soutenances.length > 0 ? (
              <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Date</th>
                      <th scope="col" className="px-6 py-3">Heure</th>
                      <th scope="col" className="px-6 py-3">Thème</th>
                      <th scope="col" className="px-6 py-3">Jury</th>
                      <th scope="col" className="px-6 py-3">Salle</th>
                      <th scope="col" className="px-6 py-3">Étudiant 1</th>
                      <th scope="col" className="px-6 py-3">Étudiant 2</th>
                    </tr>
                  </thead>
                  <tbody>
                    {soutenances.map((soutenance, index) => (
                      <tr key={index} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{soutenance.date}</td>
                        <td className="px-6 py-4">{soutenance.heure}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{soutenance.theme || '-'}</td>
                        <td className="px-6 py-4">{soutenance.jury}</td>
                        <td className="px-6 py-4">{soutenance.salle}</td>
                        <td className="px-6 py-4">{soutenance.etudiant1 || '-'}</td>
                        <td className="px-6 py-4">{soutenance.etudiant2 || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div>Aucune soutenance planifiée pour le département {enseignantInfo.departement.nom}.</div>
            )}
          </div>
          // </DefaultLayout>
          // </>
        );
      };
      
      export default PlanificationSoutenances;