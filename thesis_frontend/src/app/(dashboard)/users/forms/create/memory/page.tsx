"use client";
import { useEffect,useState } from "react";
// import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AlertMessage from "@/components/AlertMessage/page";

const DepotMemoire = () => {
  const [messageType, setMessageType] = useState<"success" | "error" | undefined>(undefined);
  const [message, setMessage] = useState("");
  const [memoireInfo, setMemoireInfo] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    const storedMemoireInfo = localStorage.getItem('memoireInfo');


      if (storedUserInfo) {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedUserInfo);
      
        if (storedMemoireInfo) {
          const parsedMemoireInfo = JSON.parse(storedMemoireInfo);
          setMemoireInfo(parsedMemoireInfo);
              
          // Fonction pour récupérer le label du rôle depuis l'API backend
      
      }
    }
  }, []);


  const [formData, setFormData] = useState({
    theme: "",
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
    const { theme, fichier } = formData;
  
    if (!theme || !fichier) {
      setMessageType("error");
      setMessage("Tous les champs sont obligatoires !");
      return;
    }else {
      try {
        // Ensure `numero` is set before sending the request
        const updatedChoix = { ...formData, numero: memoireInfo.numero };

        const response = await fetch(`http://127.0.0.1:8000/thesis/${memoireInfo.numero}?utilisateur_id=${userInfo.utilisateur_id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedChoix),
        });

        if (response.ok) {
          setMessage("Votre memoire ont été enregistrés avec succès.");
          console.log("Memoire enregistrés :", updatedChoix);
        } else {
          setMessage("Erreur lors de l'enregistrement du memoire.");
          console.error("Erreur lors de l'enregistrement du memoire :", response.status);
        }
      } catch (error) {
        setMessage("Erreur lors de l'enregistrement du memoire.");
        console.error("Erreur lors de l'enregistrement du memoire :", error);
      }
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