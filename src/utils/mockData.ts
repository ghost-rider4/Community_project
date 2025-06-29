import { Student, Mentor, Project, Opportunity, Club, Challenge, Achievement, Streak, LeaderboardEntry, TierBenefit, LevelReward } from '../types';

export const mockStudent: Student = {
  id: '1',
  name: 'Alex Chen',
  email: 'alex.chen@email.com',
  age: 16,
  location: 'San Francisco, CA',
  role: 'student',
  talents: [
    { id: '1', name: 'Piano', category: 'Music', subcategory: 'Classical', level: 'Intermediate' },
    { id: '2', name: 'Physics', category: 'Science', subcategory: 'Quantum', level: 'Advanced' }
  ],
  skillLevel: 'Intermediate',
  points: 2450,
  tier: 'Silver',
  clubs: ['piano-masters', 'physics-explorers'],
  psychometricCompleted: true,
  verificationStatus: 'verified',
  joinedAt: new Date('2024-01-15'),
  level: 8,
  experience: 1250,
  nextLevelExp: 1500,
  achievements: [
    {
      id: 'ach1',
      title: 'First Steps',
      description: 'Complete your first project upload',
      icon: '🎯',
      category: 'milestone',
      rarity: 'common',
      points: 50,
      unlockedAt: new Date('2024-01-16')
    },
    {
      id: 'ach2',
      title: 'Social Butterfly',
      description: 'Join 3 different clubs',
      icon: '🦋',
      category: 'social',
      rarity: 'rare',
      points: 100,
      unlockedAt: new Date('2024-01-20')
    },
    {
      id: 'ach3',
      title: 'Master Musician',
      description: 'Reach advanced level in any musical talent',
      icon: '🎼',
      category: 'learning',
      rarity: 'epic',
      points: 250,
      progress: 75,
      maxProgress: 100
    },
    {
      id: 'ach4',
      title: 'Legendary Creator',
      description: 'Have a project featured on the homepage',
      icon: '👑',
      category: 'creative',
      rarity: 'legendary',
      points: 500
    },
    {
      id: 'ach5',
      title: 'Mentor\'s Pride',
      description: 'Receive 5-star rating from a mentor',
      icon: '⭐',
      category: 'learning',
      rarity: 'rare',
      points: 150,
      unlockedAt: new Date('2024-02-01')
    },
    {
      id: 'ach6',
      title: 'Streak Master',
      description: 'Maintain a 30-day login streak',
      icon: '🔥',
      category: 'milestone',
      rarity: 'epic',
      points: 200,
      progress: 23,
      maxProgress: 30
    }
  ],
  streaks: [
    {
      id: 'streak1',
      type: 'daily_login',
      count: 23,
      lastUpdated: new Date(),
      maxStreak: 45
    },
    {
      id: 'streak2',
      type: 'project_upload',
      count: 5,
      lastUpdated: new Date(),
      maxStreak: 8
    },
    {
      id: 'streak3',
      type: 'challenge_complete',
      count: 12,
      lastUpdated: new Date(),
      maxStreak: 15
    },
    {
      id: 'streak4',
      type: 'mentor_session',
      count: 3,
      lastUpdated: new Date(),
      maxStreak: 7
    }
  ]
};

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: '1',
    name: 'Emma Rodriguez',
    points: 4850,
    tier: 'Diamond',
    level: 15,
    rank: 1,
    talents: ['AI/ML', 'Mathematics'],
    weeklyGain: 320
  },
  {
    id: '2',
    name: 'Kai Nakamura',
    points: 4200,
    tier: 'Gold',
    level: 13,
    rank: 2,
    talents: ['Music', 'Composition'],
    weeklyGain: 280
  },
  {
    id: '3',
    name: 'Zara Ahmed',
    points: 3950,
    tier: 'Gold',
    level: 12,
    rank: 3,
    talents: ['Digital Art', 'Animation'],
    weeklyGain: 245
  },
  {
    id: '4',
    name: 'Lucas Silva',
    points: 3720,
    tier: 'Gold',
    level: 11,
    rank: 4,
    talents: ['Physics', 'Engineering'],
    weeklyGain: 190
  },
  {
    id: '5',
    name: 'Aria Johnson',
    points: 3500,
    tier: 'Silver',
    level: 10,
    rank: 5,
    talents: ['Literature', 'Creative Writing'],
    weeklyGain: 165
  },
  {
    id: '6',
    name: 'Dev Patel',
    points: 3280,
    tier: 'Silver',
    level: 10,
    rank: 6,
    talents: ['Programming', 'Robotics'],
    weeklyGain: 155
  },
  {
    id: '7',
    name: 'Sophie Chen',
    points: 3100,
    tier: 'Silver',
    level: 9,
    rank: 7,
    talents: ['Chemistry', 'Research'],
    weeklyGain: 140
  },
  {
    id: '8',
    name: 'Marcus Thompson',
    points: 2950,
    tier: 'Silver',
    level: 9,
    rank: 8,
    talents: ['Photography', 'Visual Arts'],
    weeklyGain: 135
  },
  {
    id: '9',
    name: 'Ava Williams',
    points: 2800,
    tier: 'Silver',
    level: 8,
    rank: 9,
    talents: ['Dance', 'Choreography'],
    weeklyGain: 120
  },
  {
    id: '10',
    name: 'Ryan O\'Connor',
    points: 2650,
    tier: 'Silver',
    level: 8,
    rank: 10,
    talents: ['Biology', 'Environmental Science'],
    weeklyGain: 110
  }
];

