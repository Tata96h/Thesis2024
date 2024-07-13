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
    accessorKey: "numero",
    header: "Numéro",
  },
  {
    accessorKey: "president",
    header: "Président",
    cell: ({ row }) => {
      const president = row.original.president ?? {};
      return president.nom && president.prenom ? `${president.nom} ${president.prenom}` : '-';
    },
  },
  {
    accessorKey: "examinateur",
    header: "Examinateur",
    cell: ({ row }) => {
      const examinateur = row.original.examinateur ?? {};
      return examinateur.nom && examinateur.prenom ? `${examinateur.nom} ${examinateur.prenom}` : '-';
    },
  },
  {
    accessorKey: "rapporteur",
    header: "Rapporteur",
    cell: ({ row }) => {
      const rapporteur = row.original.rapporteur ?? {};
      return rapporteur.nom && rapporteur.prenom ? `${rapporteur.nom} ${rapporteur.prenom}` : '-';
    },
  },
];
