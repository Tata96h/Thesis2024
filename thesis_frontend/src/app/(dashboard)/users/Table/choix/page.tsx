"use client"
import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { columns } from "@/components/Tables/choix-tables/columns";
import { ChoixTable } from "@/components/Tables/choix-tables/choix-tables";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Choix } from "@/types/user";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ClientButton from "@/components/Choix/ClientButton";

const breadcrumbItems = [{ title: "Choix", link: "/dashboard/choix" }];

type ParamsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const Page = ({ searchParams }: ParamsProps) => {
  const [choix, setChoix] = useState<Choix[]>([]);
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
          `http://127.0.0.1:8000/thesis/memorant_by_dep/${anneeId}/1?departement_id=${enseignant.departement_id}&limit=${pageLimit}&offset=${offset}&search=${search}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          const errorData = await response.text();
          console.error("Erreur lors de la récupération des choix:", errorData);
          throw new Error("Erreur lors de la récupération des choix");
        }
        const choixRes = await response.json();
        const parsedChoix = JSON.parse(choixRes.theses_with_students);
        setChoix(parsedChoix);
        setTotalUsers(parsedChoix.length); // Utiliser la longueur des données retournées
      } catch (error) {
        console.error("Erreur lors de la récupération des choix:", error);
      }
    };

    fetchData();
  }, [enseignant, page, pageLimit, offset, search, anneeId]);

  const pageCount = Math.ceil(totalUsers / pageLimit);

  return (
    <DefaultLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Choix (${totalUsers})`}
            description="Gestion des choix des étudiants pour les mémoires."
          />
          <ClientButton />
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
  );
};

export default Page;
