import { Route } from 'lucide-react';
import SkillPath from '../components/path/SkillPath';
import PageContainer from '../components/shell/PageContainer';
import PageHeader from '../components/shell/PageHeader';

export default function CurriculumPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Learn"
        description="Your skill path: ten units from home row to mastery."
        icon={<Route className="h-5 w-5" />}
      />
      <SkillPath />
    </PageContainer>
  );
}
