import DefaultLayout from '@/components/Layouts/DefaultLayout'

import { Enseignant } from "@/types/user";
import { columns } from "@/components/Tables/enseignants-tables/columns";
import { EnseignantTable } from "@/components/Tables/enseignants-tables/enseignants-tables";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import {Enseignan} from '@/constants/data';


type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function ListeEnseignant({ searchParams }: paramsProps) {
  
 const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const matricule = searchParams.search || null;
  const offset = (page - 1) * pageLimit;
  let enseignant: Enseignant[] = [];
  let totalUsers = 0;


  try {
    const response = await fetch(
      `http://127.0.0.1:8000/enseignants/?offset=${offset}&limit=${pageLimit}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Erreur lors de la récupération des enseignants:", errorData);
      throw new Error("Erreur lors de la récupération des enseignants");
    }
    
    const enseignantRes = await response.json();
    enseignant = enseignantRes.enseignants;
    console.log(enseignantRes);
    
    totalUsers = enseignantRes.total_users; 
  } catch (error) {
    console.error("Erreur lors de la récupération des enseignants:", error);
    // Gérer l'erreur de manière appropriée (par exemple, afficher un message à l'utilisateur)
  }

  const pageCount = Math.ceil(totalUsers / pageLimit);
  

 return (
 <DefaultLayout>
    {/* <div> {Etudiants (${JSON.stringify(etuList.json())})}  </div> */}
   <div className="flex flex-col gap-9 mt-20">
        <div className="flex items-start justify-between">
          <Heading
            title={`Enseignants (${totalUsers})`}
            description="Nos enseignants"
          />

          <Link
            href={"/users/forms/create/enseignant"}
 className={cn(buttonVariants ({ variant: "default" }), "bg-blue-500 hover:bg-blue-600 text-white")}          >
            <Plus className="mr-2 h-4 w-4" /> Ajouter un nouveau enseignant
          </Link>
        </div>
        <Separator />

        <EnseignantTable
          searchKey="matricule"
          pageNo={page}
          columns={columns}
          totalUsers={totalUsers}
          data={enseignant}
          pageCount={pageCount}
        />
  </div>

</DefaultLayout>

 )
};