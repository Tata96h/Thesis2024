"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Memoire } from "@/types/user";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<Memoire>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Tout sélectionner"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Sélectionner la ligne"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "theme",
    header: "Thème",
  },
  {
    accessorKey: "etudiants",
    header: "Étudiants",
    cell: ({ row }) => {
      const etudiants = row.original.etudiants;
      if (!etudiants || etudiants.length === 0) {
        return '-';
      }
      return etudiants.map(e => `${e.nom} ${e.prenom}`).join(", ");
    },
  },
  {
    accessorKey: "fichier",
    header: "Mémoire",
    cell: ({ row }) => {
      const fichier = row.original.fichier;
      if (!fichier) return '-';
      
      const fichiers = fichier.split('/').pop();
      const fichierPath = `/api/files/${fichiers}`;
  
      return (
        <a 
          href={fichierPath} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {fichiers}
        </a>
      );
    },
  },
  {
    id: "valider",
    header: "Valider",
    cell: ({ row }) => (
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => handleValidation(row.original)}
      >
        Valider
      </button>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  
  
];

const handleValidation = async (juryId: number) => {
  try {
    // Envoyer une requête PUT ou POST au backend pour effectuer la validation
    // const response = await axios.put(`/api/jury/${juryId}/validate`);
    // console.log("Validation réussie:", response.data);

    // Mettre à jour l'état ou les données si nécessaire après la validation
    // Par exemple, recharger les données du tableau après la validation
    // reloadData();
  } catch (error) {
    console.error("Erreur lors de la validation:", error);
    // Gérer l'erreur de manière appropriée
  }
};