"use client";
import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AlertMessage from '@/components/AlertMessage/page';
import { log } from "console";


const Login = () => {
  const router = useRouter();
  const [treatment, setTreatment] = useState(false);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | undefined>(undefined); 
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("isload", "0");
      const session = localStorage.getItem("sessionIsActive");
      const storedUserInfo = localStorage.getItem('userInfo');

      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }

      if (session === "1" && storedUserInfo) {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        
        
        if (parsedUserInfo.roleLabel === 'etudiant') {
          router.push('/etudiant');
        } else {
          router.push('/dashboard');
        }
      } else {
        // Optionally handle case where session is not active or userInfo is not available
        router.push('/login'); // Example redirect to login if session is not active
      }
    }
  }, [router]);

  
  const handleLogin = async (e) => {
    e.preventDefault();
    setTreatment(true);
    setMessageType("success");
    setMessage("Traitement...");

    if (!username || !password) {
      setMessageType("error");
      setMessage("Les champs sont obligatoires !!!");
      return;
    }

    const formData = { username, password };
    console.log(JSON.stringify(formData));

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        cache: "no-store"
      });

      const responseData = await response.json();
      console.log(responseData);
      console.log(JSON.stringify(responseData));

      if (response.ok) {
        localStorage.setItem("accessToken", responseData.access_token);
        localStorage.setItem("tokenType", responseData.token_type);
        localStorage.setItem("userInfo", JSON.stringify(responseData.user_info));
        localStorage.setItem("sessionIsActive", "1");
        console.log(localStorage);

        // Fetch and set role label
        const storedUserInfoString = localStorage.getItem('userInfo');
        const storedUserInfo = JSON.parse(storedUserInfoString);
        console.log(storedUserInfo);
        console.log(storedUserInfo.role);

        if (storedUserInfo) {
          const fetchRoleLabel = async () => {
            try {
              const url = `http://127.0.0.1:8000/etudiants/get_role_by_id/?id=${storedUserInfo.role}`;
              const response = await fetch(url, { method: 'GET' });

              if (response.ok) {
                const data = await response.json();
                console.log('Données récupérées pour le rôle', storedUserInfo.role, data);

                if (data && data.length > 0 && data[0].libelle) {
                  const roleLabel = data[0].libelle;
                  console.log('Libellé du rôle:', roleLabel);

                  storedUserInfo.roleLabel = roleLabel;

                  localStorage.setItem("userInfo", JSON.stringify(storedUserInfo));
                  await redirectToRoleBasedRoute(roleLabel, storedUserInfo.utilisateur_id);
                } else {
                  console.error('Le champ libelle est manquant dans les données retournées:', data);
                }
              } else {
                console.error('Erreur lors de la récupération du label du rôle :', response.status);
              }
            } catch (error) {
              console.error('Erreur lors de la récupération du label du rôle :', error);
            }
          };
          await fetchRoleLabel();
        }
      } else {
        setError(`Échec de la connexion : ${responseData.message || response.status}`);
      }
    } catch (error) {
      setMessageType("error");
      setMessage("Ces identifiants n'existent pas");
    }
    setTreatment(false);
  };

  const redirectToRoleBasedRoute = async (roleLabel, utilisateurId) => {
    if (roleLabel === 'Etudiant') {
      try {
        const url = `http://127.0.0.1:8000/thesis/memorant/4/${utilisateurId}?limit=1000&offset=0`;
        
        const response = await fetch(url, { method: 'GET' });

        if (response.ok) {
          const responseData = await response.json();
        const bodyData = JSON.parse(responseData.theses_with_students.body);
        const thesesWithStudents = bodyData.theses_with_students;
        console.log('Données de l\'étudiant:', thesesWithStudents);
        localStorage.setItem("memoireInfo", JSON.stringify(thesesWithStudents));
        console.log(localStorage.getItem('memoireInfo'));
        
          console.log(thesesWithStudents.length);
          
          if (thesesWithStudents.length === 0) {
            router.push('/typEtudiant');
          } else {
            router.push('/etudiant');
          }
        } else {
          console.error('Erreur lors de la récupération des données de l\'étudiant :', response.status);
          router.push('/typEtudiant');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données de l\'étudiant :', error);
        router.push('/typEtudiant');
      }
    } else {
      router.push('/dashboard');
    }
  };
 

  

  return (
    <>
      <div className="font-[sans-serif] text-[#333]">
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full p-4 m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
            <div className="md:max-w-md w-full sm:px-6 py-4">
              <form onSubmit={handleLogin}>
                <div className="mb-12">
                  <h3 className="text-3xl font-extrabold">Connexion </h3>
                </div>
                {message && <AlertMessage type={messageType || 'success'} message={message} />}

                <div>
                  <div className="text-xs block mb-2">Login</div>
                  <div className="relative flex items-center">
                    <input
                      name="login"
                      type="text"
                      className="w-full text-sm border-b border-gray-300 focus:border-[#333] px-2 py-3 outline-none"
                      placeholder="Entrez votre login"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      className="w-[18px] h-[18px] absolute right-2"
                      viewBox="0 0 682.667 682.667"
                    >
                      {/* SVG code */}
                    </svg>
                  </div>
                </div>
                <div className="mt-8">
                  <label className="text-xs block mb-2">Password</label>
                  <div className="relative flex items-center">
                    <input
                      name="password"
                      type="password"
                      className="w-full text-sm border-b border-gray-300 focus:border-[#333] px-2 py-3 outline-none"
                      placeholder="Entrez votre mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      className="w-[18px] h-[18px] absolute right-2 cursor-pointer"
                      viewBox="0 0 128 128"
                    >
                      {/* SVG code */}
                    </svg>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 mt-5">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-3 block text-sm">
                      Me rappeler
                    </label>
                  </div>
                  <div>
                    <a
                      href="jajvascript:void(0);"
                      className="text-blue-600 font-semibold text-sm hover:underline"
                    >
                      Mot de passe oublié?
                    </a>
                  </div>
                </div>
                <div className="mt-12">
                  <button
                    type="submit"
                    className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    Valider
                  </button>
                </div>
                <div className="space-x-8 flex justify-center">
                  <button type="button" className="border-none outline-none">
                    {/* SVG code for Google icon */}
                  </button>
                  <button type="button" className="border-none outline-none">
                    {/* SVG code for Facebook icon */}
                  </button>
                </div>
              </form>
            </div>
            <div className="md:h-full w-full max-md:mt-10 bg-white rounded-xl lg:p-12 p-8">
              <Image
                src="/images/Login/imgLogin.png"
                alt="nothing"
                width={1000}
                height={1}
              />
            </div>
          </div>
        </div>
      </div>
      

    </>
  );
}  
export default Login;