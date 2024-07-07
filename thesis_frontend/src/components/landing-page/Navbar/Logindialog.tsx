"use client";
import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AlertMessage from '@/components/AlertMessage/page';


const Login = () => {
   const router = useRouter();
const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("isload", "0");
      const session = localStorage.getItem("sessionIsActive");
      if (session === "1") {
        router.push('/dashboard');
      }
    }
  }, [router]);

  localStorage.setItem("isload", "0");
  const session = localStorage.getItem("sessionIsActive");

  const [treatment, setTreatement] = useState(false);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | undefined>(undefined); 


  const handleLogin = async (e) => {
    e.preventDefault();
    setTreatement(true);
    setMessageType("success");
    setMessage("Traitement...");

    if (!username || !password) {
      setMessageType("error");
      setMessage("Les champs sont obligatoires !!!");
      return;
    }

    const formData = {
      username: username,
      password: password,
    };
     console.log(JSON.stringify(formData))
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        cache: "no-store"
      });

      const responseData = await response.json();
      console.log(responseData);
       console.log(JSON.stringify(responseData))

      if (response.ok) {
        localStorage.setItem("accessToken", responseData.access_token);
        localStorage.setItem("tokenType", responseData.token_type);
        localStorage.setItem(
          "userInfo",
          JSON.stringify(responseData.user_info)
        );
        
        localStorage.setItem("sessionIsActive", "1");
        console.log(localStorage);
        
        const userRole = responseData.user_info.role; 
        console.log(userRole);
        switch(userRole) {
          case 1:
            router.push("/etudiant");
            break;
          // case 2:
          //   router.push("/teacher-dashboard");
          //   break;
          // case 3:
          //   router.push("/student-dashboard");
          //   break;
          default:
            router.push("/dashboard");
            break;
        }
      // router.push("/dashboard");
      } else {
        const errorData = await response.json();
        setError(`Échec de la connexion : ${errorData.message || response.status}`);
      }
    } catch (error) {
          setMessageType("error");
          setMessage("Ces identifiants n'existent pas");
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
                      className="text-blue-500 font-semibold text-sm hover:underline"
                    >
                      Mot de passe oublié?
                    </a>
                  </div>
                </div>
                <div className="mt-12">
                  <button
                    type="submit"
                    className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded-full text-white bg-blue-500 hover:bg-blue-700 focus:outline-none"
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
