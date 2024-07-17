
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { columns } from "@/components/Tables/maitres-tables/columns";
import { ChoixTable } from "@/components/Tables/maitres-tables/maitres-tables";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Choix } from "@/types/user";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ClientButton from "@/components/Choix/ClientButton";

const breadcrumbItems = [{ title: "Choix", link: "/dashboard/choix" }];

type ParamsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page({ searchParams }: ParamsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const search = searchParams.search?.toString() || "";
  const offset = (page - 1) * pageLimit;

  let choix: Choix[] = [];
  let totalUsers = 0;
  let annee_id = 4;

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/thesis/memorant_by_dep/${annee_id}/{departement}?departement_id=1&limit=${pageLimit}&offset=${offset}&search=${search}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Erreur lors de la récupération des choix:", errorData);
      throw new Error("Erreur lors de la récupération des choix");
    }
    const choixRes = await response.json();
    choix = JSON.parse(choixRes.theses_with_students);
    totalUsers = choixRes.total_count || choix.length;
    
      console.log(choix);
  } catch (error) {
    console.error("Erreur lors de la récupération des choix:", error);
  }
  const pageCount = Math.ceil(totalUsers / pageLimit);

  
  return (
    <>
    <DefaultLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Maître mémoire (${totalUsers})`}
            description="Gestion des choix des étudiants pour les mémoires."
          />

<       ClientButton /> 
        </div>
        <Separator />

        <ChoixTable
          searchKey="theme"
          pageNo={page}
          columns={columns}
          totalUsers={totalUsers}
          data={choix}
          pageCount={pageCount}
        />
      </div>
      </DefaultLayout>
    </>
  );
}