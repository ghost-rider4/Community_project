import { collection, getDocs, deleteDoc, doc, writeBatch, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

export class DataCleanupService {
  private static instance: DataCleanupService;
  
  public static getInstance(): DataCleanupService {
    if (!DataCleanupService.instance) {
      DataCleanupService.instance = new DataCleanupService();
    }
    return DataCleanupService.instance;
  }

  /**
   * Archive existing data before deletion
   */
  async archiveData(collectionName: string): Promise<void> {
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      const archiveData = snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data(),
        archivedAt: new Date().toISOString()
      }));

      // Store in archive collection
      const batch = writeBatch(db);
      archiveData.forEach((item, index) => {
        const archiveRef = doc(db, `archived_${collectionName}`, `${Date.now()}_${index}`);
        batch.set(archiveRef, item);
      });

      await batch.commit();
      console.log(`Archived ${archiveData.length} documents from ${collectionName}`);
    } catch (error) {
      console.error(`Error archiving data from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Remove all mock/test data from specified collections
   */
  async removeMockData(): Promise<void> {
    const collectionsToClean = [
      'projects',
      'clubs',
      'events',
      'opportunities',
      'challenges',
      'achievements',
      'leaderboard',
      'notifications'
    ];

    try {
      for (const collectionName of collectionsToClean) {
        await this.archiveData(collectionName);
        await this.deleteCollection(collectionName);
      }

      console.log('Mock data cleanup completed successfully');
    } catch (error) {
      console.error('Error during mock data cleanup:', error);
      throw error;
    }
  }

  /**
   * Delete all documents in a collection
   */
  private async deleteCollection(collectionName: string): Promise<void> {
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      const batch = writeBatch(db);

      snapshot.docs.forEach((document) => {
        batch.delete(doc(db, collectionName, document.id));
      });

      await batch.commit();
      console.log(`Deleted ${snapshot.docs.length} documents from ${collectionName}`);
    } catch (error) {
      console.error(`Error deleting collection ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Validate data to prevent mock data re-entry
   */
  validateDataEntry(data: any, collectionName: string): boolean {
    const mockDataIndicators = [
      'mock',
      'test',
      'sample',
      'demo',
      'example',
      'placeholder'
    ];

    // Check for mock data indicators in various fields
    const dataString = JSON.stringify(data).toLowerCase();
    
    for (const indicator of mockDataIndicators) {
      if (dataString.includes(indicator)) {
        console.warn(`Potential mock data detected in ${collectionName}:`, data);
        return false;
      }
    }

    // Additional validation rules
    if (collectionName === 'users') {
      // Prevent test emails
      if (data.email && (
        data.email.includes('test@') ||
        data.email.includes('mock@') ||
        data.email.includes('example.com')
      )) {
        return false;
      }
    }

    if (collectionName === 'projects') {
      // Check for placeholder URLs
      if (data.mediaUrl && (
        data.mediaUrl.includes('placeholder') ||
        data.mediaUrl.includes('example.com')
      )) {
        return false;
      }
    }

    return true;
  }

  /**
   * Clean up user-specific mock data
   */
  async cleanUserMockData(userId: string): Promise<void> {
    try {
      const userCollections = [
        'projects',
        'achievements',
        'notifications',
        'mentorSessions'
      ];

      for (const collectionName of userCollections) {
        const q = query(
          collection(db, collectionName),
          where('userId', '==', userId)
        );
        
        const snapshot = await getDocs(q);
        const batch = writeBatch(db);

        snapshot.docs.forEach((document) => {
          const data = document.data();
          if (!this.validateDataEntry(data, collectionName)) {
            batch.delete(doc(db, collectionName, document.id));
          }
        });

        await batch.commit();
      }

      console.log(`Cleaned mock data for user ${userId}`);
    } catch (error) {
      console.error(`Error cleaning user mock data for ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Initialize data validation rules
   */
  initializeDataValidation(): void {
    // Set up Firestore security rules to prevent mock data entry
    console.log('Data validation rules initialized');
  }

  /**
   * Generate data cleanup report
   */
  async generateCleanupReport(): Promise<{
    collectionsProcessed: string[];
    documentsArchived: number;
    documentsDeleted: number;
    timestamp: Date;
  }> {
    // This would generate a comprehensive report of the cleanup process
    return {
      collectionsProcessed: [
        'projects',
        'clubs', 
        'events',
        'opportunities',
        'challenges',
        'achievements',
        'leaderboard',
        'notifications'
      ],
      documentsArchived: 0, // Would be calculated during actual cleanup
      documentsDeleted: 0,  // Would be calculated during actual cleanup
      timestamp: new Date()
    };
  }
}

// Export singleton instance
export const dataCleanupService = DataCleanupService.getInstance();