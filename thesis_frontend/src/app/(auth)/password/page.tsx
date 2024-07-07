"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import '../../(landing-page)/landingpage-style.css';
import AlertMessage from '@/components/AlertMessage/page';



const Password = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [treatment, setTreatment] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | undefined>(undefined);
  const [passwordconfirm, setPasswordconfirm] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
      console.log("Token récupéré :", urlToken);
    } else {
      console.log("Aucun token trouvé dans l'URL");
    }
  }, [searchParams]);

  const handlePassword = async (e) => {
    e.preventDefault();
    setTreatment(true);
    setMessageType("success");
    setMessage("Traitement...");

    if (!passwordconfirm || !password) {
      setMessageType("error");
      setMessage("Tous les champs sont obligatoires !!");
      return;
    }

    if (password !== passwordconfirm) {
      setMessageType("error");
      setMessage("Les mots de passe ne correspondent pas !");
      return;
    }
  
    const formData = {
      token: token,
      new_password: password,
    };
    console.log(formData);
    
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        cache: "no-store"
      });

      const responseData = await response.json();
      console.log(responseData);

      if (response.ok) {
        router.push("/login");
      } else {
        setMessageType("error");
        setMessage(`Échec de l'authentification : ${responseData.message || 'Erreur inconnue'}`);
      }
    } catch (error) {
      setMessageType("error");
      setMessage("Une erreur est survenue lors de l'authentification'");
    } finally {
      setTreatment(false);
    }
  };

  return (
    <div className="font-[sans-serif] text-[#333]">
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full p-4 m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
          <div className="md:max-w-md w-full sm:px-6 py-4">
            <form onSubmit={handlePassword}>
              <div className="mb-7">
                <h3 className="text-3xl font-extrabold">Authentification </h3>
              </div>
               
               <div className="mt-2">
                {message && <AlertMessage type={messageType || 'success'} message={message} />}

                </div>
             
              
             <div className="mt-8">
  <label className="text-xs block mb-2">Mot de passe</label>
  <div className="relative flex items-center">
    <input
      name="password"
      type={showPassword ? "text" : "password"}
      className="w-full text-sm border-b border-gray-300 focus:border-[#333] px-2 py-3 outline-none"
      placeholder="Entrez votre mot de passe"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-2 cursor-pointer"
    >
      {showPassword ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )}
    </button>
  </div>
</div>

<div className="mt-8">
  <label className="text-xs block mb-2">Mot de passe confirmé</label>
  <div className="relative flex items-center">
    <input
      name="passwordconfirm"
      type={showPasswordConfirm ? "text" : "password"}
      className="w-full text-sm border-b border-gray-300 focus:border-[#333] px-2 py-3 outline-none"
      placeholder="Confirmez votre mot de passe"
      value={passwordconfirm}
      onChange={(e) => setPasswordconfirm(e.target.value)}
    />
    <button
      type="button"
      onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
      className="absolute right-2 cursor-pointer"
    >
      {showPasswordConfirm ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )}
    </button>
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
  );
};

export default Password;