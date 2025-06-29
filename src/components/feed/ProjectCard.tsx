import React from 'react';
import { Heart, MessageCircle, Share2, Eye } from 'lucide-react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Card hover className="overflow-hidden">
      {/* Media */}
      <div className="aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <img 
          src={project.mediaUrl} 
          alt={project.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar name={project.authorName} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white truncate">{project.authorName}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{project.createdAt.toLocaleDateString()}</p>
          </div>
          <Badge variant="default" className="text-xs">{project.talent}</Badge>
        </div>
        
        {/* Title and Description */}
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">{project.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">{project.description}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span 
              key={tag}
              className="px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4 sm:gap-6">
            <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors">
              <Heart className="w-4 h-4" />
              <span className="text-sm">{project.likes}</span>
            </button>
            
            <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{project.comments.length}</span>
            </button>
            
            <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Share</span>
            </button>
          </div>
          
          <button className="flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">View Details</span>
          </button>
        </div>
      </div>
    </Card>
  );
};