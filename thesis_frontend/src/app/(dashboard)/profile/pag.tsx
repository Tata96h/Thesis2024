"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { EnseignantTable } from "@/components/Tables/enseignants-tables/enseignants-tables";

export const data: Metadata = {
  title: "SM Admin - Profile",
  description: "User Profile Page",
};

const Profile = () => {

  const [error, setError] = useState("");
  const [gradeOptions, setGradeOptions] = useState([]);
  const [departementOptions, setDepartementOptions] = useState([]);
  const [messageType, setMessageType] = useState<"success" | "error" | undefined>(undefined);
  const [message, setMessage] = useState("");
  

  const [formData, setFormData] = useState({
    nom: "",
    prenoms: "",
    matricule: "",
    grade_id: "",
    username: "",
    departement_id: "",
  });

  const handleNomChange = (event) => {
    const newNomValue = event.target.value;

    setFormData((prevState) => ({
      ...prevState,
      nom: newNomValue,
    }));
    console.log(newNomValue);
  };

  const handlePrenomChange = (event) => {
    const newPrenomValue = event.target.value;

    setFormData((prevState) => ({
      ...prevState,
      prenoms: newPrenomValue,
    }));
    console.log(newPrenomValue);
  };

  const handleMatriculeChange = (event) => {
    const newMatriculeValue = event.target.value;

    setFormData((prevState) => ({
      ...prevState,
      matricule: newMatriculeValue,
    }));
    console.log(newMatriculeValue);
  };

  
  const handleGradeChange = (event) => {
    const newGradeValue = event.target.value;

    setFormData((prevState) => ({
      ...prevState,
      grade_id: newGradeValue,
    }));
    console.log(newGradeValue);
  };

  
  const handleUsernameChange = (event) => {
    const newUsernameValue = event.target.value;

    setFormData((prevState) => ({
      ...prevState,
      username: newUsernameValue,
    }));
    console.log(newUsernameValue);
  };
 const handleDepartementChange = (event) => {
    const newDepartementValue = event.target.value;

    setFormData((prevState) => ({
      ...prevState,
      departement_id: newDepartementValue,
    }));
    console.log(newDepartementValue);
  };

  useEffect(() => {
   
    const fetchGradeOptions = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/enseignants/get_grades/"
        );
        if (response.ok) {
          const grades = await response.json();
          setGradeOptions(grades.map((grade) => ({ value: grade.id, label: grade.nom })))
          
        } else {
          console.error(
            "Erreur lors de la récupération des grades :",
            response.status
          );
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des grades :", error);
      }
    };
    fetchGradeOptions();

    const fetchDepartementOptions = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/enseignants/get_departements/"
        );
        if (response.ok) {
          const departements = await response.json();
          setDepartementOptions(departements.map((departement) => ({ value: departement.id, label: departement.nom })));
 
        } else {
          console.error(
            "Erreur lors de la récupération des départements :",
            response.status
          );
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des départements :", error);
      }
    };

    fetchDepartementOptions();
  }, []);

 
   


 

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="Profile" />

        <div className="container mx-auto">
          <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="relative z-20 h-35 md:h-65">
              <Image
                src={EnseignantTable.profileImage}
                alt="profile cover"
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute bottom-1 right-1 z-10">
                <label htmlFor="profileImage" className="cursor-pointer">
                  <input
                    type="file"
                    id="profileImage"
                    className="hidden"
                    // onChange={handleImageChange}
                    accept="image/*"
                  />
                  <span className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90">
                    <svg
                      className="fill-current"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                        fill=""
                      />
                    </svg>
                  </span>
                </label>
              </div>
            </div>

            <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
              <div className="relative z-30 mx-auto -mt-22 h-30 w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:w-44 sm:p-3">
                <div className="relative drop-shadow-2">
                  <Image
                    src={EnseignantTable.profileImage}
                    width={160}
                    height={160}
                    alt="profile"
                    className="rounded-full"
                  />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                  {EnseignantTable.prenoms} {EnseignantTable.nom}
                </h3>
                <p className="font-medium" onChange={handleGradeChange}>{EnseignantTable.grade_id}</p>
                <p className="font-medium"onChange={handleDepartementChange}>{EnseignantTable.departement_id}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
              <h4 className="mb-4 text-xl font-semibold text-black dark:text-white">
                Informations personnelles
              </h4>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-1 block text-black dark:text-white">
                    Matricule
                  </label>
                  <input
                    type="text"
                    value={EnseignantTable.matricule}
                    readOnly
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-black dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    value={EnseignantTable.email}
                    readOnly
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
              <h4 className="mb-4 text-xl font-semibold text-black dark:text-white">
                Biographie
              </h4>
              {/* <div>
                <textarea
                  rows={4}
                  value={EnseignantTable.bio}
                  // onChange={handleBiographyChange}
                  disabled={!editMode}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                ></textarea>
              </div>
              <div className="mt-4 flex justify-end">
                {editMode ? (
                  <button
                    onClick={saveChanges}
                    className="inline-flex items-center justify-center rounded-md border border-primary py-2 px-6 text-center font-medium text-primary hover:bg-opacity-90"
                  >
                    Enregistrer
                  </button>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="inline-flex items-center justify-center rounded-md border border-primary py-2 px-6 text-center font-medium text-primary hover:bg-opacity-90"
                  >
                    Modifier
                  </button>
                )}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Profile;