export const mockAchievements: Achievement[] = [
  {
    id: 'ach1',
    title: 'First Steps',
    description: 'Complete your first project upload',
    icon: '🎯',
    category: 'milestone',
    rarity: 'common',
    points: 50,
    unlockedAt: new Date('2024-01-16')
  },
  {
    id: 'ach2',
    title: 'Social Butterfly',
    description: 'Join 3 different clubs',
    icon: '🦋',
    category: 'social',
    rarity: 'rare',
    points: 100,
    unlockedAt: new Date('2024-01-20')
  },
  {
    id: 'ach3',
    title: 'Master Musician',
    description: 'Reach advanced level in any musical talent',
    icon: '🎼',
    category: 'learning',
    rarity: 'epic',
    points: 250,
    progress: 75,
    maxProgress: 100
  },
  {
    id: 'ach4',
    title: 'Legendary Creator',
    description: 'Have a project featured on the homepage',
    icon: '👑',
    category: 'creative',
    rarity: 'legendary',
    points: 500
  },
  {
    id: 'ach5',
    title: 'Mentor\'s Pride',
    description: 'Receive 5-star rating from a mentor',
    icon: '⭐',
    category: 'learning',
    rarity: 'rare',
    points: 150,
    unlockedAt: new Date('2024-02-01')
  },
  {
    id: 'ach6',
    title: 'Streak Master',
    description: 'Maintain a 30-day login streak',
    icon: '🔥',
    category: 'milestone',
    rarity: 'epic',
    points: 200,
    progress: 23,
    maxProgress: 30
  },
  {
    id: 'ach7',
    title: 'Community Leader',
    description: 'Help 10 other students with their projects',
    icon: '🤝',
    category: 'leadership',
    rarity: 'epic',
    points: 300,
    progress: 7,
    maxProgress: 10
  },
  {
    id: 'ach8',
    title: 'Innovation Pioneer',
    description: 'Create a project using cutting-edge technology',
    icon: '🚀',
    category: 'creative',
    rarity: 'legendary',
    points: 750
  },
  {
    id: 'ach9',
    title: 'Perfect Score',
    description: 'Score 100% on 5 different challenges',
    icon: '💯',
    category: 'learning',
    rarity: 'rare',
    points: 200,
    progress: 3,
    maxProgress: 5
  }
];

