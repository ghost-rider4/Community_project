import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Filter, Search, Plus, Star, Bell, ExternalLink, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { collection, query, where, orderBy, getDocs, addDoc, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Event {
  id: string;
  title: string;
  description: string;
  category: 'workshop' | 'seminar' | 'networking' | 'competition' | 'masterclass' | 'social';
  organizer: string;
  organizerName: string;
  startDate: Date;
  endDate: Date;
  location: string;
  isVirtual: boolean;
  maxAttendees?: number;
  attendees: string[];
  registeredUsers: string[];
  requirements?: string[];
  materials?: string[];
  meetingLink?: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'all';
  price: number;
  featured: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: Date;
  feedback?: {
    rating: number;
    reviews: number;
  };
}

export const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'registered' | 'past'>('upcoming');
  const [isLoading, setIsLoading] = useState(true);
  
  const { user } = useAuth();
  const { scheduleEventReminder } = useNotifications();

  const categories = [
    { id: 'all', label: 'All Events', icon: '🌟' },
    { id: 'workshop', label: 'Workshops', icon: '🛠️' },
    { id: 'seminar', label: 'Seminars', icon: '📚' },
    { id: 'networking', label: 'Networking', icon: '🤝' },
    { id: 'competition', label: 'Competitions', icon: '🏆' },
    { id: 'masterclass', label: 'Masterclasses', icon: '🎓' },
    { id: 'social', label: 'Social Events', icon: '🎉' }
  ];

  // Sample events data (in real app, this would come from Firebase)
  const sampleEvents: Event[] = [
    {
      id: '1',
      title: 'AI in Music Composition Workshop',
      description: 'Learn how artificial intelligence is revolutionizing music composition. Hands-on workshop with industry experts.',
      category: 'workshop',
      organizer: 'mentor1',
      organizerName: 'Dr. Sarah Martinez',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours duration
      location: 'Virtual',
      isVirtual: true,
      maxAttendees: 50,
      attendees: [],
      registeredUsers: [],
      requirements: ['Basic music theory knowledge', 'Computer with internet access'],
      materials: ['Digital Audio Workstation (DAW)', 'Notebook for taking notes'],
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      tags: ['AI', 'Music', 'Technology', 'Composition'],
      difficulty: 'intermediate',
      price: 0,
      featured: true,
      status: 'upcoming',
      createdAt: new Date(),
      feedback: { rating: 4.8, reviews: 23 }
    },
    {
      id: '2',
      title: 'Young Entrepreneurs Networking Event',
      description: 'Connect with like-minded young entrepreneurs and learn from successful business leaders.',
      category: 'networking',
      organizer: 'mentor2',
      organizerName: 'Marcus Thompson',
      startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours duration
      location: 'San Francisco, CA',
      isVirtual: false,
      maxAttendees: 30,
      attendees: [],
      registeredUsers: [],
      tags: ['Business', 'Networking', 'Entrepreneurship'],
      difficulty: 'all',
      price: 25,
      featured: false,
      status: 'upcoming',
      createdAt: new Date(),
      feedback: { rating: 4.6, reviews: 15 }
    },
    {
      id: '3',
      title: 'Digital Art Masterclass',
      description: 'Advanced techniques in digital art and illustration with professional artist Isabella Rodriguez.',
      category: 'masterclass',
      organizer: 'mentor3',
      organizerName: 'Isabella Rodriguez',
      startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 hours duration
      location: 'Virtual',
      isVirtual: true,
      maxAttendees: 25,
      attendees: [],
      registeredUsers: [],
      requirements: ['Adobe Creative Suite', 'Drawing tablet (recommended)'],
      materials: ['Reference images', 'Sketchbook'],
      tags: ['Digital Art', 'Illustration', 'Design'],
      difficulty: 'advanced',
      price: 50,
      featured: true,
      status: 'upcoming',
      createdAt: new Date()
    }
  ];

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, selectedCategory, searchTerm, activeTab]);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      // In a real implementation, this would fetch from Firebase
      setEvents(sampleEvents);
      
      // Load user's registered events
      if (user) {
        // This would come from user document or separate registrations collection
        setRegisteredEvents([]);
      }
      
      // Load past events
      setPastEvents([]);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    // Filter by tab
    if (activeTab === 'registered') {
      filtered = events.filter(event => registeredEvents.includes(event.id));
    } else if (activeTab === 'past') {
      filtered = pastEvents;
    } else {
      // upcoming events
      filtered = events.filter(event => event.status === 'upcoming');
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredEvents(filtered);
  };

  const registerForEvent = async (eventId: string) => {
    if (!user) return;

    try {
      const event = events.find(e => e.id === eventId);
      if (!event) return;

      // Add user to event attendees
      await updateDoc(doc(db, 'events', eventId), {
        registeredUsers: arrayUnion(user.id)
      });

      // Update local state
      setRegisteredEvents(prev => [...prev, eventId]);
      setEvents(prev => prev.map(e => 
        e.id === eventId 
          ? { ...e, registeredUsers: [...e.registeredUsers, user.id] }
          : e
      ));

      // Schedule event reminders
      await scheduleEventReminder(eventId, event.title, event.startDate);

    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

  const unregisterFromEvent = async (eventId: string) => {
    if (!user) return;

    try {
      // Remove user from event attendees
      await updateDoc(doc(db, 'events', eventId), {
        registeredUsers: arrayRemove(user.id)
      });

      // Update local state
      setRegisteredEvents(prev => prev.filter(id => id !== eventId));
      setEvents(prev => prev.map(e => 
        e.id === eventId 
          ? { ...e, registeredUsers: e.registeredUsers.filter(id => id !== user.id) }
          : e
      ));

    } catch (error) {
      console.error('Error unregistering from event:', error);
    }
  };

  const EventCard = ({ event }: { event: Event }) => {
    const isRegistered = registeredEvents.includes(event.id);
    const isFull = event.maxAttendees && event.registeredUsers.length >= event.maxAttendees;
    const isPast = activeTab === 'past';

    return (
      <Card hover className="h-full">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                {event.featured && (
                  <Badge variant="default" className="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {event.description}
              </p>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{event.startDate.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>
                {event.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                {event.endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
              {event.isVirtual && (
                <Badge variant="default" className="bg-green-100 text-green-600 text-xs">
                  Virtual
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4" />
              <span>
                {event.registeredUsers.length}
                {event.maxAttendees && `/${event.maxAttendees}`} registered
              </span>
            </div>
          </div>

          {/* Organizer */}
          <div className="flex items-center gap-2 mb-4">
            <Avatar name={event.organizerName} size="sm" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              by {event.organizerName}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {event.tags.slice(0, 3).map((tag) => (
              <span 
                key={tag}
                className="px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs rounded-full">
                +{event.tags.length - 3}
              </span>
            )}
          </div>

          {/* Price */}
          {event.price > 0 && (
            <div className="mb-4">
              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                ${event.price}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {isPast ? (
              <div className="flex gap-2 w-full">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                {event.feedback && (
                  <Button variant="outline" size="sm">
                    <Star className="w-4 h-4" />
                    Rate
                  </Button>
                )}
              </div>
            ) : isRegistered ? (
              <div className="flex gap-2 w-full">
                <Button variant="outline" size="sm" className="flex-1">
                  <ExternalLink className="w-4 h-4" />
                  Join Event
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => unregisterFromEvent(event.id)}
                >
                  Unregister
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 w-full">
                <Button 
                  size="sm" 
                  className="flex-1"
                  disabled={isFull}
                  onClick={() => registerForEvent(event.id)}
                >
                  {isFull ? 'Event Full' : 'Register'}
                </Button>
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Events</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover workshops, seminars, and networking opportunities to enhance your skills
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'upcoming', label: 'Upcoming Events', count: events.filter(e => e.status === 'upcoming').length },
          { id: 'registered', label: 'My Events', count: registeredEvents.length },
          { id: 'past', label: 'Past Events', count: pastEvents.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white border-b-2 border-purple-600'
                : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
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
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {filteredEvents.length} events found
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
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

      {/* Events Grid */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {searchTerm || selectedCategory !== 'all' ? 'No events found' : 'No events available'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search terms or filters.'
              : 'Check back soon for exciting events and workshops!'
            }
          </p>
          <Button onClick={() => {
            if (user) {
              scheduleEventReminder('general', 'Events Notification', new Date(Date.now() + 24 * 60 * 60 * 1000));
            }
          }}>
            <Bell className="w-4 h-4" />
            Get Notified
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};