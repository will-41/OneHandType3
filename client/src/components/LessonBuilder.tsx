import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { cn } from '../lib/utils';
import { useTypingStore } from '../lib/stores/useTypingStore';
import { Lesson } from '../lib/lessons';
import { Save, Download, Upload, Eye, RotateCcw, BookOpen, User, Target, Clock, Gauge } from 'lucide-react';

interface LessonBuilderProps {
  onSave?: (lesson: Lesson) => void;
  onClose?: () => void;
  existingLesson?: Lesson;
  className?: string;
}

const LessonBuilder: React.FC<LessonBuilderProps> = ({
  onSave,
  onClose,
  existingLesson,
  className
}) => {
  const { themeMode } = useTypingStore();
  
  const [lesson, setLesson] = useState<Partial<Lesson>>({
    id: existingLesson?.id || `custom-${Date.now()}`,
    title: existingLesson?.title || '',
    description: existingLesson?.description || '',
    category: existingLesson?.category || 'basics',
    level: existingLesson?.level || 1,
    difficulty: existingLesson?.difficulty || 1,
    content: existingLesson?.content || '',
    targetWpm: existingLesson?.targetWpm || 15,
    timeLimit: existingLesson?.timeLimit,
    handCompatibility: existingLesson?.handCompatibility || ['left', 'right'],
    focusKeys: existingLesson?.focusKeys || [],
    prerequisites: existingLesson?.prerequisites || [],
    wordCount: existingLesson?.wordCount || 0,
    estimatedTime: existingLesson?.estimatedTime || 2
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateLesson = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!lesson.title?.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!lesson.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!lesson.content?.trim()) {
      newErrors.content = 'Lesson content is required';
    }
    if (lesson.content && lesson.content.length < 5) {
      newErrors.content = 'Content must be at least 5 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateLesson()) return;

    const finalLesson: Lesson = {
      ...lesson,
      id: lesson.id!,
      title: lesson.title!,
      description: lesson.description!,
      category: lesson.category as "basics" | "words" | "sentences" | "advanced",
      level: lesson.level!,
      difficulty: lesson.difficulty!,
      content: lesson.content!,
      text: lesson.content!, // Alias for backward compatibility
      targetWpm: lesson.targetWpm!,
      handCompatibility: lesson.handCompatibility as ("left" | "right")[],
      wordCount: lesson.content!.split(' ').length,
      estimatedTime: Math.max(1, Math.ceil(lesson.content!.length / 50))
    };

    onSave?.(finalLesson);
  };

  const handleExport = () => {
    if (!validateLesson()) return;

    const dataStr = JSON.stringify(lesson, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lesson-${lesson.title?.replace(/\s+/g, '-').toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedLesson = JSON.parse(e.target?.result as string);
        setLesson(importedLesson);
      } catch (error) {
        alert('Invalid lesson file format');
      }
    };
    reader.readAsText(file);
  };

  const resetLesson = () => {
    setLesson({
      id: `custom-${Date.now()}`,
      title: '',
      description: '',
      category: 'basics',
      level: 1,
      difficulty: 1,
      content: '',
      targetWpm: 15,
      handCompatibility: ['left', 'right'],
      focusKeys: [],
      prerequisites: [],
      wordCount: 0,
      estimatedTime: 2
    });
    setErrors({});
  };

  const updateLesson = (field: keyof Lesson, value: string | number | string[] | boolean | undefined) => {
    setLesson(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addFocusKey = (key: string) => {
    if (key && !lesson.focusKeys?.includes(key)) {
      updateLesson('focusKeys', [...(lesson.focusKeys || []), key]);
    }
  };

  const removeFocusKey = (key: string) => {
    updateLesson('focusKeys', lesson.focusKeys?.filter(k => k !== key) || []);
  };

  return (
    <div className={cn(
      "w-full max-w-4xl mx-auto space-y-6 p-6",
      themeMode === 'dark' ? 'text-white' : 'text-black',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Custom Lesson Builder
          </h2>
          <p className="text-sm opacity-75 mt-1">
            Create personalized typing lessons for students and therapy sessions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      {previewMode ? (
        /* Preview Mode */
        <Card className={`p-6 ${themeMode === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'}`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">{lesson.title || 'Untitled Lesson'}</h3>
              <div className="flex gap-2">
                <Badge variant="outline">{lesson.category}</Badge>
                <Badge variant="secondary">Level {lesson.level}</Badge>
                <Badge variant="outline">Difficulty {lesson.difficulty}/5</Badge>
              </div>
            </div>
            <p className="opacity-75">{lesson.description || 'No description provided'}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span>{lesson.targetWpm} WPM</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{lesson.estimatedTime} min</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{lesson.handCompatibility?.join(', ')} hand</span>
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4" />
                <span>{lesson.content?.split(' ').length || 0} words</span>
              </div>
            </div>

            <div className={`p-4 rounded-lg border-2 ${themeMode === 'dark' ? 'bg-slate-700 border-slate-500' : 'bg-gray-50 border-gray-300'}`}>
              <h4 className="font-semibold mb-2">Lesson Content:</h4>
              <p className="font-mono text-lg leading-relaxed">
                {lesson.content || 'No content provided'}
              </p>
            </div>

            {lesson.focusKeys && lesson.focusKeys.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Focus Keys:</h4>
                <div className="flex flex-wrap gap-2">
                  {lesson.focusKeys.map(key => (
                    <Badge key={key} variant="outline" className="font-mono">
                      {key}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      ) : (
        /* Edit Mode */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card className={`p-6 ${themeMode === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'}`}>
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Lesson Title *</Label>
                <Input
                  id="title"
                  value={lesson.title || ''}
                  onChange={(e) => updateLesson('title', e.target.value)}
                  placeholder="e.g., Introduction to Home Row Keys"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={lesson.description || ''}
                  onChange={(e) => updateLesson('description', e.target.value)}
                  placeholder="Describe what this lesson teaches and its goals..."
                  className={cn("min-h-20", errors.description ? 'border-red-500' : '')}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={lesson.category} onValueChange={(value) => updateLesson('category', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basics">Basics</SelectItem>
                      <SelectItem value="words">Words</SelectItem>
                      <SelectItem value="sentences">Sentences</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="level">Level</Label>
                  <Input
                    id="level"
                    type="number"
                    min="1"
                    max="10"
                    value={lesson.level || 1}
                    onChange={(e) => updateLesson('level', parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Performance Settings */}
          <Card className={`p-6 ${themeMode === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'}`}>
            <h3 className="text-lg font-semibold mb-4">Performance Settings</h3>
            <div className="space-y-4">
              <div>
                <Label>Difficulty Level: {lesson.difficulty}/5</Label>
                <Slider
                  value={[lesson.difficulty || 1]}
                  onValueChange={(value) => updateLesson('difficulty', value[0])}
                  max={5}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Target WPM: {lesson.targetWpm}</Label>
                <Slider
                  value={[lesson.targetWpm || 15]}
                  onValueChange={(value) => updateLesson('targetWpm', value[0])}
                  max={100}
                  min={5}
                  step={5}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="timeLimit">Time Limit (optional, in seconds)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  min="30"
                  value={lesson.timeLimit || ''}
                  onChange={(e) => updateLesson('timeLimit', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Leave empty for no time limit"
                />
              </div>

              <div>
                <Label>Hand Compatibility</Label>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="left-hand"
                      checked={lesson.handCompatibility?.includes('left') || false}
                      onCheckedChange={(checked) => {
                        const current = lesson.handCompatibility || [];
                        if (checked) {
                          updateLesson('handCompatibility', [...current.filter(h => h !== 'left'), 'left']);
                        } else {
                          updateLesson('handCompatibility', current.filter(h => h !== 'left'));
                        }
                      }}
                    />
                    <Label htmlFor="left-hand">Left Hand</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="right-hand"
                      checked={lesson.handCompatibility?.includes('right') || false}
                      onCheckedChange={(checked) => {
                        const current = lesson.handCompatibility || [];
                        if (checked) {
                          updateLesson('handCompatibility', [...current.filter(h => h !== 'right'), 'right']);
                        } else {
                          updateLesson('handCompatibility', current.filter(h => h !== 'right'));
                        }
                      }}
                    />
                    <Label htmlFor="right-hand">Right Hand</Label>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Lesson Content */}
          <Card className={`p-6 lg:col-span-2 ${themeMode === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'}`}>
            <h3 className="text-lg font-semibold mb-4">Lesson Content</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="content">Text Content *</Label>
                <Textarea
                  id="content"
                  value={lesson.content || ''}
                  onChange={(e) => {
                    updateLesson('content', e.target.value);
                    updateLesson('wordCount', e.target.value.split(' ').length);
                    updateLesson('estimatedTime', Math.max(1, Math.ceil(e.target.value.length / 50)));
                  }}
                  placeholder="Type the text that students will practice typing..."
                  className={cn("min-h-32 font-mono", errors.content ? 'border-red-500' : '')}
                />
                {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                <div className="flex justify-between text-xs opacity-60 mt-1">
                  <span>{lesson.content?.length || 0} characters</span>
                  <span>{lesson.content?.split(' ').length || 0} words</span>
                  <span>~{Math.max(1, Math.ceil((lesson.content?.length || 0) / 50))} min estimated</span>
                </div>
              </div>

              <div>
                <Label htmlFor="focus-keys">Focus Keys (optional)</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="focus-keys"
                    placeholder="Enter key (e.g., 'a', 'space', 'shift')"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addFocusKey(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const input = document.getElementById('focus-keys') as HTMLInputElement;
                      if (input.value) {
                        addFocusKey(input.value);
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                {lesson.focusKeys && lesson.focusKeys.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {lesson.focusKeys.map(key => (
                      <Badge
                        key={key}
                        variant="outline"
                        className="cursor-pointer font-mono"
                        onClick={() => removeFocusKey(key)}
                      >
                        {key} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      <Separator />

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetLesson} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <div>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
              id="import-lesson"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('import-lesson')?.click()}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Import
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Lesson
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonBuilder;