// pages/student-form.js
"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { log } from 'console';


export default function StudentForm() {
  const [formType, setFormType] = useState('');
  const [matricule, setMatricule] = useState('');
  const [matricule1, setMatricule1] = useState('');
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [parsedUserInfo, setParsedUserInfo] = useState([]);

  useEffect(() => {
    setMounted(true);
    // const storedUserInfo = localStorage.getItem('userInfo');
    // if (storedUserInfo) {
    //   const parsedUserInfo = JSON.parse(storedUserInfo);
    //   console.log(parsedUserInfo);
    // }
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
       setUserInfo(parsedUserInfo);
    

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
            // console.log('Mise à jour de parsedUserInfo:', parsedUserInfo);
            
            // setUserInfo(parsedUserInfo);
          } else {
            console.error('Le champ libelle est manquant dans les données retournées:', data);
          }
          
          // Exemple pour la récupération des données de l'enseignant (à adapter selon votre API)
          if (parsedUserInfo.utilisateur_id && parsedUserInfo.roleLabel === 'Etudiant') {
            const urlMatricule = `http://127.0.0.1:8000/etudiants/${parsedUserInfo.utilisateur_id}`;
            const responseMatricule = await fetch(urlMatricule, {
              method: 'GET',
            });
            if (responseMatricule.ok) {
              const dataMemoire = await responseMatricule.json();
              setMatricule(dataMemoire.matricule); 
              
              
            } else {
              console.error('Erreur lors de la récupération des informations de Memoire :', responseMatricule.status);
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


  const titleVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "tween",
        duration: 1,
        ease: "easeOut"
      }
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    

  
    const baseUrl = 'http://127.0.0.1:8000/thesis/';
    const queryParams = new URLSearchParams({
      matricules: `${matricule}${formType === 'binome' ? ',' + matricule1 : ''}`,
      utilisateur_id: userInfo ? userInfo.utilisateur_id : '',
    });
  
    const url = `${baseUrl}?${queryParams.toString()}`;
  
    try {
      const year = 4;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formType, matricule, matricule1, year }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Formulaire soumis avec succès:', data);
        router.push('/etudiant'); // Redirection vers /etudiant après soumission réussie
      } else {
        setError(data.message || 'Une erreur est survenue lors de la soumission du formulaire.');
      }
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      // setError('Une erreur s\'est produite lors de la soumission du formulaire.');
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/soutenance-background.jpg" 
          layout="fill"
          objectFit="cover"
          quality={100}
          alt="Soutenance background"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-md w-full space-y-8 bg-white bg-opacity-90 p-10 rounded-xl shadow-lg">
          <motion.h1 
            className="text-3xl font-extrabold text-center text-gray-900 mb-6"
            initial="hidden"
            animate={mounted ? "visible" : "hidden"}
            variants={titleVariants}
          >
            Bienvenu(e) {userInfo ? `${userInfo.nom} ${userInfo.prenoms}` : ''}
          </motion.h1>
          <h5 className="text-center text-gray-100 mb-6">Vous êtes en </h5>

          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div 
                className={`border-2 p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  formType === 'monome' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-300'
                }`}
                onClick={() => setFormType('monome')}
              >
                <input
                  type="radio"
                  name="formType"
                  value="monome"
                  checked={formType === 'monome'}
                  onChange={(e) => setFormType(e.target.value)}
                  className="hidden"
                />
                <div className="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">Monôme</span>
                </div>
              </div>
              <div 
                className={`border-2 p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  formType === 'binome' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-300'
                }`}
                onClick={() => setFormType('binome')}
              >
                <input
                  type="radio"
                  name="formType"
                  value="binome"
                  checked={formType === 'binome'}
                  onChange={(e) => setFormType(e.target.value)}
                  className="hidden"
                />
                <div className="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="font-medium">Binôme</span>
                </div>
              </div>
            </div>

            {formType && (
              <div className="space-y-4 mt-6">
                <div>
                  <label htmlFor="matricule1" className="block text-sm font-medium text-gray-700 mb-1">
                    {formType === 'monome' ? '' : ''}
                  </label>
                  
                </div>

                {formType === 'binome' && (
                  <div>
                    <label htmlFor="matricule2" className="block text-sm font-medium text-gray-700 mb-1">
                      Matricule du binôme
                    </label>
                    <input
                      type="text"
                      id="matricule2"
                      value={matricule1}
                      onChange={(e) => setMatricule1(e.target.value)}
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Entrez le matricule du binome"
                      required
                    />
                  </div>
                )}


              </div>
            )}
           
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Valider
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      {/* <footer className="bg-gray-800 text-white py-4 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <p>&copy; 2024 Université XYZ. Tous droits réservés.</p>
            <nav>
              <ul className="flex space-x-4">
                <li><a href="#" className="hover:text-blue-300">Accueil</a></li>
                <li><a href="#" className="hover:text-blue-300">Contact</a></li>
                <li><a href="#" className="hover:text-blue-300">Aide</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </footer> */}
    </div>
  );
}