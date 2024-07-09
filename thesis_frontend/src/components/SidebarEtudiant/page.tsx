"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowBigLeft, Menu, FileText, Briefcase, Calendar, UserCheck } from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

interface UserInfo {
  firstName: string;
  lastName: string;
  matricule: string;
  grade: string;
  department: string;
  profileImage: string;
  maitreMemoire: string | null;
}

const SidebarEtudiant = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const sidebar = useRef<any>(null);

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [etudiantInfo, setEtudiantInfo] = useState<any>(null);
  const [parsedMemoireInfo, setParsedMemoireInfo] = useState<any>(null);
  const [showDashboard, setShowDashboard] = useState(false);


  useEffect(() => {
    
    const storedUserInfo = localStorage.getItem('userInfo');
    const storedEtudiantInfo = localStorage.getItem('etudiantInfo');
    const storedMemoireInfo = localStorage.getItem('memoireInfo');
    
    if (storedMemoireInfo) {
      const parsedMemoireInfo = JSON.parse(storedMemoireInfo);
      setParsedMemoireInfo(parsedMemoireInfo);
      console.log(parsedMemoireInfo);
      
    }
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);

      if (storedEtudiantInfo) {
        const parsedEtudiantInfo = JSON.parse(storedEtudiantInfo);
        setEtudiantInfo(parsedEtudiantInfo);
      }
      
      
      // Fonction pour récupérer le label du rôle depuis l'API backend
      const fetchRoleLabel = async () => {
       
        try {
          const url = `http://127.0.0.1:8000/etudiants/get_role_by_id/?id=${parsedUserInfo.role}`;  // URL dynamique avec parsedUserInfo.role
          const response = await fetch(url, {
            method: 'GET',
          });
          if (response.ok) {
            const data = await response.json();
            console.log('Données récupérées pour le rôle', parsedUserInfo.role, data);
  
            // Vérifiez que data est un tableau et contient des éléments
            if (data && data.length > 0 && data[0].libelle) {
              const roleLabel = data[0].libelle;  // Accéder au premier élément du tableau
              console.log('Libellé du rôle:', roleLabel);
              
              // Mettre à jour parsedUserInfo avec le label du rôle
              parsedUserInfo.roleLabel = roleLabel;
              console.log('Mise à jour de parsedUserInfo:', parsedUserInfo);
              
              setUserInfo(parsedUserInfo);
            } else {
              console.error('Le champ libelle est manquant dans les données retournées:', data);
            }
            
            // Exemple pour la récupération des données de l'enseignant (à adapter selon votre API)
            if (parsedUserInfo.utilisateur_id && parsedUserInfo.roleLabel === 'Etudiant') {
              const urlEtudiant = `http://127.0.0.1:8000/etudiants/${parsedUserInfo.utilisateur_id}`;
              const responseEtudiant = await fetch(urlEtudiant, {
                method: 'GET',
              });
              if (responseEtudiant.ok) {
                const dataEtudiant = await responseEtudiant.json();
                console.log('Données récupérées pour utilisateur', parsedUserInfo.utilisateur_id, dataEtudiant);
                localStorage.setItem("etudiantInfo", JSON.stringify(dataEtudiant));
                console.log(localStorage);
                
              } else {
                console.error('Erreur lors de la récupération des informations etudoant :', responseEtudiant.status);
              }
            }
            
          } else {
            console.error('Erreur lors de la récupération du label du rôle :', response.status);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération du label du rôle :', error);
        }
      };
      
      fetchRoleLabel();
    }
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.setItem("sessionIsActive", "0");
    localStorage.removeItem('userInfo');
    localStorage.removeItem('etudiantInfo');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tokenType');
    console.log(localStorage);
    
    router.push('/login');
  };

  return (
    <>
      <aside
        ref={sidebar}
        className={`fixed left-0 z-40 flex h-screen w-72 flex-col bg-black duration-300 ease-linear dark:bg-boxdark ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 bg-white">
          <Link href="/">
            <Image
              width={176}
              height={32}
              src={"/images/logo/sm.png"}
              alt="Logo"
              priority
            />
          </Link>
        </div>

        <div className="flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
            <div className="mb-6 flex flex-col items-center">
              <div className="relative mb-4 h-28 w-28 rounded-full">
                <Image
                  src={userInfo?.profileImage || "/images/user/user-01.png"}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                  alt="user profile"
                />
              </div>
              <h3 className="mb-1 text-xl font-semibold text-white">
                {userInfo ? `${userInfo.nom}` : "Doe"}
              </h3>
              <h3 className="mb-1 text-xl font-semibold text-white">
                {userInfo ? `${userInfo.prenoms}` : "John"}
              </h3>
              <p className="mb-1 text-sm text-white/60">
                {etudiantInfo ? `${etudiantInfo.matricule}` : "Null"}
              </p>
              <p className="mb-1 text-sm text-white/60">
                {etudiantInfo ? `${etudiantInfo.filiere.nom}` : "Null"}
              </p>
              {parsedMemoireInfo && userInfo ? (
            (() => {
              try {
                if (!parsedMemoireInfo || parsedMemoireInfo.length === 0) {
                  return <div>Pas de thèses avec étudiants</div>;
                }

                const etudiants = parsedMemoireInfo.etudiants;
                console.log(etudiants);

                if (!etudiants || etudiants.length !== 2) {
                  return <div>Nombre incorrect d'étudiants</div>;
                }

                // Trouver l'étudiant dont le nom et prénom sont différents de userInfo.nom et userInfo.prenom
                const autreEtudiant = etudiants.find(etudiant => (
                  etudiant.nom !== userInfo.nom || etudiant.prenom !== userInfo.prenom
                ));

                if (!autreEtudiant) {
                  return <div>Impossible de trouver un étudiant différent</div>;
                }

                return (
                  <div className="mb-1 text-sm text-white/60">
                    Binôme: {autreEtudiant.nom} {autreEtudiant.prenom}
                  </div>
                );
              } catch (error) {
                console.error("Error parsing memoireInfo:", error);
                return <div>Erreur lors du parsing des données</div>;
              }
            })()
          ) : (
            <div> </div>
          )}



              {userInfo && (
                <>
                  <p className="mb-1 text-sm text-white/60">{userInfo.grade}</p>
                  <p className="text-sm text-white/60">{userInfo.department}</p>
                </>
              )}
            </div>

            
          </nav>
          <button className="flex items-center gap-3.5 px-6 py-1 text-sm font-medium duration-300 ease-in-out text-white lg:text-base mt-50" onClick={handleLogout}> 
            <svg
              className="fill-current"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.5375 0.618744H11.6531C10.7594 0.618744 10.0031 1.37499 10.0031 2.26874V4.64062C10.0031 5.05312 10.3469 5.39687 10.7594 5.39687C11.1719 5.39687 11.55 5.05312 11.55 4.64062V2.23437C11.55 2.16562 11.5844 2.13124 11.6531 2.13124H15.5375C16.3625 2.13124 17.0156 2.78437 17.0156 3.60937V18.3562C17.0156 19.1812 16.3625 19.8344 15.5375 19.8344H11.6531C11.5844 19.8344 11.55 19.8 11.55 19.7312V17.3594C11.55 16.9469 11.2062 16.6031 10.7594 16.6031C10.3125 16.6031 10.0031 16.9469 10.0031 17.3594V19.7312C10.0031 20.625 10.7594 21.3812 11.6531 21.3812H15.5375C17.2219 21.3812 18.5625 20.0062 18.5625 18.3562V3.64374C18.5625 1.95937 17.1875 0.618744 15.5375 0.618744Z"
                fill=""
              />
              <path
                d="M6.05001 11.7563H12.2031C12.6156 11.7563 12.9594 11.4125 12.9594 11C12.9594 10.5875 12.6156 10.2438 12.2031 10.2438H6.08439L8.21564 8.07813C8.52501 7.76875 8.52501 7.2875 8.21564 6.97812C7.90626 6.66875 7.42501 6.66875 7.11564 6.97812L3.67814 10.4844C3.36876 10.7938 3.36876 11.275 3.67814 11.5844L7.11564 15.0906C7.25314 15.2281 7.45939 15.3312 7.66564 15.3312C7.87189 15.3312 8.04376 15.2625 8.21564 15.125C8.52501 14.8156 8.52501 14.3344 8.21564 14.025L6.05001 11.7563Z"
                fill=""
              />
            </svg> 
            Se déconnecter
          </button>
        </div>
      </aside>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 right-4 z-50 p-2 bg-black rounded-md"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>
    </>
  );
};

export default SidebarEtudiant;