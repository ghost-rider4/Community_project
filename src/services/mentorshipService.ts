import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  onSnapshot,
  orderBy,
  Timestamp,
  DocumentData,
  QuerySnapshot,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Mentor, ChatRequest, MentorshipConnection } from '../types';

// Fetch all available mentors
export const fetchMentors = async (): Promise<Mentor[]> => {
  try {
    // First, get all users with role 'mentor'
    const mentorsQuery = query(
      collection(db, 'users'),
      where('role', '==', 'mentor')
    );
    
    const snapshot = await getDocs(mentorsQuery);
    let mentors = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data()
    })) as Mentor[];
    
    console.log('Found mentors:', mentors.length, mentors);
    
    // If no mentors found, create sample mentors
    if (mentors.length === 0) {
      console.log('No mentors found, creating sample mentors...');
      await createSampleMentors();
      
      // Fetch mentors again after creating samples
      const newSnapshot = await getDocs(mentorsQuery);
      mentors = newSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data()
      })) as Mentor[];
      
      console.log('After creating samples, found mentors:', mentors.length);
    }
    
    // Filter for available mentors (availability is true or undefined, meaning default available)
    const availableMentors = mentors.filter(mentor => 
      mentor.availability !== false
    );
    
    return availableMentors;
  } catch (error) {
    console.error('Error fetching mentors:', error);
    throw error;
  }
};

