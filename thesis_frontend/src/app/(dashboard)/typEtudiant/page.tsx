// pages/student-form.js
"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function StudentForm() {
  const [formType, setFormType] = useState('');
  const [matricule1, setMatricule1] = useState('');
  const [matricule2, setMatricule2] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const titleVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "tween",
        duration: 1,
        ease: "easeOut"
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const response = await fetch('/api/verify-student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formType, matricule1, matricule2, year }),
    });

    const data = await response.json();

    if (data.success) {
      router.push('/student-space');
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/soutenance-background.jpg" 
          layout="fill"
          objectFit="cover"
          quality={100}
          alt="Soutenance background"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-md w-full space-y-8 bg-white bg-opacity-90 p-10 rounded-xl shadow-lg">
          <motion.h1 
            className="text-3xl font-extrabold text-center text-gray-900 mb-6"
            initial="hidden"
            animate={mounted ? "visible" : "hidden"}
            variants={titleVariants}
          >
            Bienvenu(e)
          </motion.h1>
          <h5 className="text-center text-gray-100 mb-6">Vous êtes en </h5>

          
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div 
                className={`border-2 p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  formType === 'monome' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-300'
                }`}
                onClick={() => setFormType('monome')}
              >
                <input
                  type="radio"
                  name="formType"
                  value="monome"
                  checked={formType === 'monome'}
                  onChange={(e) => setFormType(e.target.value)}
                  className="hidden"
                />
                <div className="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">Monôme</span>
                </div>
              </div>
              <div 
                className={`border-2 p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  formType === 'binome' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-300'
                }`}
                onClick={() => setFormType('binome')}
              >
                <input
                  type="radio"
                  name="formType"
                  value="binome"
                  checked={formType === 'binome'}
                  onChange={(e) => setFormType(e.target.value)}
                  className="hidden"
                />
                <div className="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="font-medium">Binôme</span>
                </div>
              </div>
            </div>

            {formType && (
              <div className="space-y-4 mt-6">
                <div>
                  <label htmlFor="matricule1" className="block text-sm font-medium text-gray-700 mb-1">
                    {formType === 'monome' ? 'Matricule' : 'Matricule 1'}
                  </label>
                  <input
                    type="text"
                    id="matricule1"
                    value={matricule1}
                    onChange={(e) => setMatricule1(e.target.value)}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Entrez le matricule"
                    required
                  />
                </div>

                {formType === 'binome' && (
                  <div>
                    <label htmlFor="matricule2" className="block text-sm font-medium text-gray-700 mb-1">
                      Matricule 2
                    </label>
                    <input
                      type="text"
                      id="matricule2"
                      value={matricule2}
                      onChange={(e) => setMatricule2(e.target.value)}
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Entrez le second matricule"
                      required
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                    Année académique
                  </label>
                  <input
                    type="text"
                    id="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Ex: 2023-2024"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Valider
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      {/* <footer className="bg-gray-800 text-white py-4 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <p>&copy; 2024 Université XYZ. Tous droits réservés.</p>
            <nav>
              <ul className="flex space-x-4">
                <li><a href="#" className="hover:text-blue-300">Accueil</a></li>
                <li><a href="#" className="hover:text-blue-300">Contact</a></li>
                <li><a href="#" className="hover:text-blue-300">Aide</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </footer> */}
    </div>
  );
}