import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, MapPin, Users, Calendar, Clock, Award, BookOpen, Briefcase, Palette, Atom, Trophy, GraduationCap, Lightbulb, Bot, Sparkles, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { AIChatModal } from '../components/ai/AIChatModal';

interface Mentor {
  id: string;
  name: string;
  email: string;
  expertise: string[];
  categories: string[];
  experience: string;
  rating: number;
  studentsCount: number;
  availability: boolean;
  location: string;
  bio: string;
  education: string;
  certifications: string[];
  specializations: string[];
  preferredStudentLevel: string[];
  hourlyRate?: number;
  responseTime: string;
  languages: string[];
  timezone: string;
  avatar?: string;
  verified: boolean;
  completedSessions: number;
  joinedAt: Date;
}

export const MentorCategories: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'availability'>('rating');
  const [isLoading, setIsLoading] = useState(true);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  
  const { user } = useAuth();

  const mentorCategories = [
    { 
      id: 'all', 
      label: 'All Mentors', 
      icon: Users, 
      color: 'gray',
      description: 'Browse all available mentors'
    },
    { 
      id: 'technology', 
      label: 'Technology', 
      icon: BookOpen, 
      color: 'blue',
      description: 'Programming, AI/ML, Web Development, Data Science'
    },
    { 
      id: 'business', 
      label: 'Business', 
      icon: Briefcase, 
      color: 'green',
      description: 'Entrepreneurship, Marketing, Finance, Strategy'
    },
    { 
      id: 'arts', 
      label: 'Arts', 
      icon: Palette, 
      color: 'pink',
      description: 'Visual Arts, Music, Design, Creative Writing'
    },
    { 
      id: 'science', 
      label: 'Science', 
      icon: Atom, 
      color: 'purple',
      description: 'Physics, Chemistry, Biology, Mathematics'
    },
    { 
      id: 'sports', 
      label: 'Sports', 
      icon: Trophy, 
      color: 'orange',
      description: 'Athletics, Fitness, Team Sports, Individual Sports'
    },
    { 
      id: 'academic', 
      label: 'Academic', 
      icon: GraduationCap, 
      color: 'indigo',
      description: 'Study Skills, Research, Academic Writing'
    },
    { 
      id: 'professional-development', 
      label: 'Professional Development', 
      icon: Lightbulb, 
      color: 'yellow',
      description: 'Career Guidance, Leadership, Communication'
    }
  ];

  const studentLevels = [
    { id: 'all', label: 'All Levels' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
    { id: 'expert', label: 'Expert' }
  ];

  useEffect(() => {
    loadMentors();
  }, []);

  useEffect(() => {
    filterMentors();
  }, [mentors, selectedCategory, selectedLevel, searchTerm, sortBy]);

  const loadMentors = async () => {
    try {
      setIsLoading(true);
      const mentorsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'mentor')
      );
      const snapshot = await getDocs(mentorsQuery);
      const mentorsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          joinedAt: data.joinedAt?.toDate ? data.joinedAt.toDate() : new Date(),
        };
      }) as Mentor[];
      setMentors(mentorsData);
    } catch (error) {
      console.error('Error loading mentors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterMentors = () => {
    let filtered = mentors;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(mentor => 
        mentor.categories.includes(selectedCategory)
      );
    }

    // Filter by student level
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(mentor => 
        mentor.preferredStudentLevel.includes(selectedLevel)
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(mentor =>
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        mentor.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort mentors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return b.completedSessions - a.completedSessions;
        case 'availability':
          return (b.availability ? 1 : 0) - (a.availability ? 1 : 0);
        default:
          return 0;
      }
    });

    setFilteredMentors(filtered);
  };

  const MentorCard = ({ mentor }: { mentor: Mentor }) => (
    <Card hover className="h-full">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <Avatar name={mentor.name} size="lg" />
            {mentor.verified && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <Award className="w-3 h-3 text-white" />
              </div>
            )}
            {mentor.availability && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">{mentor.name}</h3>
              {mentor.verified && (
                <Badge variant="default" className="bg-blue-100 text-blue-600 text-xs">
                  Verified
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{mentor.rating}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{mentor.studentsCount} students</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{mentor.location}</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{mentor.bio}</p>
          </div>
        </div>

        {/* Expertise Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {mentor.expertise.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="default" className="text-xs">{skill}</Badge>
          ))}
          {mentor.expertise.length > 3 && (
            <Badge variant="default" className="text-xs bg-gray-100 text-gray-600">
              +{mentor.expertise.length - 3}
            </Badge>
          )}
        </div>

        {/* Mentor Details */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Experience:</span>
            <span className="text-gray-900 dark:text-white">{mentor.completedSessions} sessions</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Response time:</span>
            <span className="text-gray-900 dark:text-white">{mentor.responseTime}</span>
          </div>
          {mentor.hourlyRate && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Rate:</span>
              <span className="text-gray-900 dark:text-white">${mentor.hourlyRate}/hour</span>
            </div>
          )}
        </div>

        {/* Availability Status */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-2 h-2 rounded-full ${mentor.availability ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {mentor.availability ? 'Available for new students' : 'Currently unavailable'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1"
            disabled={!mentor.availability}
          >
            Request Mentorship
          </Button>
          <Button size="sm" variant="outline">
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const CategoryCard = ({ category }: { category: typeof mentorCategories[0] }) => {
    const Icon = category.icon;
    const mentorCount = mentors.filter(m => 
      category.id === 'all' || m.categories.includes(category.id)
    ).length;

    return (
      <Card 
        hover 
        className={`cursor-pointer transition-all ${
          selectedCategory === category.id 
            ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' 
            : ''
        }`}
        onClick={() => setSelectedCategory(category.id)}
      >
        <CardContent className="p-6 text-center">
          <div className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${
            selectedCategory === category.id
              ? 'bg-purple-600 text-white'
              : `bg-${category.color}-100 dark:bg-${category.color}-900/20 text-${category.color}-600 dark:text-${category.color}-400`
          }`}>
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{category.label}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{category.description}</p>
          <Badge variant="default" className="text-xs">
            {mentorCount} mentors
          </Badge>
        </CardContent>
      </Card>
    );
  };

  // AI Mentor card data
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ paddingLeft: 80 }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Find Your Mentor</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Connect with experienced professionals across different categories to accelerate your growth
        </p>
      </div>

      {/* AI Mentor Spotlight (students only) */}
      {user && user.role === 'student' && (
        <>
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
          {/* AI Chat Modal */}
          <AIChatModal 
            isOpen={isAIChatOpen} 
            onClose={() => setIsAIChatOpen(false)} 
          />
        </>
      )}

      {/* Category Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mentorCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search mentors by name, expertise, or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {studentLevels.map((level) => (
                  <option key={level.id} value={level.id}>{level.label}</option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="rating">Sort by Rating</option>
                <option value="experience">Sort by Experience</option>
                <option value="availability">Sort by Availability</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {filteredMentors.length} mentors found
              {selectedCategory !== 'all' && (
                <span> in {mentorCategories.find(c => c.id === selectedCategory)?.label}</span>
              )}
            </span>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
                More Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mentors Grid */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : filteredMentors.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No mentors found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Try adjusting your search terms or filters to find the perfect mentor.
          </p>
          <Button onClick={() => {
            setSearchTerm('');
            setSelectedCategory('all');
            setSelectedLevel('all');
          }}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {selectedCategory === 'all' 
                ? 'All Mentors' 
                : `${mentorCategories.find(c => c.id === selectedCategory)?.label} Mentors`
              }
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Average response time: 3 hours</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};