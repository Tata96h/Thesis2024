// "use client";

import DefaultLayout from '@/components/Layouts/DefaultLayout';

import { Choix } from "@/types/user";
import { columns } from "@/components/Tables/choix-tables/columns";
import { ChoixTable } from "@/components/Tables/choix-tables/choix-tables";
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
export default async function ListeChoix({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const offset = (page - 1) * pageLimit;

  let choix: Choix[] = [];
  let totalUsers = 0;
  let annee_id = 1;
  // try {
  //   const response = await fetch(
  //     `http://127.0.0.1:8000/thesis/memorant/${annee_id}?offset=${offset}&limit=${pageLimit}`,
  //     { cache: "no-store" }
  //   );

  //   if (!response.ok) {
  //     const errorData = await response.text();
  //     console.error("Erreur lors de la récupération des choix:", errorData);
  //     throw new Error("Erreur lors de la récupération des choix");
  //   }
  //   const ChoixRes = await response.json();
  //   const choix = ChoixRes.theses_with_students;
  //   // const etu = ChoixRes.theses_with_students.etudiants
  //    console.log(choix);
  //   // console.log(ChoixRes);
  //   // console.log(etu);
    

  // } catch (error) {
  //   console.error("Erreur lors de la récupération des choix:", error);
  //   // Gérer l'erreur de manière appropriée (par exemple, afficher un message à l'utilisateur)
  // }

  const pageCount = Math.ceil(totalUsers / pageLimit);

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-9 mt-20">
        <div className="flex items-start justify-between">
          {/* <Heading
            title={`Etudiants (${totalUsers})`}
            description="Nos étudiants"
          /> */}
          <Link
            href={""}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Attribuer un choix
          </Link>
        </div>
        <Separator />

        <ChoixTable
          searchKey=""
          pageNo={page}
          columns={columns}
          totalUsers={totalUsers}
          data={choix}
          pageCount={pageCount}
        />
      </div>
    </DefaultLayout>
  );
}
