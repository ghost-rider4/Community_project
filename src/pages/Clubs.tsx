import React, { useState } from 'react';
import { Search, Users, Plus, TrendingUp } from 'lucide-react';
import { ClubCard } from '../components/community/ClubCard';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { mockClubs } from '../utils/mockData';

export const Clubs: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = [
    { id: 'all', label: 'All Clubs' },
    { id: 'music', label: 'Music' },
    { id: 'science', label: 'Science' },
    { id: 'art', label: 'Art' },
    { id: 'technology', label: 'Technology' },
    { id: 'literature', label: 'Literature' }
  ];

  const featuredClubs = [
    {
      id: 'featured-1',
      name: 'Young Innovators',
      talent: 'Technology',
      memberCount: 1247,
      description: 'Building the future through code, AI, and innovation',
      recentActivity: 'Sarah just shared her AI chatbot project'
    },
    {
      id: 'featured-2',
      name: 'Creative Writers Circle',
      talent: 'Literature',
      memberCount: 892,
      description: 'Where words come alive and stories find their voice',
      recentActivity: 'New poetry challenge: "Emotions in Color"'
    }
  ];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Join Your Tribe</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Connect with like-minded peers who share your passions and interests
        </p>
      </div>

      {/* Create Club CTA */}
      <Card className="mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can't find your perfect club?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create your own community and bring together students who share your unique interests.
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Club
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search clubs by name or interest..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Clubs */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Featured Clubs</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredClubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      </div>

      {/* All Clubs */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5 text-purple-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Clubs</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockClubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      </div>
    </div>
  );
};