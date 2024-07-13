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
    accessorKey: "choix1",
    header: "Choix 1",
    cell: ({ row }) => {
      const choix1 = row.original.choix1;
      if (!choix1) {
        return '-';
      }
      return `${choix1.nom} ${choix1.prenom}`;
    },
  },
  {
    accessorKey: "choix2",
    header: "Choix 2",
    cell: ({ row }) => {
      const choix2 = row.original.choix2;
      if (!choix2) {
        return '-';
      }
      return `${choix2.nom} ${choix2.prenom}`;
    },
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
];

