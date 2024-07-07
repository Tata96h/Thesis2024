import PlanificationSoutenances from '@/components/PlanificationSoutenances/page';
import DefaultLayout from '@/components/Layouts/DefaultLayout';

export default function Home() {
  return (
<DefaultLayout>  
    <div className='flex justify-center gap-9 pt-20'>
      <PlanificationSoutenances />
    </div>
</DefaultLayout>

  );
}