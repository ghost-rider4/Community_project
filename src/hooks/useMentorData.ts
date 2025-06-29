import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

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
  mentorId?: string;
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

export const useMentorData = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<MentorSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== 'mentor') {
      setIsLoading(false);
      return;
    }

    const loadMentorData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load assigned students
        const studentsQuery = query(
          collection(db, 'users'),
          where('role', '==', 'student'),
          where('mentorId', '==', user.id)
        );

        const studentsSnapshot = await getDocs(studentsQuery);
        const studentsData = studentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          lastActive: doc.data().lastActive?.toDate() || new Date(),
          progress: Math.floor(Math.random() * 100) // Mock progress for now
        })) as Student[];

        setStudents(studentsData);

        // Load mentor sessions
        const sessionsQuery = query(
          collection(db, 'mentorSessions'),
          where('mentorId', '==', user.id)
        );

        const sessionsSnapshot = await getDocs(sessionsQuery);
        const sessionsData = sessionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate() || new Date()
        })) as MentorSession[];

        setSessions(sessionsData);

      } catch (err) {
        console.error('Error loading mentor data:', err);
        setError('Failed to load mentor data');
      } finally {
        setIsLoading(false);
      }
    };

    loadMentorData();

    // Set up real-time listeners for updates
    const unsubscribeStudents = onSnapshot(
      query(
        collection(db, 'users'),
        where('role', '==', 'student'),
        where('mentorId', '==', user.id)
      ),
      (snapshot) => {
        const updatedStudents = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          lastActive: doc.data().lastActive?.toDate() || new Date(),
          progress: Math.floor(Math.random() * 100)
        })) as Student[];
        setStudents(updatedStudents);
      },
      (error) => {
        console.error('Error in students listener:', error);
      }
    );

    const unsubscribeSessions = onSnapshot(
      query(
        collection(db, 'mentorSessions'),
        where('mentorId', '==', user.id)
      ),
      (snapshot) => {
        const updatedSessions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate() || new Date()
        })) as MentorSession[];
        setSessions(updatedSessions);
      },
      (error) => {
        console.error('Error in sessions listener:', error);
      }
    );

    return () => {
      unsubscribeStudents();
      unsubscribeSessions();
    };
  }, [user]);

  const assignStudent = async (studentId: string) => {
    if (!user) return;

    try {
      // Implementation for assigning a student to this mentor
      // This would update the student's mentorId field
    } catch (error) {
      console.error('Error assigning student:', error);
      throw error;
    }
  };

  const scheduleSession = async (sessionData: Partial<MentorSession>) => {
    if (!user) return;

    try {
      // Implementation for scheduling a new session
      // This would create a new document in the mentorSessions collection
    } catch (error) {
      console.error('Error scheduling session:', error);
      throw error;
    }
  };

  const updateSessionNotes = async (sessionId: string, notes: string) => {
    try {
      // Implementation for updating session notes
    } catch (error) {
      console.error('Error updating session notes:', error);
      throw error;
    }
  };

  return {
    students,
    sessions,
    isLoading,
    error,
    assignStudent,
    scheduleSession,
    updateSessionNotes
  };
};