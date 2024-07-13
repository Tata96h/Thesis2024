"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";

const ClientButton = () => {
  const router = useRouter();
  const [enseignantInfo, setEnseignantInfo] = useState(null);

  useEffect(() => {
    const storedEnseignantInfo = localStorage.getItem('enseignantInfo');
    if (storedEnseignantInfo) {
      const parsedEnseignantInfo = JSON.parse(storedEnseignantInfo);
      setEnseignantInfo(parsedEnseignantInfo);
      console.log(parsedEnseignantInfo);
    }
  }, []);

  const assignerChoix = async () => {
    if (!enseignantInfo) {
      console.error('Enseignant info not found');
      return;
    }

    try {
      const annee_id = 4;
      const response = await fetch(`http://127.0.0.1:8000/thesis/choice/${annee_id}/${enseignantInfo.departement_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'assignation du choix');
      }

      const data = await response.json();
      console.log('Choix assigné avec succès:', data);

      router.push('users/Table/maitre');
    } catch (error) {
      console.error('Erreur lors de l\'assignation du choix:', error);
    }
  };

  return (
    <button
      onClick={assignerChoix}
      className={cn(buttonVariants({ variant: "default" }))}
    >
      <Plus className="mr-2 h-4 w-4" /> Assigner un choix
    </button>
  );
};

export default ClientButton;
