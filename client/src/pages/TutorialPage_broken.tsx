import React from 'react';
import Tutorial from '../components/Tutorial';

interface TutorialPageProps {
  onComplete: () => void;
}

export default function TutorialPage({ onComplete }: TutorialPageProps) {
  return <Tutorial onComplete={onComplete} />;
}

