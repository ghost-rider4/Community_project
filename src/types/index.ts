export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  location: string;
  role: 'student' | 'mentor';
  avatar?: string;
  joinedAt: Date;
  psychometricCompleted?: boolean;
  psychometricResults?: any;
}

export interface Student extends User {
  role: 'student';
  talents: Talent[];
  skillLevel: SkillLevel;
  points: number;
  tier: Tier;
  clubs: string[];
  mentorId?: string;
  psychometricCompleted: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  achievements: Achievement[];
  streaks: Streak[];
  level: number;
  experience: number;
  nextLevelExp: number;
}

export interface Mentor extends User {
  role: 'mentor';
  expertise: string[];
  experience: string;
  rating: number;
  studentsCount: number;
  availability: boolean;
}

export interface Talent {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  level: SkillLevel;
}

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type Tier = 'Bronze' | 'Silver' | 'Gold' | 'Diamond';

export interface Project {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  talent: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'document';
  likes: number;
  comments: Comment[];
  tags: string[];
  createdAt: Date;
  verified: boolean;
  likedBy?: string[];
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  type: 'internship' | 'project' | 'placement';
  description: string;
  requirements: string[];
  location: string;
  skillLevel: SkillLevel[];
  talents: string[];
  deadline: Date;
  isPaid: boolean;
}

export interface Club {
  id: string;
  name: string;
  talent: string;
  memberCount: number;
  description: string;
  recentActivity: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  talent: string;
  difficulty: SkillLevel;
  points: number;
  deadline: Date;
  participants: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'social' | 'creative' | 'leadership' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export interface Streak {
  id: string;
  type: 'daily_login' | 'project_upload' | 'challenge_complete' | 'mentor_session';
  count: number;
  lastUpdated: Date;
  maxStreak: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  tier: Tier;
  level: number;
  rank: number;
  talents: string[];
  weeklyGain: number;
}

export interface TierBenefit {
  id: string;
  title: string;
  description: string;
  tier: Tier;
  icon: string;
}

export interface LevelReward {
  level: number;
  points: number;
  title: string;
  description: string;
  rewards: string[];
}

export interface ChatRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  mentorId: string;
  mentorName: string;
  status: 'pending' | 'accepted' | 'declined';
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MentorshipConnection {
  id: string;
  studentId: string;
  mentorId: string;
  status: 'active' | 'inactive' | 'ended';
  chatChannelId: string;
  createdAt: Date;
  updatedAt: Date;
}