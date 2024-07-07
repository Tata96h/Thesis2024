"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowBigLeft, Menu, Settings, User, FileText, Briefcase, Home } from "lucide-react";

interface UserInfo {
  firstName: string;
  lastName: string;
  matricule: string;
  grade: string;
  department: string;
  profileImage: string;
}

const EtudiantDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const sidebar = useRef<any>(null);

  // Ces valeurs devraient idéalement provenir d'une API ou d'un état global
  const maitreMemoire = "Dr. Jane Doe";
  const memoireDepose = false;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('http://your-fastapi-url/api/user/1');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données utilisateur');
        }
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Tableau de bord de l'étudiant</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Maître-mémoire</h2>
                {maitreMemoire ? (
                  <p className="text-green-600">{maitreMemoire}</p>
                ) : (
                  <p className="text-red-600">Aucun maître-mémoire choisi</p>
                )}
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">État du mémoire</h2>
                {memoireDepose ? (
                  <p className="text-green-600">Mémoire déposé</p>
                ) : (
                  <p className="text-red-600">Mémoire non déposé</p>
                )}
              </div>
            </div>
          </div>
        );
      case "profile":
        return <div>Contenu du profil</div>;
      case "memoire":
        return <div>Contenu du dépôt de mémoire</div>;
      case "stage":
        return <div>Contenu du stage</div>;
      default:
        return <div>Sélectionnez un onglet</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-black rounded-md lg:hidden"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      <aside
        ref={sidebar}
        className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:translate-x-0`}
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

          <button
            onClick={() => setSidebarOpen(false)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            className="block lg:hidden"
          >
            <ArrowBigLeft />
          </button>
        </div>

        <div className="flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
            <div className="mb-6 flex flex-col items-center">
              <div className="relative mb-4 h-28 w-28 rounded-full">
                <Image
                  src={"/images/user/user-01.png"}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                  alt="user profile"
                />
              </div>
              <h3 className="mb-1 text-xl font-semibold text-white">
                {userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : "John Doe"}
              </h3>
              <p className="mb-1 text-sm text-white/60">
                {userInfo ? userInfo.matricule : "Matricule:19650122"}
              </p>
              {userInfo && (
                <>
                  <p className="mb-1 text-sm text-white/60">{userInfo.grade}</p>
                  <p className="text-sm text-white/60">{userInfo.department}</p>
                </>
              )}
            </div>

            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center w-full text-white mb-4 p-2 rounded hover:bg-gray-700 ${activeTab === "dashboard" ? "bg-gray-700" : ""}`}
            >
              <Home className="mr-2" />
              Tableau de bord
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center w-full text-white mb-4 p-2 rounded hover:bg-gray-700"
            >
              <Settings className="mr-2" />
              Paramètres
            </button>

            {showSettings && (
              <div className="ml-4">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center text-white mb-2 p-2 rounded hover:bg-gray-700 ${activeTab === "profile" ? "bg-gray-700" : ""}`}
                >
                  <User className="mr-2" />
                  Profil
                </button>
                <button
                  onClick={() => setActiveTab("memoire")}
                  className={`flex items-center text-white mb-2 p-2 rounded hover:bg-gray-700 ${activeTab === "memoire" ? "bg-gray-700" : ""}`}
                >
                  <FileText className="mr-2" />
                  Dépôt de mémoire
                </button>
                <button
                  onClick={() => setActiveTab("stage")}
                  className={`flex items-center text-white mb-2 p-2 rounded hover:bg-gray-700 ${activeTab === "stage" ? "bg-gray-700" : ""}`}
                >
                  <Briefcase className="mr-2" />
                  Stage
                </button>
              </div>
            )}
          </nav>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div className="container mx-auto px-6 py-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default EtudiantDashboard;