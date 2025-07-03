import React from 'react';
import { Sparkles, Upload } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

export const FeedSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Personalized Feed</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">Curated for your interests</span>
      </div>
      
      <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 pb-10 pl-6">
        <Upload className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No projects yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Be the first to share your amazing work with the community!
        </p>
        <Button onClick={() => navigate('/upload')} className="mt-4">
          <Upload className="w-4 h-4" />
          Share Your Project
        </Button>
      </div>
    </div>
  );
};