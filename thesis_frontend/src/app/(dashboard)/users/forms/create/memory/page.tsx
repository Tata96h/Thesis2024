"use client";
import { useState } from "react";
// import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AlertMessage from "@/components/AlertMessage/page";

const DepotMemoire = () => {
  const [messageType, setMessageType] = useState<"success" | "error" | undefined>(undefined);
  const [message, setMessage] = useState("");
  

  const [formData, setFormData] = useState({
    typeDepot:"",
    matricules: [],
    theme: "",
    annee_id: 1,
    fichier: null,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(value);
  };

  const handleFileChange = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      fichier: event.target.files[0],
    }));
    console.log(event.target.files[0]);
    
  };
const handleReset = (e) => {
        e.preventDefault();
        // document.getElementById("sub").disabled = true;
        const inputs = document.querySelectorAll("input , textarea");
        for (let i = 0; i < inputs.length; i++) {
          inputs[i].value = "";
        }
      };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { typeDepot, matricules, theme, fichier } = formData;
  
    if (typeDepot === "Monôme" && (!matricules[0] || !theme || !fichier)) {
      setMessageType("error");
      setMessage("Tous les champs sont obligatoires !");
      return;
    }
  
    if (typeDepot === "Binôme" && (matricules.length < 2 || !matricules[0] || !matricules[1] || !theme || !fichier)) {
      setMessageType("error");
      setMessage("Tous les champs sont obligatoires !");
      return;
    }
  
    try {
      let numero = 'A1233'
      // Créez un nouvel objet FormData pour envoyer les données
      const formDataToSend = new FormData();
      formDataToSend.append('theme', theme);
      formDataToSend.append('numero', numero);
      formDataToSend.append('fichier', fichier);
      formDataToSend.append('annee_id', formData.annee_id.toString());
  
      console.log(formDataToSend);
      // Convertissez les matricules en chaîne JSON
      const matriculesParam = JSON.stringify(matricules);
  
      const accessToken = localStorage.getItem("access_token");
      const tokenType = localStorage.getItem("token_type");
  
      // Construisez l'URL avec les matricules en paramètre de requête
      const url = `http://127.0.0.1:8000/thesis/?matricules=${encodeURIComponent(matriculesParam)}`;
  
      const response = await fetch(url, {
        method: "POST",
        body: formDataToSend,
        headers: {
          "Authorization": `${tokenType} ${accessToken}`,
        },
      });
  
      if (response.ok) {
        setMessageType("success");
        setMessage("Dépôt de mémoire effectué avec succès !");
        // Réinitialiser le formulaire ou rediriger
      } else {
        setMessageType("error");
        setMessage(`Échec du dépôt : ${response.statusText}`);
      }
    } catch (error) {
      setMessageType("error");
      setMessage(`Une erreur est survenue lors du dépôt : ${error.message}`);
    }
  };

  return (
    // <DefaultLayout>
      <div className="flex justify-center pt-5">
        <div className="w-full max-w-4xl px-4">
          <div className="flex flex-col gap-9">
          
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              
              <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark mb-3">
                <h3 className="text-3xl font-extrabold text-blue-500 dark:text-white">
                  Dépôt de Mémoire
                </h3>
                <div className="mt-5">
                  {message && <AlertMessage type={messageType || 'success'} message={message} />}
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="p-6.5">
                <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Type de dépôt
                    </label>
                    <select
                      name="typeDepot"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      onChange={handleInputChange}
                    >
                      <option value="">Sélectionnez le type de dépôt</option>
                      <option value="Monôme">Monôme</option>
                      <option value="Binôme">Binôme</option>
                    </select>
                  </div>

                  {formData.typeDepot === "Monôme" && (
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Matricule
                        </label>
                        <input
                          type="text"
                          name="binome1"
                          placeholder="Matricule du premier membre du binôme"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                          onChange={handleInputChange}
                        />
                      </div>
                  )}

                  {formData.typeDepot === "Binôme" && (
                    <>
                      <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Matricule 1
                        </label>
                        <input
                          type="text"
                          name="binome1"
                          placeholder="Matricule du premier membre du binôme"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Matricule 2
                        </label>
                        <input
                          type="text"
                          name="binome2"
                          placeholder="Matricule du second membre du binôme"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                          onChange={handleInputChange}
                        />
                      </div>
                    </>
                  )}


                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Thème du mémoire
                    </label>
                    <input
                      type="text"
                      name="theme"
                      placeholder="Entrez le thème du mémoire"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      onChange={handleInputChange}
                    />
                  </div>


                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Fichier du mémoire
                    </label>
                    <input
                      type="file"
                      name="fichierMemoire"
                      accept=".pdf,.doc,.docx"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      onChange={handleFileChange}
                    />
                  </div>

                  <div className="flex justify-center space-x-20 mt-6 ">
                <div className="">

                  <button
                    className=" w-25 h-12 rounded bg-blue-500 p-3 font-medium text-gray hover:bg-opacity-80 border-r-3 "
                    id="sub"
                  >
                    Déposer
                  </button>
                </div>
                <div className="">

                  <button
                    className="w-25 h-12 border-r-3 rounded bg-black p-3 font-medium text-gray hover:bg-opacity-80"
                    id="" onClick={handleReset}
                  >
Annuler                  </button>
                </div>
                </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    // </DefaultLayout>
  );
};

export default DepotMemoire;