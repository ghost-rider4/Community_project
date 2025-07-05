import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { createSampleMentors } from '../services/mentorshipService';
import { useAuth } from '../contexts/AuthContext';

export const TestUtils: React.FC = () => {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreateSampleMentors = async () => {
    setIsCreating(true);
    setMessage('');
    
    try {
      await createSampleMentors();
      setMessage('Sample mentors created successfully!');
    } catch (error: any) {
      setMessage(`Error creating mentors: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  // Only show for development purposes
  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Test Utilities
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              This page is only available in development mode.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" style={{ paddingLeft: 80 }}>
      <Card>
        <CardContent className="p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Development Test Utilities
          </h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Sample Data Creation
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Create Sample Mentors
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    This will create 5 sample mentors with different expertise areas for testing the mentor-student chat system.
                  </p>
                  
                  <Button
                    onClick={handleCreateSampleMentors}
                    disabled={isCreating}
                    className="flex items-center gap-2"
                  >
                    {isCreating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Sample Mentors'
                    )}
                  </Button>
                  
                  {message && (
                    <div className={`mt-4 p-3 rounded-lg ${
                      message.includes('Error') 
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                        : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                    }`}>
                      {message}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Current User Info
              </h2>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <pre className="text-sm text-gray-600 dark:text-gray-400">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};