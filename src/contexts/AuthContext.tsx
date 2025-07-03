import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'mentor';
  photoURL?: string;
  createdAt: Date;
  onboardingCompleted?: boolean;
  profileSetup?: boolean;
  psychometricCompleted?: boolean;
  psychometricResults?: any;
  achievements: string[];
  talents: string[];
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'student' | 'mentor') => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: { name?: string; photoURL?: string }) => Promise<void>;
  updateUserData: (data: any) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);
        
        // Get user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              name: userData.name || firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              role: userData.role || 'student',
              photoURL: firebaseUser.photoURL || undefined,
              createdAt: userData.createdAt?.toDate() || new Date(),
              onboardingCompleted: userData.onboardingCompleted || false,
              profileSetup: userData.profileSetup || false,
              psychometricCompleted: userData.psychometricCompleted,
              psychometricResults: userData.psychometricResults,
              achievements: userData.achievements || [],
              talents: userData.talents || [],
            });
          } else {
            // Create user document if it doesn't exist
            const newUser = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              role: 'student' as const,
              photoURL: firebaseUser.photoURL || undefined,
              createdAt: new Date(),
              onboardingCompleted: false,
              profileSetup: false,
              psychometricCompleted: false,
              psychometricResults: null,
              achievements: [],
              talents: [],
            };
            
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              name: newUser.name,
              email: newUser.email,
              role: newUser.role,
              createdAt: newUser.createdAt,
              onboardingCompleted: false,
              profileSetup: false,
              psychometricCompleted: false,
              psychometricResults: null,
              achievements: [],
              talents: [],
            });
            
            setUser(newUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Fallback to Firebase user data
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            role: 'student',
            photoURL: firebaseUser.photoURL || undefined,
            createdAt: new Date(),
            onboardingCompleted: false,
            profileSetup: false,
            psychometricCompleted: false,
            psychometricResults: null,
            achievements: [],
            talents: [],
          });
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setIsLoading(false);
      throw new Error(getErrorMessage(error.code));
    }
  };

  const signup = async (name: string, email: string, password: string, role: 'student' | 'mentor') => {
    setIsLoading(true);
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update display name
      await updateProfile(firebaseUser, { displayName: name });

      // Create user document in Firestore
      const userData = {
        name,
        email,
        role,
        createdAt: new Date(),
        onboardingCompleted: false,
        profileSetup: false,
        psychometricCompleted: false,
        psychometricResults: null,
        // Initialize additional fields for students
        ...(role === 'student' && {
          talents: [],
          skillLevel: 'Beginner',
          points: 0,
          tier: 'Bronze',
          level: 1,
          experience: 0,
          nextLevelExp: 100,
          clubs: [],
          verificationStatus: 'pending',
          achievements: [],
          streaks: [],
          projects: []
        }),
        // Initialize additional fields for mentors
        ...(role === 'mentor' && {
          expertise: [],
          experience: '',
          rating: 0,
          studentsCount: 0,
          availability: true,
          bio: '',
          location: '',
          education: '',
          certifications: [],
          specializations: [],
          mentorshipAreas: [],
          preferredStudentLevel: [],
          maxStudents: 10,
          currentStudents: [],
          completedSessions: 0,
          verified: false
        })
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);

    } catch (error: any) {
      setIsLoading(false);
      throw new Error(getErrorMessage(error.code));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code));
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code));
    }
  };

  const updateUserProfile = async (data: { name?: string; photoURL?: string }) => {
    if (!firebaseUser) throw new Error('No user logged in');

    try {
      // Update Firebase profile
      await updateProfile(firebaseUser, data);

      // Update Firestore document
      await updateDoc(doc(db, 'users', firebaseUser.uid), data);

      // Update local user state
      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code));
    }
  };

  const updateUserData = async (data: any) => {
    if (!firebaseUser) throw new Error('No user logged in');

    try {
      // Update Firestore document
      await updateDoc(doc(db, 'users', firebaseUser.uid), data);

      // Update local user state
      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code));
    }
  };

  // Helper function to convert Firebase error codes to user-friendly messages
  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/invalid-credential':
        return 'Invalid email or password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      firebaseUser,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      resetPassword,
      updateUserProfile,
      updateUserData,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};