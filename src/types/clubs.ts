export interface Club {
  id: string;
  name: string;
  category: string;
  description: string;
  memberCount: number;
  maxMembers?: number;
  leaderId: string;
  leaderName: string;
  moderators: string[];
  isVerified: boolean;
  isPrivate: boolean;
  tags: string[];
  requirements?: string[];
  recentActivity: string;
  createdAt: Date;
  updatedAt: Date;
  avatar?: string;
  banner?: string;
  rules?: string[];
  socialLinks?: {
    website?: string;
    discord?: string;
    slack?: string;
  };
}

export interface ClubMember {
  id: string;
  userId: string;
  clubId: string;
  name: string;
  email: string;
  role: 'member' | 'moderator' | 'leader';
  joinedAt: Date;
  contributions: number;
  lastActive: Date;
  status: 'active' | 'inactive' | 'banned';
}

export interface ClubActivity {
  id: string;
  clubId: string;
  type: 'project' | 'event' | 'discussion' | 'achievement' | 'announcement';
  title: string;
  description: string;
  content?: string;
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
  participants: string[];
  attachments?: string[];
  status: 'active' | 'completed' | 'cancelled';
  dueDate?: Date;
  tags?: string[];
}

export interface ClubEvent {
  id: string;
  clubId: string;
  title: string;
  description: string;
  type: 'meeting' | 'workshop' | 'competition' | 'social' | 'project-showcase';
  startDate: Date;
  endDate: Date;
  location: string; // 'virtual', 'in-person', or specific location
  maxAttendees?: number;
  attendees: string[];
  createdBy: string;
  createdAt: Date;
  requirements?: string[];
  materials?: string[];
  meetingLink?: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

export interface ClubProject {
  id: string;
  clubId: string;
  title: string;
  description: string;
  objectives: string[];
  timeline: {
    startDate: Date;
    endDate: Date;
    milestones: {
      title: string;
      description: string;
      dueDate: Date;
      completed: boolean;
    }[];
  };
  team: {
    leaderId: string;
    members: string[];
    roles: Record<string, string>; // userId -> role
  };
  resources: {
    documents: string[];
    links: string[];
    tools: string[];
  };
  status: 'planning' | 'active' | 'review' | 'completed' | 'cancelled';
  visibility: 'public' | 'club-only' | 'team-only';
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClubInvitation {
  id: string;
  clubId: string;
  clubName: string;
  invitedBy: string;
  invitedByName: string;
  invitedUser: string;
  invitedEmail: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: Date;
  expiresAt: Date;
}

export interface ClubCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  subcategories?: string[];
  popularTags: string[];
}

export const CLUB_CATEGORIES: ClubCategory[] = [
  {
    id: 'music-performance',
    name: 'Music & Performance',
    description: 'Musical instruments, vocals, composition, and performance arts',
    icon: '🎵',
    color: 'purple',
    subcategories: ['Classical', 'Jazz', 'Rock', 'Electronic', 'Folk', 'World Music'],
    popularTags: ['piano', 'guitar', 'vocals', 'composition', 'performance', 'recording']
  },
  {
    id: 'science-technology',
    name: 'Science & Technology',
    description: 'STEM fields, research, programming, and innovation',
    icon: '🔬',
    color: 'blue',
    subcategories: ['Computer Science', 'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Engineering'],
    popularTags: ['programming', 'AI', 'research', 'robotics', 'data-science', 'innovation']
  },
  {
    id: 'art-design',
    name: 'Art & Design',
    description: 'Visual arts, graphic design, digital art, and creative expression',
    icon: '🎨',
    color: 'pink',
    subcategories: ['Digital Art', 'Traditional Art', 'Graphic Design', 'Animation', '3D Modeling', 'Photography'],
    popularTags: ['digital-art', 'design', 'illustration', 'animation', 'creativity', 'visual']
  },
  {
    id: 'sports-athletics',
    name: 'Sports & Athletics',
    description: 'Physical fitness, team sports, individual sports, and wellness',
    icon: '⚽',
    color: 'green',
    subcategories: ['Team Sports', 'Individual Sports', 'Fitness', 'Martial Arts', 'Outdoor Activities', 'E-Sports'],
    popularTags: ['fitness', 'teamwork', 'competition', 'health', 'training', 'athletics']
  },
  {
    id: 'literature-writing',
    name: 'Literature & Writing',
    description: 'Creative writing, poetry, journalism, and literary analysis',
    icon: '📚',
    color: 'amber',
    subcategories: ['Creative Writing', 'Poetry', 'Journalism', 'Academic Writing', 'Screenwriting', 'Blogging'],
    popularTags: ['writing', 'poetry', 'storytelling', 'journalism', 'literature', 'publishing']
  },
  {
    id: 'environmental-sustainability',
    name: 'Environmental & Sustainability',
    description: 'Environmental protection, sustainability, and climate action',
    icon: '🌱',
    color: 'emerald',
    subcategories: ['Climate Action', 'Conservation', 'Renewable Energy', 'Sustainable Living', 'Environmental Science'],
    popularTags: ['environment', 'sustainability', 'climate', 'conservation', 'green-tech', 'ecology']
  },
  {
    id: 'debate-public-speaking',
    name: 'Debate & Public Speaking',
    description: 'Argumentation, public speaking, and communication skills',
    icon: '🎤',
    color: 'red',
    subcategories: ['Formal Debate', 'Model UN', 'Public Speaking', 'Rhetoric', 'Communication'],
    popularTags: ['debate', 'public-speaking', 'argumentation', 'communication', 'rhetoric', 'presentation']
  },
  {
    id: 'gaming-esports',
    name: 'Gaming & E-sports',
    description: 'Video games, competitive gaming, and game development',
    icon: '🎮',
    color: 'violet',
    subcategories: ['Competitive Gaming', 'Game Development', 'Streaming', 'Game Design', 'Virtual Reality'],
    popularTags: ['gaming', 'esports', 'game-dev', 'streaming', 'competition', 'virtual-reality']
  },
  {
    id: 'cultural-language',
    name: 'Cultural & Language',
    description: 'Languages, cultural exchange, and international studies',
    icon: '🌍',
    color: 'cyan',
    subcategories: ['Language Learning', 'Cultural Exchange', 'International Studies', 'Translation', 'Linguistics'],
    popularTags: ['languages', 'culture', 'international', 'exchange', 'linguistics', 'translation']
  },
  {
    id: 'community-service',
    name: 'Community Service',
    description: 'Volunteering, social impact, and community engagement',
    icon: '🤝',
    color: 'orange',
    subcategories: ['Volunteering', 'Social Impact', 'Fundraising', 'Community Outreach', 'Advocacy'],
    popularTags: ['volunteering', 'community', 'service', 'social-impact', 'charity', 'outreach']
  },
  {
    id: 'business-entrepreneurship',
    name: 'Business & Entrepreneurship',
    description: 'Business skills, entrepreneurship, and leadership development',
    icon: '💼',
    color: 'slate',
    subcategories: ['Entrepreneurship', 'Business Strategy', 'Marketing', 'Finance', 'Leadership', 'Innovation'],
    popularTags: ['business', 'entrepreneurship', 'startup', 'leadership', 'marketing', 'finance']
  },
  {
    id: 'photography-media',
    name: 'Photography & Media',
    description: 'Photography, videography, media production, and journalism',
    icon: '📸',
    color: 'indigo',
    subcategories: ['Photography', 'Videography', 'Media Production', 'Journalism', 'Documentary', 'Social Media'],
    popularTags: ['photography', 'videography', 'media', 'journalism', 'documentary', 'content-creation']
  }
];