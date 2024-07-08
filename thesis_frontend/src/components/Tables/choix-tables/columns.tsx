"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Choi } from "@/constants/data";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Choi>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Tout selectionner"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selectionner une ligne"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  { 
    accessorKey: "choix1.nom",
    header: "Thème",
  },
  { 
    accessorKey: "choix1.nom",
    header: "Etudiant 1",
  },
  
  {
    accessorKey: "choix1.nom",
    header: "Etudiant 2",
  },
  {
    accessorKey: "choix1.nom",
    header: "Choix 1",
  },{
    accessorKey: "choix1.nom",
    header: "Choix 2",
  },
  
  
];
