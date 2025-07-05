import React, { useState, useEffect } from 'react';
import { Users, Search, ArrowRight, Star, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { MentorCard } from '../community/MentorCard';
import { ChatRequestModal } from '../mentors/ChatRequestModal';
import { useAuth } from '../../contexts/AuthContext';
import { fetchMentors } from '../../services/mentorshipService';
import { Mentor } from '../../types';
import { useNavigate } from 'react-router-dom';

export const MentorProfiles: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

  useEffect(() => {
    const loadMentors = async () => {
      try {
        const mentorsData = await fetchMentors();
        setMentors(mentorsData);
      } catch (error) {
        console.error('Error loading mentors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMentors();
  }, []);

  // Filter mentors based on search term
  const filteredMentors = mentors.filter((mentor: Mentor) => 
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.expertise.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Show only first 6 mentors on dashboard
  const displayedMentors = filteredMentors.slice(0, 6);

  // Don't show for mentors, only for students
  if (user?.role !== 'student') {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Available Mentors
            </h2>
            {mentors.length > 0 && (
              <Badge variant="default" className="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                {mentors.length}
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/mentors')}
            className="flex items-center gap-2"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search mentors by name or expertise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : displayedMentors.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No mentors found' : 'No mentors available'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms.'
                : 'Check back later for available mentors.'
              }
            </p>
            {searchTerm && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {displayedMentors.map((mentor) => (
                <div key={mentor.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <Avatar name={mentor.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate text-sm">
                          {mentor.name}
                        </h3>
                        {mentor.availability && (
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span>{mentor.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{mentor.studentsCount}</span>
                        </div>
                        {mentor.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{mentor.location}</span>
                          </div>
                        )}
                      </div>
                      
                                             <div className="flex flex-wrap gap-1 mb-3">
                         {mentor.expertise.slice(0, 2).map((skill) => (
                           <Badge key={skill} variant="default" className="text-xs">
                             {skill}
                           </Badge>
                         ))}
                         {mentor.expertise.length > 2 && (
                           <Badge variant="default" className="text-xs">
                             +{mentor.expertise.length - 2} more
                           </Badge>
                         )}
                       </div>
                       
                       <Button
                         variant="primary"
                         size="sm"
                         onClick={() => setSelectedMentor(mentor)}
                         className="w-full text-xs"
                       >
                         Request Chat
                       </Button>
                     </div>
                   </div>
                 </div>
              ))}
            </div>

            {filteredMentors.length > 6 && (
              <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/mentors')}
                  className="flex items-center gap-2"
                >
                  View {filteredMentors.length - 6} More Mentors
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
                     </>
         )}
       </CardContent>
       
       {/* Chat Request Modal */}
       {selectedMentor && (
         <ChatRequestModal
           open={!!selectedMentor}
           onClose={() => setSelectedMentor(null)}
           mentor={selectedMentor}
         />
       )}
     </Card>
   );
 };