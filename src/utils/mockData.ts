import { Student, Mentor, Project, Opportunity, Club, Challenge } from '../types';

export const mockStudent: Student = {
  id: '1',
  name: 'Alex Chen',
  email: 'alex.chen@email.com',
  age: 16,
  location: 'San Francisco, CA',
  role: 'student',
  talents: [
    { id: '1', name: 'Piano', category: 'Music', subcategory: 'Classical', level: 'intermediate' },
    { id: '2', name: 'Physics', category: 'Science', subcategory: 'Quantum', level: 'advanced' }
  ],
  skillLevel: 'intermediate',
  points: 2450,
  tier: 'silver',
  clubs: ['piano-masters', 'physics-explorers'],
  psychometricCompleted: true,
  verificationStatus: 'verified',
  joinedAt: new Date('2024-01-15')
};

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
    skillLevel: ['advanced', 'expert'],
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
    skillLevel: ['intermediate', 'advanced', 'expert'],
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
    skillLevel: ['intermediate', 'advanced'],
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
    difficulty: 'beginner',
    points: 10,
    deadline: new Date(),
    participants: 47
  },
  {
    id: 'ch2',
    title: 'Quantum Mechanics Problem Set',
    description: 'Solve 5 advanced quantum mechanics problems involving wave functions',
    talent: 'Physics',
    difficulty: 'advanced',
    points: 50,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    participants: 23
  },
  {
    id: 'ch3',
    title: 'Code a Mini Game',
    description: 'Create a simple game using any programming language of your choice',
    talent: 'Programming',
    difficulty: 'intermediate',
    points: 30,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    participants: 89
  }
];