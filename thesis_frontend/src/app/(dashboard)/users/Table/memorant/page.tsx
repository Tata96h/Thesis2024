"use client"
import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { columns } from "@/components/Tables/memorant-tables/columns";
import { MemoireTable } from "@/components/Tables/memorant-tables/memorant-tables";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Memoire } from "@/types/user";
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

const Page = ({ searchParams }: ParamsProps) => {
  const [memoire, setMemoire] = useState<Memoire[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [anneeId, setAnneeId] = useState(4);
  const [enseignant, setEnseignant] = useState(null);

  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const search = searchParams.search?.toString() || "";
  const offset = (page - 1) * pageLimit;

  useEffect(() => {
    const storedEnseignant = localStorage.getItem("enseignantInfo");
    if (storedEnseignant) {
      const parsedEnseignant = JSON.parse(storedEnseignant);
      setEnseignant(parsedEnseignant);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!enseignant) return;

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/thesis/memorant_by_dep/${anneeId}/{departement}?departement_id=${enseignant.departement_id}&limit=1000&offset=0`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          const errorData = await response.text();
          console.error("Erreur lors de la récupération des choix:", errorData);
          throw new Error("Erreur lors de la récupération des choix");
        }
        const memoireRes = await response.json();
        const parsedMemoire = JSON.parse(memoireRes.theses_with_students);
        setMemoire(parsedMemoire);
        console.log(parsedMemoire);
        
        
        setTotalUsers(parsedMemoire.length); 
      } catch (error) {
        console.error("Erreur lors de la récupération des memoires:", error);
      }
    };

    fetchData();
  }, [enseignant, page, pageLimit, offset, search, anneeId]);

  const pageCount = Math.ceil(totalUsers / pageLimit);

   return (
    <>
    <DefaultLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Mémorant (${totalUsers})`}
            description="Gestion des mémorants par département."
          />

      {/* <ClientButton />  */}
        </div>
        <Separator />

        <MemoireTable
          searchKey="filiere"
          pageNo={page}
          columns={columns}
          totalUsers={totalUsers}
          data={memoire}
          pageCount={pageCount}
        />
      </div>
      </DefaultLayout>
    </>
  );
}

export default Page;