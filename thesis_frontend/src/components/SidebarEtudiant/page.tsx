"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {ArrowBigLeft}from "lucide-react"

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
}

const SidebarEtudiant = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Remplacez l'URL par l'URL de votre API FastAPI
        const response = await fetch('http://your-fastapi-url/api/user/1');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données utilisateur');
        }
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error('Erreur:', error);
        // Gérer l'erreur (par exemple, afficher un message à l'utilisateur)
      }
    };

    fetchUserInfo();
  }, []);

  // ... (garder le reste du code existant pour la gestion du sidebar)

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
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
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
        <button type="reset">        <ArrowBigLeft/>
</button>

      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* <!-- User Info --> */}
            <div className="mb-6 flex flex-col items-center">
              <div className="relative mb-4 h-28 w-28 rounded-full">
                <Image
                  src={ "/images/user/user-01.png"}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                  alt="user profile"
                />
              </div>
              <h3 className="mb-1 text-xl font-semibold text-white">
                {/* {userInfo.firstName} {userInfo.lastName} */}John Doe
              </h3>
              {/* <p className="mb-1 text-sm text-white/60">{userInfo.matricule}</p> */}
              <p className="mb-1 text-sm text-white/60">Matricule:19650122</p>
              {/* <p className="mb-1 text-sm text-white/60">{userInfo.grade}</p> */}
              {/* <p className="text-sm text-white/60">{userInfo.department}</p> */}
            </div>
{/*          
            <div className="mb-6 flex justify-center">
              <p className="text-white">Chargement...</p>
            </div> */}
          
          {/* <!-- User Info --> */}

          {/* Ajoutez ici vos liens de navigation */}
        </nav>
      </div>
    </aside>
  );
};

export default SidebarEtudiant;