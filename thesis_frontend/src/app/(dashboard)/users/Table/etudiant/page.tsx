
import DefaultLayout from '@/components/Layouts/DefaultLayout';

import { Etudiant } from "@/types/user";
import { columns } from "@/components/Tables/etudiants-tables/columns";
import { EtudiantTable } from "@/components/Tables/etudiants-tables/etudiants-tables";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

// eslint-disable-next-line @next/next/no-async-client-component
export default async function ListeEtudiant({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const offset = (page - 1) * pageLimit;

  let etudiant: Etudiant[] = [];
  let totalUsers = 0;

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/etudiants/?offset=${offset}&limit=${pageLimit}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Erreur lors de la récupération des étudiants:", errorData);
      throw new Error("Erreur lors de la récupération des étudiants");
    }

    const etudiantRes = await response.json();
    etudiant = etudiantRes.etudiants;
    totalUsers = etudiantRes.total_users; // Remplacez par etudiantRes.total_users si disponible
  } catch (error) {
    console.error("Erreur lors de la récupération des étudiants:", error);
    // Gérer l'erreur de manière appropriée (par exemple, afficher un message à l'utilisateur)
  }

  const pageCount = Math.ceil(totalUsers / pageLimit);

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-9 mt-20">
        <div className="flex items-start justify-between">
          <Heading
            title={`Etudiants (${totalUsers})`}
            description="Nos étudiants"
          />
          <Link
            href={"/users/forms/create/etudiant"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Ajouter un nouveau étudiant
          </Link>
        </div>
        <Separator />

        <EtudiantTable
          searchKey="matricule"
          pageNo={page}
          columns={columns}
          totalUsers={totalUsers}
          data={etudiant}
          pageCount={pageCount}
        />
      </div>
    </DefaultLayout>
  );
}
