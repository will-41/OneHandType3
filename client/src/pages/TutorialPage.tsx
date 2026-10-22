import Tutorial, { type TutorialDestination } from '../components/Tutorial';

interface TutorialPageProps {
  onFinish: (destination: TutorialDestination) => void;
}

export default function TutorialPage({ onFinish }: TutorialPageProps) {
  return <Tutorial onFinish={onFinish} />;
}
