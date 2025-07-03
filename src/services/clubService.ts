import { db } from '../config/firebase';
import { collection, addDoc, updateDoc, doc, arrayUnion, onSnapshot, getDocs, deleteDoc, arrayRemove } from 'firebase/firestore';
import { Club } from '../types/clubs';

export const createClub = async (club: Omit<Club, 'id'>) => {
  return await addDoc(collection(db, 'clubs'), club);
};

export const joinClub = async (clubId: string, userId: string) => {
  const clubRef = doc(db, 'clubs', clubId);
  await updateDoc(clubRef, {
    members: arrayUnion(userId),
  });
};

export const leaveClub = async (clubId: string, userId: string) => {
  const clubRef = doc(db, 'clubs', clubId);
  await updateDoc(clubRef, {
    members: arrayRemove(userId),
  });
};

export const listenToClubs = (callback: (clubs: Club[]) => void) => {
  return onSnapshot(collection(db, 'clubs'), (snapshot) => {
    const clubs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Club[];
    callback(clubs);
  });
};

export const getClubs = async (): Promise<Club[]> => {
  const clubsQuery = collection(db, 'clubs');
  const snapshot = await getDocs(clubsQuery);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Club[];
};

export const deleteClub = async (clubId: string) => {
  await deleteDoc(doc(db, 'clubs', clubId));
}; 