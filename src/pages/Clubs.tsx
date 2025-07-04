import React, { useState, useEffect } from 'react';
import { Search, Users, Plus, TrendingUp, Crown, Star, Calendar, MessageSquare, Settings, UserPlus, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { listenToClubs, joinClub, createClub, deleteClub, leaveClub } from '../services/clubService';
import { ChatModal } from '../components/chat/ChatModal';
import { ClubCard } from '../components/community/ClubCard';

interface Club {
  id: string;
  name: string;
  category: string;
  description: string;
  memberCount: number;
  leaderId: string;
  leaderName: string;
  isVerified: boolean;
  tags: string[];
  recentActivity: string;
  createdAt: Date;
  maxMembers?: number;
  isPrivate: boolean;
  requirements?: string[];
  members?: string[];
}

export const Clubs: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('featured');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuth();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClubForChat, setSelectedClubForChat] = useState<Club | null>(null);
  const [selectedClubForDetails, setSelectedClubForDetails] = useState<Club | null>(null);
  
  // Comprehensive club categories for students
  const studentCategories = [
    { id: 'featured', label: 'Featured Clubs', icon: '🌟' },
    { id: 'all', label: 'All Clubs', icon: '🌞' },
    { id: 'music-performance', label: 'Music & Performance', icon: '🎵' },
    { id: 'science-technology', label: 'Science & Technology', icon: '🧑‍🔬' },
    { id: 'art-design', label: 'Art & Design', icon: '🎨' },
    { id: 'sports-athletics', label: 'Sports & Athletics', icon: '⚽' },
    { id: 'literature-writing', label: 'Literature & Writing', icon: '🗂️' },
    { id: 'environmental-sustainability', label: 'Environmental & Sustainability', icon: '🌱' },
    { id: 'debate-public-speaking', label: 'Debate & Public Speaking', icon: '🎤' },
    { id: 'gaming-esports', label: 'Gaming & E-sports', icon: '🎮' },
    { id: 'cultural-language', label: 'Cultural & Language', icon: '🌍' },
    { id: 'community-service', label: 'Community Service', icon: '🤝' },
    { id: 'business-entrepreneurship', label: 'Business & Entrepreneurship', icon: '💼' },
    { id: 'photography-media', label: 'Photography & Media', icon: '📸' },
    { id: 'others', label: 'Others', icon: '✨' }
  ];

  useEffect(() => {
    const unsubscribe = listenToClubs((clubs) => {
      setClubs(clubs);
    });
    return () => unsubscribe();
  }, []);

  const filteredClubs = clubs.filter(club => {
    if (selectedCategory === 'featured') return false;
    const matchesCategory = selectedCategory === 'all' || club.category === selectedCategory;
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const CreateClubModal = () => {
    const [newClub, setNewClub] = useState({
      name: '',
      category: '',
      description: '',
      tags: '',
      isPrivate: false,
      maxMembers: 100
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) return;

      const clubData = {
        name: newClub.name,
        category: newClub.category,
        description: newClub.description,
        tags: newClub.tags.split(',').map((t) => t.trim()).filter(Boolean),
        isPrivate: newClub.isPrivate,
        maxMembers: newClub.maxMembers,
        memberCount: 1,
        leaderId: user.id,
        leaderName: user.name,
        isVerified: false,
        recentActivity: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        moderators: [],
        requirements: [],
        members: [user.id],
      };

      try {
        await createClub(clubData);
      setShowCreateModal(false);
      setNewClub({
        name: '',
        category: '',
        description: '',
        tags: '',
        isPrivate: false,
        maxMembers: 100
      });
      } catch (err) {
        alert('Failed to create club');
        console.error(err);
      }
    };

    if (!showCreateModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {user?.role === 'mentor' ? 'Create New Club' : 'Suggest New Club'}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Club Name *
                </label>
                <input
                  type="text"
                  value={newClub.name}
                  onChange={(e) => setNewClub(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter club name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={newClub.category}
                  onChange={(e) => setNewClub(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select a category</option>
                  {studentCategories.slice(1).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={newClub.description}
                  onChange={(e) => setNewClub(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Describe your club's purpose and activities"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newClub.tags}
                  onChange={(e) => setNewClub(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., programming, AI, innovation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Members
                </label>
                <input
                  type="number"
                  value={newClub.maxMembers}
                  onChange={(e) => setNewClub(prev => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
                  min="10"
                  max="1000"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={newClub.isPrivate}
                  onChange={(e) => setNewClub(prev => ({ ...prev, isPrivate: e.target.checked }))}
                  className="rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="isPrivate" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Private club (invitation only)
                </label>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1">
                  {user?.role === 'mentor' ? 'Create Club' : 'Submit Suggestion'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  };

  const handleJoinClub = async (clubId: string) => {
    if (user) {
      await joinClub(clubId, user.id);
    }
  };

  const handleOpenChat = (club: Club) => {
    setSelectedClubForChat(club);
  };
  const handleCloseChat = () => {
    setSelectedClubForChat(null);
  };

  const handleOpenDetails = (club: Club) => setSelectedClubForDetails(club);
  const handleCloseDetails = () => setSelectedClubForDetails(null);

  const ClubCardWrapper = ({ club }: { club: Club }) => {
    return (
      <div>
        <ClubCard club={club} onOpenChat={handleOpenChat} onOpenDetails={handleOpenDetails} />
        </div>
    );
  };

  // Compute joined and created clubs
  const joinedClubs = clubs.filter(club => club.members?.includes(user?.id ?? ''));
  const createdClubs = clubs.filter(club => club.leaderId === user?.id);
  // For mentors, joined clubs are those where they are a member but not the leader
  const joinedButNotCreatedClubs = user?.role === 'mentor'
    ? joinedClubs.filter(club => club.leaderId !== user.id)
    : joinedClubs;
  // Clubs not joined or created
  const joinedOrCreatedIds = new Set([
    ...joinedClubs.map(c => c.id),
    ...createdClubs.map(c => c.id),
  ]);
  const filteredOtherClubs = filteredClubs.filter(club => !joinedOrCreatedIds.has(club.id));

  const ClubDetailsModal = ({ club, onClose }: { club: Club; onClose: () => void }) => {
    const { user } = useAuth();
    const isMember = user && club.members && club.members.includes(user.id);
    const isLeader = user && club.leaderId === user.id;
    const handleJoinClub = async () => {
      if (user) {
        await joinClub(club.id, user.id);
        onClose();
      }
    };
    const handleLeaveClub = async () => {
      if (user) {
        await leaveClub(club.id, user.id);
        onClose();
      }
    };
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 flex flex-col items-center">
          <button onClick={onClose} className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-purple-600">&times;</button>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{club.name}</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">{club.description}</p>
          <p className="text-md text-gray-500 dark:text-gray-400 mb-4">Admin: {club.leaderName}</p>
          {!isMember && (
            <Button variant="outline" size="md" className="mt-2" onClick={handleJoinClub}>
              Join Club
            </Button>
          )}
          {isMember && !isLeader && (
            <Button variant="outline" size="md" className="mt-2" onClick={handleLeaveClub}>
              Leave Club
          </Button>
          )}
        </div>
      </div>
  );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ paddingLeft: 80 }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {user?.role === 'mentor' ? 'Manage Your Clubs' : 'Join Your Tribe'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {user?.role === 'mentor' 
            ? 'Create and manage clubs that align with your expertise. Guide students through project-based learning.'
            : 'Connect with like-minded peers who share your passions and interests'
          }
        </p>
      </div>

      {/* Create Club CTA */}
      <Card className="mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {user?.role === 'mentor' 
                  ? "Ready to lead a community?" 
                  : "Can't find your perfect club?"
                }
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {user?.role === 'mentor'
                  ? 'Create a new club based on your professional background and expertise. Foster skill development in your domain.'
                  : 'Create your own community and bring together students who share your unique interests.'
                }
              </p>
            </div>
            <Button className="flex items-center gap-2" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4" />
              {user?.role === 'mentor' ? 'Create Club' : 'Suggest Club'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search clubs by name, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {selectedCategory === 'featured' ? filteredClubs.length : filteredClubs.length} clubs found
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {studentCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                }`}
              >
                <span>{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mentor UX: Created Clubs */}
      {user?.role === 'mentor' && createdClubs.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-green-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Created Clubs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {createdClubs.map((club) => (
              <ClubCardWrapper key={club.id} club={club} />
            ))}
          </div>
        </div>
      )}
      {/* Mentor & Student UX: Joined Clubs */}
      {joinedButNotCreatedClubs.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Joined Clubs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {joinedButNotCreatedClubs.map((club) => (
              <ClubCardWrapper key={club.id} club={club} />
            ))}
          </div>
        </div>
      )}
      {/* Featured Clubs (not joined/created) */}
      {selectedCategory === 'featured' && filteredClubs.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Featured Clubs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map((club) => (
              <ClubCardWrapper key={club.id} club={club} />
            ))}
          </div>
        </div>
      )}
      {/* All Clubs (not joined/created/featured) */}
      {selectedCategory === 'all' && (
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5 text-purple-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              All Clubs
          </h2>
        </div>
          {filteredOtherClubs.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No clubs found' : 'No clubs in this category yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms or browse other categories.'
                  : 'Be the first to create a club in this category!'}
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4" />
              {user?.role === 'mentor' ? 'Create Club' : 'Suggest Club'}
            </Button>
          </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOtherClubs.map((club) => (
                <ClubCardWrapper key={club.id} club={club} />
              ))}
            </div>
          )}
        </div>
      )}
      {/* Category-specific clubs (other than featured/all) */}
      {selectedCategory !== 'featured' && selectedCategory !== 'all' && filteredClubs.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {studentCategories.find(c => c.id === selectedCategory)?.label || 'Clubs'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map((club) => (
              <ClubCardWrapper key={club.id} club={club} />
            ))}
          </div>
          </div>
        )}

      <CreateClubModal />

      {/* Single ChatModal for all clubs */}
      {selectedClubForChat && (
        <ChatModal
          open={!!selectedClubForChat}
          onClose={handleCloseChat}
          channelType="team"
          members={selectedClubForChat.members || []}
          channelId={`club-${selectedClubForChat.id}`}
        />
      )}

      {/* Render ClubDetailsModal if a club is selected */}
      {selectedClubForDetails && (
        <ClubDetailsModal club={selectedClubForDetails} onClose={handleCloseDetails} />
      )}
    </div>
  );
};