export const mockTierBenefits: TierBenefit[] = [
  // Bronze Benefits
  {
    id: 'bronze1',
    title: 'Basic Project Uploads',
    description: 'Upload up to 5 projects per month',
    tier: 'Bronze',
    icon: '📁'
  },
  {
    id: 'bronze2',
    title: 'Community Access',
    description: 'Join up to 3 clubs and participate in discussions',
    tier: 'Bronze',
    icon: '👥'
  },
  
  // Silver Benefits
  {
    id: 'silver1',
    title: 'Enhanced Uploads',
    description: 'Upload up to 15 projects per month with priority processing',
    tier: 'Silver',
    icon: '📤'
  },
  {
    id: 'silver2',
    title: 'Mentor Matching',
    description: 'Get matched with verified mentors in your field',
    tier: 'Silver',
    icon: '🎯'
  },
  {
    id: 'silver3',
    title: 'Advanced Analytics',
    description: 'Detailed insights into your learning progress',
    tier: 'Silver',
    icon: '📊'
  },
  {
    id: 'silver4',
    title: 'Priority Support',
    description: 'Faster response times for help requests',
    tier: 'Silver',
    icon: '⚡'
  },
  
  // Gold Benefits
  {
    id: 'gold1',
    title: 'Unlimited Projects',
    description: 'Upload unlimited projects with premium features',
    tier: 'Gold',
    icon: '∞'
  },
  {
    id: 'gold2',
    title: 'Expert Mentorship',
    description: 'Access to industry experts and thought leaders',
    tier: 'Gold',
    icon: '🌟'
  },
  {
    id: 'gold3',
    title: 'Scholarship Opportunities',
    description: 'Exclusive access to scholarships and grants',
    tier: 'Gold',
    icon: '🎓'
  },
  {
    id: 'gold4',
    title: 'Portfolio Showcase',
    description: 'Featured placement in our talent showcase',
    tier: 'Gold',
    icon: '🏆'
  },
  
  // Diamond Benefits
  {
    id: 'diamond1',
    title: 'VIP Experience',
    description: 'White-glove service and personalized attention',
    tier: 'Diamond',
    icon: '💎'
  },
  {
    id: 'diamond2',
    title: 'Industry Connections',
    description: 'Direct introductions to industry leaders',
    tier: 'Diamond',
    icon: '🤝'
  },
  {
    id: 'diamond3',
    title: 'Exclusive Events',
    description: 'Invitation-only masterclasses and workshops',
    tier: 'Diamond',
    icon: '🎪'
  },
  {
    id: 'diamond4',
    title: 'Custom Opportunities',
    description: 'Personalized internships and project opportunities',
    tier: 'Diamond',
    icon: '🎯'
  }
];

export const mockLevelRewards: LevelReward[] = [
  {
    level: 5,
    points: 500,
    title: 'Rising Star',
    description: 'You\'re making great progress!',
    rewards: ['Custom profile badge', 'Priority in clubs', '50 bonus points']
  },
  {
    level: 9,
    points: 1500,
    title: 'Dedicated Learner',
    description: 'Your commitment is showing!',
    rewards: ['Advanced analytics access', 'Mentor recommendation priority', 'Exclusive challenge access', '100 bonus points']
  },
  {
    level: 10,
    points: 2000,
    title: 'Expert in Training',
    description: 'You\'re becoming a true expert!',
    rewards: ['Silver tier upgrade', 'Portfolio review session', 'Featured project opportunity', '200 bonus points']
  },
  {
    level: 15,
    points: 4000,
    title: 'Master Achiever',
    description: 'Your skills are truly impressive!',
    rewards: ['Gold tier upgrade', 'Industry mentor access', 'Scholarship eligibility', 'Custom achievement badge', '500 bonus points']
  },
  {
    level: 20,
    points: 8000,
    title: 'Legendary Talent',
    description: 'You\'ve reached legendary status!',
    rewards: ['Diamond tier upgrade', 'VIP support access', 'Industry showcase feature', 'Personal brand consultation', '1000 bonus points']
  }
];

