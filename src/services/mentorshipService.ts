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
    const mentorsQuery = query(
      collection(db, 'users'),
      where('role', '==', 'mentor'),
      where('availability', '==', true)
    );
    
    const snapshot = await getDocs(mentorsQuery);
    return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data()
    })) as Mentor[];
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