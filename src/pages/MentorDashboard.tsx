import React, { useState, useEffect } from 'react';
import { Users, Calendar, MessageSquare, BookOpen, Award, Settings, Bell, Search, Filter, Plus, Video, Clock, Star } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Student {
  id: string;
  name: string;
  email: string;
  talents: any[];
  level: number;
  points: number;
  tier: string;
  lastActive: Date;
  progress: number;
}

interface MentorSession {
  id: string;
  studentId: string;
  studentName: string;
  date: Date;
  duration: number;
  type: 'video' | 'chat' | 'review';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export const MentorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'sessions' | 'calendar' | 'messages'>('overview');
  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<MentorSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'mentor') {
      loadMentorData();
    }
  }, [user]);

  const loadMentorData = async () => {
    try {
      setIsLoading(true);
      // In a real implementation, this would fetch mentor's assigned students
      // For now, we'll show empty states
      setStudents([]);
      setSessions([]);
    } catch (error) {
      console.error('Error loading mentor data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'students', label: 'My Students', icon: Users },
    { id: 'sessions', label: 'Sessions', icon: Video },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Students</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{students.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Sessions This Week</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-300">
                  {sessions.filter(s => s.status === 'scheduled').length}
                </p>
              </div>
              <Video className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Avg Rating</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">
                  {user?.rating || 'N/A'}
                </p>
              </div>
              <Star className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Hours Mentored</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">
                  {user?.completedSessions || 0}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">No recent activity</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your mentoring activities will appear here once you start working with students.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="flex items-center gap-2 h-auto p-4">
              <Plus className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Schedule Session</div>
                <div className="text-sm opacity-80">Book a new mentoring session</div>
              </div>
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
              <MessageSquare className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Message Students</div>
                <div className="text-sm opacity-80">Send updates or feedback</div>
              </div>
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
              <Award className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Review Progress</div>
                <div className="text-sm opacity-80">Check student achievements</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Students</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search students..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>

      {students.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No students assigned yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Students will appear here once they request mentorship or are assigned to you.
            </p>
            <Button>
              <Plus className="w-4 h-4" />
              Find Students
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <Card key={student.id} hover>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar name={student.name} size="md" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{student.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Level {student.level}</p>
                  </div>
                  <Badge variant={student.tier.toLowerCase() as any}>{student.tier}</Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-medium">{student.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${student.progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">Message</Button>
                  <Button size="sm" variant="outline">Schedule</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderSessions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Mentoring Sessions</h2>
        <Button>
          <Plus className="w-4 h-4" />
          Schedule Session
        </Button>
      </div>

      <Card>
        <CardContent className="text-center py-12">
          <Video className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No sessions scheduled
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Schedule your first mentoring session to get started.
          </p>
          <Button>
            <Plus className="w-4 h-4" />
            Schedule First Session
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderCalendar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Calendar</h2>
        <Button>
          <Plus className="w-4 h-4" />
          Add Event
        </Button>
      </div>

      <Card>
        <CardContent className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Calendar integration coming soon
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your mentoring schedule and availability here.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Messages</h2>
        <Button>
          <Plus className="w-4 h-4" />
          New Message
        </Button>
      </div>

      <Card>
        <CardContent className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No messages yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your conversations with students will appear here.
          </p>
          <Button>
            <MessageSquare className="w-4 h-4" />
            Start Conversation
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Mentor Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {user?.name}! Manage your mentoring activities and connect with students.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white border-b-2 border-purple-600'
                  : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'students' && renderStudents()}
      {activeTab === 'sessions' && renderSessions()}
      {activeTab === 'calendar' && renderCalendar()}
      {activeTab === 'messages' && renderMessages()}
    </div>
  );
};