export const mockMentors: Mentor[] = [
  {
    id: 'm1',
    name: 'Dr. Sarah Martinez',
    email: 'sarah.martinez@university.edu',
    age: 34,
    location: 'Boston, MA',
    role: 'mentor',
    expertise: ['Physics', 'Mathematics', 'Research'],
    experience: '10+ years in Quantum Physics research at MIT',
    rating: 4.9,
    studentsCount: 23,
    availability: true,
    joinedAt: new Date('2023-08-01')
  },
  {
    id: 'm2',
    name: 'Marcus Thompson',
    email: 'marcus.thompson@conservatory.edu',
    age: 42,
    location: 'New York, NY',
    role: 'mentor',
    expertise: ['Piano', 'Music Theory', 'Composition'],
    experience: 'Concert pianist and music educator with 15+ years experience',
    rating: 4.8,
    studentsCount: 18,
    availability: true,
    joinedAt: new Date('2023-09-15')
  },
  {
    id: 'm3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@techcorp.com',
    age: 29,
    location: 'Seattle, WA',
    role: 'mentor',
    expertise: ['AI/ML', 'Programming', 'Data Science'],
    experience: 'Senior AI Engineer at leading tech company',
    rating: 4.9,
    studentsCount: 31,
    availability: true,
    joinedAt: new Date('2023-07-20')
  },
  {
    id: 'm4',
    name: 'Isabella Chen',
    email: 'isabella.chen@artinstitute.edu',
    age: 38,
    location: 'Los Angeles, CA',
    role: 'mentor',
    expertise: ['Digital Art', 'Animation', 'Creative Direction'],
    experience: 'Award-winning digital artist and creative director',
    rating: 4.7,
    studentsCount: 15,
    availability: false,
    joinedAt: new Date('2023-10-05')
  }
];

export const mockProjects: Project[] = [
  {
    id: 'p1',
    title: 'Chopin Nocturne in E-flat major',
    description: 'My interpretation of one of Chopin\'s most beautiful nocturnes. Focused on bringing out the emotional depth through dynamic expression and careful attention to phrasing. This piece has been a journey of technical and emotional growth for me.',
    authorId: '1',
    authorName: 'Alex Chen',
    talent: 'Piano',
    mediaUrl: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg',
    mediaType: 'image',
    likes: 156,
    comments: [
      {
        id: 'c1',
        authorId: 'm2',
        authorName: 'Marcus Thompson',
        content: 'Beautiful interpretation! Your rubato in the middle section really brings out the emotional core of the piece.',
        createdAt: new Date('2024-01-21')
      }
    ],
    tags: ['classical', 'chopin', 'nocturne', 'piano'],
    createdAt: new Date('2024-01-20'),
    verified: true
  },
  {
    id: 'p2',
    title: 'Quantum Entanglement Visualization',
    description: 'An interactive 3D model showing quantum entanglement between particles. Built using Three.js and physics simulations to help visualize this complex quantum phenomenon. The model demonstrates how measurement of one particle instantly affects its entangled partner.',
    authorId: '2',
    authorName: 'Maya Patel',
    talent: 'Physics',
    mediaUrl: 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg',
    mediaType: 'image',
    likes: 203,
    comments: [
      {
        id: 'c2',
        authorId: 'm1',
        authorName: 'Dr. Sarah Martinez',
        content: 'Excellent work! This visualization really helps make quantum entanglement more intuitive. Have you considered adding spin states?',
        createdAt: new Date('2024-01-19')
      }
    ],
    tags: ['quantum', 'physics', 'visualization', 'threejs'],
    createdAt: new Date('2024-01-18'),
    verified: true
  },
  {
    id: 'p3',
    title: 'AI-Generated Abstract Art Series',
    description: 'Exploring the intersection of artificial intelligence and creative expression through a series of abstract artworks generated using custom neural networks. Each piece represents different emotional states and color theories.',
    authorId: '3',
    authorName: 'Jordan Kim',
    talent: 'Digital Art',
    mediaUrl: 'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg',
    mediaType: 'image',
    likes: 89,
    comments: [],
    tags: ['ai', 'art', 'neural-networks', 'abstract'],
    createdAt: new Date('2024-01-17'),
    verified: true
  },
  {
    id: 'p4',
    title: 'Sustainable City Design Model',
    description: 'A comprehensive urban planning project focusing on sustainable development, renewable energy integration, and green spaces. This 3D model showcases innovative solutions for future city planning.',
    authorId: '4',
    authorName: 'Sophia Rodriguez',
    talent: 'Architecture',
    mediaUrl: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg',
    mediaType: 'image',
    likes: 134,
    comments: [],
    tags: ['architecture', 'sustainability', 'urban-planning', '3d-modeling'],
    createdAt: new Date('2024-01-16'),
    verified: true
  }
];

