"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
// import { toast } from "react-toastify";

const Enseignant = () => {
  const [user, setuser] = useState([]);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/enseignants/${matricule}/`)
      .then((response) => {
        setuser(response.data);
        console.log("Données récupération réussie!");
      })
      .catch((error) => {
        console.error("Echec lors de la récupération :", error);
        // user.warn("Echec lors de la récupération", {
        //   position: "bottom-left",
        // });
      });
    // const targetDate = new Date(user && user.date_fin_prevue); // March 28, 2024
  });
  return (
    <div>
      {user.map((enseignant) => (
        <tr key={index}>
          <td className="text-center">
            <input type="checkbox" name="choix" />
          </td>
          <td className="text-center">{index + 1}</td>
          <td className="text-center">{enseignant.matricule}</td>
          {/* <td className="text-center">
                                {projet.description}
                              </td>
                              <td className="text-center">
                                {projet.date_debut} au {projet.date_fin_prevue}
                              </td> */}
          {/* <td className="text-center">{projet.date_fin_prevue}</td> */}
          {/* <td className="text-center">{projet.statut}</td> */}
        </tr>
      ))}
    </div>
  );
};

export default Enseignant;
