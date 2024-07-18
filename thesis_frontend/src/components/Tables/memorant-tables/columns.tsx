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
    accessorKey: "etudiants[0]",
    header: "Etudiant 1",
    cell: ({ row }) => {
      const etudiant = row.original.etudiants.length > 0 ? row.original.etudiants[0] : null;
      return etudiant ? `${etudiant.nom} ${etudiant.prenom}` : "-";
    },
  },
  {
    accessorKey: "etudiants[1]",
    header: "Etudiant 2",
    cell: ({ row }) => {
      const etudiant = row.original.etudiants.length > 1 ? row.original.etudiants[1] : null;
      return etudiant ? `${etudiant.nom} ${etudiant.prenom}` : "-";
    },
  },
//   {
//     accessorKey: "etudiants",
//     header: "Étudiants",
//     cell: ({ row }) => {
//       const etudiants = row.original.etudiants;
//       if (!etudiants || etudiants.length === 0) {
//         return '-';
//       }
//       return etudiants.map(e => `${e.nom} ${e.prenom}`).join(", ");
//     },
//   },
   {
    accessorKey: "filiere",
    header: "Filière",
    },
  
//     accessorKey: "fichier",
//     header: "Mémoire",
//     cell: ({ row }) => {
//       const fichier = row.original.fichier;
//       if (!fichier) return '-';
      
//       const fichiers = fichier.split('/').pop();
//       const fichierPath = `/api/files/${fichiers}`;
  
//       return (
//         <a 
//           href={fichierPath} 
//           target="_blank" 
//           rel="noopener noreferrer"
//           className="text-blue-600 hover:text-blue-800 underline"
//         >
//           {fichiers}
//         </a>
//       );
//     },
//   },
  
  
];

