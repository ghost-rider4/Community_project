import React, { useState } from 'react';
import { Filter, MapPin, Calendar } from 'lucide-react';
import { OpportunityCard } from '../components/opportunities/OpportunityCard';
import { Button } from '../components/ui/Button';
import { mockOpportunities } from '../utils/mockData';

export const Opportunities: React.FC = () => {
  const [selectedType, setSelectedType] = useState('all');
  
  const types = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'internship', label: 'Internships' },
    { id: 'project', label: 'Projects' },
    { id: 'placement', label: 'Placements' }
  ];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Opportunities</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover internships, projects, and placements tailored to your talents
        </p>
      </div>
      
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <div className="flex items-center gap-2">
              {types.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedType === type.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <MapPin className="w-4 h-4" />
              Location
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4" />
              Deadline
            </Button>
          </div>
        </div>
      </div>
      
      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockOpportunities.map((opportunity) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} />
        ))}
      </div>
    </div>
  );
};