// Send chat request from student to mentor
export const sendChatRequest = async (
  studentId: string,
  studentName: string,
  mentorId: string,
  mentorName: string,
  message: string,
  studentAvatar?: string
): Promise<void> => {
  try {
    // Check if request already exists
    const existingRequestQuery = query(
      collection(db, 'chatRequests'),
      where('studentId', '==', studentId),
      where('mentorId', '==', mentorId),
      where('status', '==', 'pending')
    );
    
    const existingRequests = await getDocs(existingRequestQuery);
    if (!existingRequests.empty) {
      throw new Error('A chat request to this mentor is already pending');
    }

    const chatRequest: Omit<ChatRequest, 'id'> = {
      studentId,
      studentName,
      studentAvatar,
      mentorId,
      mentorName,
      status: 'pending',
      message,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await addDoc(collection(db, 'chatRequests'), chatRequest);
  } catch (error) {
    console.error('Error sending chat request:', error);
    throw error;
  }
};

// Get chat requests for a mentor
export const getMentorChatRequests = (
  mentorId: string,
  callback: (requests: ChatRequest[]) => void
) => {
  const requestsQuery = query(
    collection(db, 'chatRequests'),
    where('mentorId', '==', mentorId),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(requestsQuery, (snapshot: QuerySnapshot<DocumentData>) => {
    const requests = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as ChatRequest[];
    callback(requests);
  });
};

// Accept chat request and create mentorship connection
export const acceptChatRequest = async (
  requestId: string,
  chatClient: any
): Promise<string> => {
  try {
    const requestDoc = await getDocs(query(
      collection(db, 'chatRequests'),
      where('__name__', '==', requestId)
    ));

    if (requestDoc.empty) {
      throw new Error('Chat request not found');
    }

    const request = requestDoc.docs[0].data() as ChatRequest;
    
    // Create Stream Chat channel
    const channelId = `mentor-${request.mentorId}-student-${request.studentId}`;
    const channel = chatClient.channel('messaging', channelId, {
      members: [request.mentorId, request.studentId],
      name: `${request.mentorName} & ${request.studentName}`,
      created_by_id: request.mentorId
    });
    
    await channel.create();

    // Create mentorship connection
    const mentorshipConnection: Omit<MentorshipConnection, 'id'> = {
      studentId: request.studentId,
      mentorId: request.mentorId,
      status: 'active',
      chatChannelId: channelId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await addDoc(collection(db, 'mentorshipConnections'), mentorshipConnection);

    // Update request status
    await updateDoc(doc(db, 'chatRequests', requestId), {
      status: 'accepted',
      updatedAt: new Date()
    });

    return channelId;
  } catch (error) {
    console.error('Error accepting chat request:', error);
    throw error;
  }
};

// Decline chat request
export const declineChatRequest = async (requestId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'chatRequests', requestId), {
      status: 'declined',
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error declining chat request:', error);
    throw error;
  }
};

// Get student's mentorship connections
export const getStudentMentorships = (
  studentId: string,
  callback: (connections: MentorshipConnection[]) => void
) => {
  const connectionsQuery = query(
    collection(db, 'mentorshipConnections'),
    where('studentId', '==', studentId),
    where('status', '==', 'active')
  );

  return onSnapshot(connectionsQuery, (snapshot: QuerySnapshot<DocumentData>) => {
    const connections = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as MentorshipConnection[];
    callback(connections);
  });
};

// Get mentor's mentorship connections
export const getMentorMentorships = (
  mentorId: string,
  callback: (connections: MentorshipConnection[]) => void
) => {
  const connectionsQuery = query(
    collection(db, 'mentorshipConnections'),
    where('mentorId', '==', mentorId),
    where('status', '==', 'active')
  );

  return onSnapshot(connectionsQuery, (snapshot: QuerySnapshot<DocumentData>) => {
    const connections = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as MentorshipConnection[];
    callback(connections);
  });
};

// Create sample mentors for testing (run once in development)
export const createSampleMentors = async (): Promise<void> => {
  const sampleMentors = [
    {
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@example.com',
      role: 'mentor',
      expertise: ['Piano', 'Music Theory', 'Classical Music'],
      experience: '15 years of professional piano instruction and performance',
      rating: 4.9,
      studentsCount: 24,
      availability: true,
      location: 'New York, NY',
      bio: 'Professional pianist and educator with expertise in classical and contemporary music.',
      education: 'PhD in Music Performance, Juilliard School',
      specializations: ['Classical Piano', 'Music Theory', 'Performance Techniques'],
      maxStudents: 30,
      verified: true,
      createdAt: new Date(),
      onboardingCompleted: true,
      profileSetup: true
    },
    {
      name: 'Prof. Michael Chen',
      email: 'michael.chen@example.com',
      role: 'mentor',
      expertise: ['Computer Science', 'AI', 'Machine Learning'],
      experience: '12 years in software engineering and AI research',
      rating: 4.8,
      studentsCount: 18,
      availability: true,
      location: 'San Francisco, CA',
      bio: 'AI researcher and software engineer helping students navigate the world of technology.',
      education: 'PhD in Computer Science, Stanford University',
      specializations: ['Artificial Intelligence', 'Software Engineering', 'Data Science'],
      maxStudents: 25,
      verified: true,
      createdAt: new Date(),
      onboardingCompleted: true,
      profileSetup: true
    },
    {
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@example.com',
      role: 'mentor',
      expertise: ['Biology', 'Research', 'Scientific Writing'],
      experience: '10 years in biomedical research and education',
      rating: 4.7,
      studentsCount: 15,
      availability: true,
      location: 'Boston, MA',
      bio: 'Biomedical researcher passionate about mentoring the next generation of scientists.',
      education: 'PhD in Biology, Harvard University',
      specializations: ['Cell Biology', 'Research Methods', 'Scientific Communication'],
      maxStudents: 20,
      verified: true,
      createdAt: new Date(),
      onboardingCompleted: true,
      profileSetup: true
    },
    {
      name: 'James Wilson',
      email: 'james.wilson@example.com',
      role: 'mentor',
      expertise: ['Photography', 'Digital Art', 'Visual Storytelling'],
      experience: '8 years as a professional photographer and visual artist',
      rating: 4.6,
      studentsCount: 22,
      availability: true,
      location: 'Los Angeles, CA',
      bio: 'Professional photographer specializing in portrait and landscape photography.',
      education: 'BFA in Photography, Art Center College of Design',
      specializations: ['Portrait Photography', 'Landscape Photography', 'Photo Editing'],
      maxStudents: 35,
      verified: true,
      createdAt: new Date(),
      onboardingCompleted: true,
      profileSetup: true
    },
    {
      name: 'Dr. Aisha Patel',
      email: 'aisha.patel@example.com',
      role: 'mentor',
      expertise: ['Mathematics', 'Physics', 'Engineering'],
      experience: '14 years in aerospace engineering and education',
      rating: 4.9,
      studentsCount: 19,
      availability: true,
      location: 'Houston, TX',
      bio: 'Aerospace engineer helping students excel in STEM fields.',
      education: 'PhD in Aerospace Engineering, MIT',
      specializations: ['Applied Mathematics', 'Physics', 'Engineering Design'],
      maxStudents: 25,
      verified: true,
      createdAt: new Date(),
      onboardingCompleted: true,
      profileSetup: true
    }
  ];

  try {
    console.log('Creating sample mentors...');
    
    for (const mentor of sampleMentors) {
      // Check if mentor already exists
      const existingMentorQuery = query(
        collection(db, 'users'),
        where('email', '==', mentor.email)
      );
      
      const existing = await getDocs(existingMentorQuery);
      
      if (existing.empty) {
        await addDoc(collection(db, 'users'), mentor);
        console.log(`Created mentor: ${mentor.name}`);
      } else {
        console.log(`Mentor already exists: ${mentor.name}`);
      }
    }
    
    console.log('Sample mentors creation completed');
  } catch (error) {
    console.error('Error creating sample mentors:', error);
    throw error;
  }
};