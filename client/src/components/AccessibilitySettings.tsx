import React from 'react';
import { Button } from '../components/ui/button';
import { X } from 'lucide-react';

interface AccessibilitySettingsProps {
  onClose: () => void;
}

const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({ onClose }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Accessibility Settings</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-muted-foreground">
        Basic accessibility settings component
      </div>
    </div>
  );
};

export default AccessibilitySettings;