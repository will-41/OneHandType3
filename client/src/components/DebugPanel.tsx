
import React from 'react';
import { useTypingStore } from '../lib/stores/useTypingStore';

interface DebugPanelProps {
  currentView: string;
  selectedLesson: { id: string; title?: string } | null;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ currentView, selectedLesson }) => {
  const { currentLesson, gameState, targetText } = useTypingStore();

  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-4 left-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div>App View: {currentView}</div>
      <div>Selected Lesson: {selectedLesson?.id || 'none'}</div>
      <div>Store Lesson: {currentLesson?.id || 'none'}</div>
      <div>Game State: {gameState}</div>
      <div>Target Text: {targetText ? `${targetText.substring(0, 30)}...` : 'none'}</div>
      <div>Has Lesson Content: {!!(currentLesson?.text || currentLesson?.content)}</div>
    </div>
  );
};

export default DebugPanel;
