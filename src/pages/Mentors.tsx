import React, { useState, useEffect } from 'react';
import { Search, Star, MapPin, Bot, Sparkles, MessageCircle, Users } from 'lucide-react';
import { AIChatModal } from '../components/ai/AIChatModal';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';
import { MentorCard } from '../components/community/MentorCard';
import { ChatRequestManagement } from '../components/mentors/ChatRequestManagement';
import { fetchMentors } from '../services/mentorshipService';
import { Mentor } from '../types';

export const Mentors: React.FC = () => {
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoadingMentors, setIsLoadingMentors] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const expertiseAreas = [
    { id: 'all', label: 'All Mentors' },
    { id: 'music', label: 'Music' },
    { id: 'science', label: 'Science' },
    { id: 'technology', label: 'Technology' },
    { id: 'art', label: 'Art' }
  ];

  const aiMentor = {
    id: 'ai-mentor',
    name: 'Sophia AI',
    description: 'Your personal AI mentor powered by advanced machine learning. Available 24/7 to help with any subject, provide personalized guidance, and support your learning journey.',
    expertise: ['All Subjects', 'Study Planning', 'Career Guidance', 'Skill Assessment'],
    features: [
      'Instant responses to any question',
      'Personalized learning paths',
      'Progress tracking and analytics',
      'Emotional support and motivation'
    ],
    rating: 4.9,
    interactions: '10,000+',
    availability: true
  };
  
  const { user } = useAuth();

  // Fetch mentors on component mount
  useEffect(() => {
    const loadMentors = async () => {
      try {
        const mentorsData = await fetchMentors();
        setMentors(mentorsData);
      } catch (error) {
        console.error('Error loading mentors:', error);
      } finally {
        setIsLoadingMentors(false);
      }
    };

    loadMentors();
  }, []);

  // Filter mentors based on search term and expertise
  const filteredMentors = mentors.filter((mentor: Mentor) => {
    const matchesSearch = searchTerm === '' || 
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.expertise.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesExpertise = selectedExpertise === 'all' || 
      mentor.expertise.some((skill: string) => skill.toLowerCase().includes(selectedExpertise.toLowerCase()));
    
    return matchesSearch && matchesExpertise;
  });
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8" style={{ paddingLeft: 80 }}>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Find Your Mentor</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Connect with experienced professionals and AI-powered guidance to accelerate your growth
        </p>
      </div>

      {/* Show chat request management for mentors */}
      {user?.role === 'mentor' && (
        <div className="mb-8">
          <ChatRequestManagement />
        </div>
      )}

      {/* AI Mentor Spotlight (students only) */}
      {user && user.role === 'student' && (
        <Card className="mb-6 sm:mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800 overflow-hidden">
          <CardContent className="p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                </div>
              </div>
              
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{aiMentor.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs">
                      AI Mentor
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-yellow-600 dark:text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{aiMentor.rating}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">{aiMentor.description}</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">Expertise Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      {aiMentor.expertise.map((skill) => (
                        <Badge key={skill} variant="default" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">Key Features</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {aiMentor.features.slice(0, 2).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0"></div>
                          <span className="text-xs sm:text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <Button 
                    className="flex items-center gap-2 w-full sm:w-auto"
                    onClick={() => setIsAIChatOpen(true)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Start Chat with AI
                  </Button>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{aiMentor.interactions}</span> successful interactions
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search mentors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto w-full">
              {expertiseAreas.map((area) => (
                <button
                  key={area.id}
                  onClick={() => setSelectedExpertise(area.id)}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedExpertise === area.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                  }`}
                >
                  {area.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Rating</span>
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Location</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Human Mentors */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
          Human Mentors
          {filteredMentors.length > 0 && (
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              ({filteredMentors.length} found)
            </span>
          )}
        </h2>
        
        {isLoadingMentors ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredMentors.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {mentors.length === 0 ? 'No mentors available yet' : 'No mentors match your search'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {mentors.length === 0 
                ? "We're working on connecting you with amazing mentors. In the meantime, try our AI mentor!"
                : "Try adjusting your search terms or expertise filters."
              }
            </p>
            {mentors.length === 0 && (
              <Button onClick={() => setIsAIChatOpen(true)}>
                Chat with Sophia AI
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        )}
      </div>

      {/* AI Chat Modal */}
      <AIChatModal 
        isOpen={isAIChatOpen} 
        onClose={() => setIsAIChatOpen(false)} 
      />
    </div>
  );
};