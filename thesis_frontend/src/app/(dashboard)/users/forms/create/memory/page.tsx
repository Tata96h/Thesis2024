import { useEffect, useState } from "react";
import AlertMessage from "@/components/AlertMessage/page";

const DepotMemoire = () => {
  const [messageType, setMessageType] = useState<"success" | "error" | undefined>(undefined);
  const [message, setMessage] = useState("");
  const [memoireInfo, setMemoireInfo] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [memoire, setMemoire] = useState({
    theme: "",
    fichier: null
  });

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    const storedMemoireInfo = localStorage.getItem('memoireInfo');

    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedUserInfo);
      
      if (storedMemoireInfo) {
        const parsedMemoireInfo = JSON.parse(storedMemoireInfo);
        setMemoireInfo(parsedMemoireInfo);
      }
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMemoire((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    setMemoire((prevState) => ({
      ...prevState,
      fichier: event.target.files[0],
    }));
  };

  const handleReset = (e) => {
    e.preventDefault();
    setMemoire({
      theme: "",
      fichier: null
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { theme, fichier } = memoire;

    if (!theme || !fichier) {
      setMessageType("error");
      setMessage("Tous les champs sont obligatoires !");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('numero', memoireInfo.numero);
      formData.append('theme', theme);
      formData.append('fichier', fichier);
      console.log(formData);
      
      const response = await fetch(`http://127.0.0.1:8000/thesis/${memoireInfo.numero}?utilisateur_id=${userInfo.utilisateur_id}`, {
        method: "PATCH",
        body: formData,
      });

      if (response.ok) {
        setMessageType("success");
        setMessage("Votre mémoire a été enregistré avec succès.");
        console.log("Mémoire enregistré :", memoire);
        setMemoire({
          theme: "",
          fichier: null
        });
      } else {
        setMessageType("error");
        setMessage("Erreur lors de l'enregistrement du mémoire.");
        console.error("Erreur lors de l'enregistrement du mémoire :", response.status);
      }
    } catch (error) {
      setMessageType("error");
      setMessage("Erreur lors de l'enregistrement du mémoire.");
      console.error("Erreur lors de l'enregistrement du mémoire :", error);
    }
  };

  return (
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
                    value={memoire.theme}
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
                      type="submit"
                      className="w-25 h-12 rounded bg-blue-500 p-3 font-medium text-gray hover:bg-opacity-80 border-r-3"
                      id="sub"
                    >
                      Déposer
                    </button>
                  </div>
                  <div className="">
                    <button
                      type="button"
                      className="w-25 h-12 border-r-3 rounded bg-black p-3 font-medium text-gray hover:bg-opacity-80"
                      onClick={handleReset}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepotMemoire;
