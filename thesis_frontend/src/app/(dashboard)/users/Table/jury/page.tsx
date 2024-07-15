import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { columns } from "@/components/Tables/jurys-tables/columns";
import { JuryTable } from "@/components/Tables/jurys-tables/jurys-tables";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Jury } from "@/types/user";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

const breadcrumbItems = [{ title: "Jury", link: "/dashboard/jury" }];

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

  let jury: Jury[] = [];
  let totalUsers = 0;
  let annee_id = 4;

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/jurys/1?limit=1000&offset=0`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Erreur lors de la récupération des jury:", errorData);
      throw new Error("Erreur lors de la récupération des jury");
    }
    const data = await response.json();
    jury = data.jurys;
    totalUsers = jury.length;
    // console.log(jury);
  } catch (error) {
    console.error("Erreur lors de la récupération des jury:", error);
  }

  const pageCount = Math.ceil(totalUsers / pageLimit);

  return (
    <DefaultLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Jury (${totalUsers})`}
            description="Gestion des jurys par département."
          />

          <Link
            href={"/users/forms/create/jury"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Créer jury
          </Link>
        </div>
        <Separator />

        <JuryTable
          searchKey="numero"
          pageNo={page}
          columns={columns}
          totalUsers={totalUsers}
          data={jury}
          pageCount={pageCount}
        />
      </div>
    </DefaultLayout>
  );
}
