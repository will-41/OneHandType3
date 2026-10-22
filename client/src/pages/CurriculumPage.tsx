import { Map } from 'lucide-react';
import RealmLessonNavigator from '../components/RealmLessonNavigator';
import PageContainer from '../components/shell/PageContainer';
import PageHeader from '../components/shell/PageHeader';

export default function CurriculumPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Learn"
        description="Journey through the Realm of Keys, one lesson at a time."
        icon={<Map className="h-5 w-5" />}
      />
      <RealmLessonNavigator />
    </PageContainer>
  );
}
