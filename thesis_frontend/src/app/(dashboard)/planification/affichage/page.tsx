import type { NextPage } from 'next';
import PlanificationSoutenances from '@/components/PlanificationSoutenances/page';
import DefaultLayout from '@/components/Layouts/DefaultLayout';


const PlanificationSoutenancesPage: NextPage = () => {
  return <>
  <DefaultLayout>
  <PlanificationSoutenances />;

    </DefaultLayout>

  </>
};

export default PlanificationSoutenancesPage;