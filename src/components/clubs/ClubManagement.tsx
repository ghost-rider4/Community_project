import React, { useState, useEffect } from 'react';
import { Users, Calendar, MessageSquare, Settings, UserPlus, UserMinus, Award, BarChart3, FileText, Video, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface ClubMember {
  id: string;
  name: string;
  email: string;
  joinedAt: Date;
  role: 'member' | 'moderator' | 'leader';
  contributions: number;
  lastActive: Date;
}

interface ClubActivity {
  id: string;
  type: 'project' | 'event' | 'discussion' | 'achievement';
  title: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  participants: number;
}

interface ClubManagementProps {
  clubId: string;
  clubName: string;
  isLeader: boolean;
}

export const ClubManagement: React.FC<ClubManagementProps> = ({ clubId, clubName, isLeader }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'activities' | 'events' | 'settings'>('overview');
  
  // Remove mock members and activities, use real fetching
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [activities, setActivities] = useState<ClubActivity[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const membersQuery = collection(db, 'clubs', clubId, 'members');
        const snapshot = await getDocs(membersQuery);
        const membersData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            joinedAt: data.joinedAt?.toDate ? data.joinedAt.toDate() : new Date(),
            lastActive: data.lastActive?.toDate ? data.lastActive.toDate() : new Date(),
          };
        }) as ClubMember[];
        setMembers(membersData);
      } catch (error) {
        console.error('Error fetching club members:', error);
      }
    };
    const fetchActivities = async () => {
      try {
        const activitiesQuery = collection(db, 'clubs', clubId, 'activities');
        const snapshot = await getDocs(activitiesQuery);
        const activitiesData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          };
        }) as ClubActivity[];
        setActivities(activitiesData);
      } catch (error) {
        console.error('Error fetching club activities:', error);
      }
    };
    fetchMembers();
    fetchActivities();
  }, [clubId]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'activities', label: 'Activities', icon: FileText },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Club Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{members.length}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Members</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{activities.length}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Projects</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">3</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Events</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">12</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Achievements</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.slice(0, 3).map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  {activity.type === 'project' && <FileText className="w-4 h-4 text-purple-600" />}
                  {activity.type === 'event' && <Calendar className="w-4 h-4 text-purple-600" />}
                  {activity.type === 'discussion' && <MessageSquare className="w-4 h-4 text-purple-600" />}
                  {activity.type === 'achievement' && <Award className="w-4 h-4 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{activity.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{activity.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>By {activity.createdBy}</span>
                    <span>{activity.participants} participants</span>
                    <span>{activity.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMembers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Club Members</h2>
        {isLeader && (
          <Button>
            <UserPlus className="w-4 h-4" />
            Invite Members
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={member.name} size="md" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{member.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{member.email}</p>
                </div>
                <Badge variant={member.role === 'leader' ? 'gold' : member.role === 'moderator' ? 'silver' : 'default'}>
                  {member.role}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Joined:</span>
                  <span className="text-gray-900 dark:text-white">{member.joinedAt.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Contributions:</span>
                  <span className="text-gray-900 dark:text-white">{member.contributions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Last Active:</span>
                  <span className="text-gray-900 dark:text-white">Today</span>
                </div>
              </div>

              {isLeader && member.role !== 'leader' && (
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </Button>
                  <Button size="sm" variant="outline">
                    <UserMinus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderActivities = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Club Activities</h2>
        {isLeader && (
          <Button>
            <Plus className="w-4 h-4" />
            Create Activity
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <Card key={activity.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{activity.title}</h4>
                    <Badge variant="default">
                      {activity.type}
                    </Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{activity.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Created by {activity.createdBy}</span>
                    <span>{activity.participants} participants</span>
                    <span>{activity.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">View</Button>
                  {isLeader && <Button size="sm" variant="outline">Edit</Button>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Club Events</h2>
        {isLeader && (
          <Button>
            <Calendar className="w-4 h-4" />
            Schedule Event
          </Button>
        )}
      </div>

      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No events scheduled
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Schedule your first club event to bring members together.
        </p>
        {isLeader && (
          <Button>
            <Calendar className="w-4 h-4" />
            Schedule First Event
          </Button>
        )}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Club Settings</h2>
      
      {isLeader ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">General Settings</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Club Name
                </label>
                <input
                  type="text"
                  defaultValue={clubName}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Update your club description..."
                />
              </div>
              
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Privacy Settings</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Private Club</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Only invited members can join</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-12">
          <Settings className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Access Restricted
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Only club leaders can access settings.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{clubName}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isLeader ? 'Manage your club activities and members' : 'Club dashboard and activities'}
        </p>
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
      {activeTab === 'members' && renderMembers()}
      {activeTab === 'activities' && renderActivities()}
      {activeTab === 'events' && renderEvents()}
      {activeTab === 'settings' && renderSettings()}
    </div>
  );
};