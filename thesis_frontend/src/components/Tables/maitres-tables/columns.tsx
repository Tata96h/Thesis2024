"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Jury } from "@/types/user";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<Jury>[] = [
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
    accessorKey: "maitre_memoire",
    header: "Maître mémoire",
    cell: ({ row }) => {
      const maitre_memoire = row.original.maitre_memoire;
      if (!maitre_memoire) {
        return '-';
      }
      return `${maitre_memoire.nom} ${maitre_memoire.prenom}`;
    },
  },
  
  
];

