import React from 'react';
import { Sparkles } from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import { mockProjects } from '../../utils/mockData';

export const FeedSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Personalized Feed</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">Curated for your interests</span>
      </div>
      
      <div className="grid gap-6">
        {mockProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};