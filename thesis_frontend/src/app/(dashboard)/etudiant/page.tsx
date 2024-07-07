"use client";
import { useState } from "react";
import Head from "next/head";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import ChoixMaitreMemoire from "@/components/memory/page";

import DepotMemoire from "../users/forms/create/memory/page";

export default function StudentSpace() {
  const [activeTab, setActiveTab] = useState("tableau de bord");
  const [file, setFile] = useState(null);
  const [theme, setTheme] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: "Jean Dupont",
    email: "jean.dupont@email.com",
    avatar: "https://via.placeholder.com/150",
    department: "Informatique",
    year: "3ème année",
    thesisStatus: "En cours",
    chefmemoryStatus: "Dr AGOSSOU Carlos",
  });

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleThemeChange = (e) => setTheme(e.target.value);
  const handleProfileChange = (e) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const NavBar = () => (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">EspacEtudiant</h1>
        <div className="flex space-x-4">
          {["Tableau de bord", "Mémoire", "Planification"].map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item.toLowerCase())}
              className={`px-3 py-2 rounded-full transition-colors duration-300 ${
                activeTab === item.toLowerCase()
                  ? "bg-black text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-white bg-gray-700 hover:bg-gray-600 p-2 rounded"
        >
          
        </button>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer className="bg-gray-800 text-white p-4 mt-8">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 EspaceEtudiant. Tous droits réservés.</p>
      </div>
    </footer>
  );

  const ProfileSection = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-2/3 md:pl-8">
         
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Statut</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-100 p-4 rounded-lg">
                <h4 className="font-bold text-lg mb-2">Statut du mémoire</h4>
                <p>{profile.thesisStatus}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <h4 className="font-bold text-lg mb-2">Maître-mémoire</h4>
                <p>{profile.chefmemoryStatus}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const UploadThesis = () => {
  const [activeForm, setActiveForm] = useState(null);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex space-x-4 mb-6">
        <div 
          onClick={() => setActiveForm('choix')}
          className={`w-1/2 p-6 rounded-lg cursor-pointer transition-all duration-300 ${
            activeForm === 'choix' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          <h3 className="text-xl font-semibold mb-2">Choix de maître mémoire</h3>
          <p>Cliquez ici pour choisir votre maître de mémoire</p>
        </div>
        <div
          onClick={() => setActiveForm('depot')}
          className={`w-1/2 p-6 rounded-lg cursor-pointer transition-all duration-300 ${
            activeForm === 'depot' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          <h3 className="text-xl font-semibold mb-2">Dépôt de mémoire</h3>
          <p>Cliquez ici pour déposer votre mémoire</p>
        </div>
      </div>

      {activeForm === 'choix' && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <ChoixMaitreMemoire />
        </div>
      )}

      {activeForm === 'depot' && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <DepotMemoire />
        </div>
      )}

      {!activeForm && (
        <p className="text-center text-gray-500 mt-6">
          Veuillez sélectionner une option ci-dessus.
        </p>
      )}
    </div>
  );
};



const PlanningSection = () => {
  const isPlanningAvailable = false; 

  if (!isPlanningAvailable) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <ExclamationTriangleIcon className="h-16 w-16 text-yellow-400" />
          <h2 className="text-2xl font-semibold text-gray-800">Planification</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 max-w-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Cette fonctionnalité n'est pas encore disponible.
                </p>
                <p className="text-sm text-yellow-700 mt-2">
                  Nous travaillons dur pour la mettre en place. Veuillez vérifier ultérieurement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Le contenu réel de la planification ira ici
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Planification</h2>
      {/* Ajoutez ici le contenu de la planification lorsqu'il sera disponible */}
    </div>
  );
};

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Head>
        <title>EspacEtudiant - Profil</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />

      <main className="flex-grow container text-black mx-auto p-4">
        {activeTab === "tableau de bord" && <ProfileSection />}
        {activeTab === "mémoire" && <UploadThesis />}
        {activeTab === "planification" && <PlanningSection />}
      </main>

      <Footer />
    </div>
  );
}