export const mockOpportunities: Opportunity[] = [
  {
    id: 'o1',
    title: 'Summer Research Internship',
    company: 'MIT Physics Department',
    type: 'internship',
    description: 'Join our quantum computing research team for a 10-week summer program. Work alongside graduate students and faculty on cutting-edge quantum algorithms.',
    requirements: ['Advanced Physics knowledge', 'Programming skills (Python/C++)', 'Research experience preferred'],
    location: 'Cambridge, MA',
    skillLevel: ['Advanced', 'Expert'],
    talents: ['Physics', 'Mathematics'],
    deadline: new Date('2024-03-15'),
    isPaid: true
  },
  {
    id: 'o2',
    title: 'Young Composers Competition',
    company: 'National Music Foundation',
    type: 'project',
    description: 'Submit original compositions for a chance to have your work performed by a professional orchestra. Winners receive mentorship and performance opportunities.',
    requirements: ['Original composition', 'Score submission', 'Performance recording'],
    location: 'Virtual/Remote',
    skillLevel: ['Intermediate', 'Advanced', 'Expert'],
    talents: ['Music', 'Composition'],
    deadline: new Date('2024-04-30'),
    isPaid: false
  },
  {
    id: 'o3',
    title: 'Tech Startup Internship',
    company: 'InnovateTech Solutions',
    type: 'internship',
    description: 'Join our AI development team to work on machine learning projects that impact millions of users. Gain real-world experience in a fast-paced startup environment.',
    requirements: ['Programming skills', 'Machine Learning knowledge', 'Problem-solving abilities'],
    location: 'San Francisco, CA',
    skillLevel: ['Intermediate', 'Advanced'],
    talents: ['Technology', 'AI/ML'],
    deadline: new Date('2024-05-20'),
    isPaid: true
  }
];

export const mockClubs: Club[] = [
  {
    id: 'c1',
    name: 'Piano Masters',
    talent: 'Piano',
    memberCount: 248,
    description: 'Connect with fellow pianists, share performances, and learn together through masterclasses and peer feedback.',
    recentActivity: 'Maya shared a new Rachmaninoff performance'
  },
  {
    id: 'c2',
    name: 'Physics Explorers',
    talent: 'Physics',
    memberCount: 189,
    description: 'Dive deep into the mysteries of the universe with like-minded physicists. Weekly discussions and problem-solving sessions.',
    recentActivity: 'New discussion: "Is time travel theoretically possible?"'
  },
  {
    id: 'c3',
    name: 'Digital Artists United',
    talent: 'Digital Art',
    memberCount: 156,
    description: 'A creative community for digital artists to share techniques, get feedback, and collaborate on projects.',
    recentActivity: 'Jordan posted a new AI art tutorial'
  },
  {
    id: 'c4',
    name: 'Code Creators',
    talent: 'Programming',
    memberCount: 312,
    description: 'From beginners to experts, we code together, share projects, and help each other grow as developers.',
    recentActivity: 'Weekly coding challenge: Build a weather app'
  },
  {
    id: 'c5',
    name: 'Math Olympians',
    talent: 'Mathematics',
    memberCount: 94,
    description: 'Prepare for competitions, solve challenging problems, and explore advanced mathematical concepts together.',
    recentActivity: 'New problem set: Advanced Calculus challenges'
  },
  {
    id: 'c6',
    name: 'Creative Writers',
    talent: 'Writing',
    memberCount: 203,
    description: 'Share your stories, poems, and creative works. Get constructive feedback and participate in writing challenges.',
    recentActivity: 'Monthly theme: "Stories from the Future"'
  }
];

export const mockChallenges: Challenge[] = [
  {
    id: 'ch1',
    title: 'Daily Scale Practice',
    description: 'Practice major scales for 15 minutes and record your progress',
    talent: 'Piano',
    difficulty: 'Beginner',
    points: 10,
    deadline: new Date(),
    participants: 47
  },
  {
    id: 'ch2',
    title: 'Quantum Mechanics Problem Set',
    description: 'Solve 5 advanced quantum mechanics problems involving wave functions',
    talent: 'Physics',
    difficulty: 'Advanced',
    points: 50,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    participants: 23
  },
  {
    id: 'ch3',
    title: 'Code a Mini Game',
    description: 'Create a simple game using any programming language of your choice',
    talent: 'Programming',
    difficulty: 'Intermediate',
    points: 30,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    participants: 89
  }
];