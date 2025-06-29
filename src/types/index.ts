export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  location: string;
  role: 'student' | 'mentor';
  avatar?: string;
  joinedAt: Date;
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

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type Tier = 'bronze' | 'silver' | 'gold' | 'diamond';

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