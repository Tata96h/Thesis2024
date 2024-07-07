import { Checkbox } from "@/components/ui/checkbox";
import { Enseignan } from "@/constants/data";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<Enseignan>[] = [
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
    accessorKey: "utilisateur.nom",
    header: "hh",
  },
  {
    accessorKey: "utilisateur.prenoms",
    header: "Prénoms",
  },
  
  // {
  //   accessorKey: "filiere.nom",
  //   header: "Filière",
  // },
  {
    accessorKey: "utilisateur.username",
    header: "Nom d'utilisateur",
  },
  {
    accessorKey: "matricule",
    header: "Matricule",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
