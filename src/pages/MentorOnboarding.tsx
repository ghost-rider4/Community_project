import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, User, MapPin, GraduationCap, Award, Users, Clock, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';

export const MentorOnboarding: React.FC = () => {
  const [step, setStep] = useState<'profile' | 'expertise' | 'preferences' | 'verification' | 'complete'>('profile');
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    education: '',
    experience: '',
    expertise: [] as string[],
    specializations: [] as string[],
    mentorshipAreas: [] as string[],
    preferredStudentLevel: [] as string[],
    maxStudents: 5,
    availability: true,
    certifications: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(false);
  const { updateUserData } = useAuth();
  const navigate = useNavigate();

  const expertiseOptions = [
    'Music', 'Piano', 'Guitar', 'Violin', 'Vocals', 'Composition',
    'Visual Arts', 'Painting', 'Drawing', 'Sculpture', 'Digital Art',
    'Science', 'Physics', 'Chemistry', 'Biology', 'Mathematics',
    'Technology', 'Programming', 'AI/ML', 'Robotics', 'Web Development',
    'Literature', 'Creative Writing', 'Poetry', 'Journalism',
    'Engineering', 'Architecture', 'Design', 'Business', 'Other'
  ];

  const mentorshipAreas = [
    'Academic Support', 'Career Guidance', 'Project Mentoring',
    'Skill Development', 'Creative Direction', 'Research Guidance',
    'Performance Coaching', 'Portfolio Development', 'Competition Prep'
  ];

  const studentLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value]
    }));
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await updateUserData({
        ...formData,
        onboardingCompleted: true,
        profileSetup: true
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'profile':
        return (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Tell Us About Yourself</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Help students understand your background and expertise
              </p>
            </div>

            <Card className="mb-8">
              <CardContent className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Professional Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    placeholder="Share your professional journey, achievements, and what drives your passion for mentoring..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="City, State/Country"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Education Background
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.education}
                      onChange={(e) => handleInputChange('education', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="University, Degree, Certifications..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Professional Experience
                  </label>
                  <textarea
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    placeholder="Years of experience, key roles, notable achievements..."
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={() => setStep('expertise')}>
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );

      case 'expertise':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your Areas of Expertise</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Select the subjects and skills you can mentor students in
              </p>
            </div>

            <Card className="mb-8">
              <CardContent className="p-8 space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Primary Expertise</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {expertiseOptions.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => handleArrayToggle('expertise', skill)}
                        className={`p-3 rounded-lg border-2 transition-all text-sm ${
                          formData.expertise.includes(skill)
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                            : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Mentorship Areas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {mentorshipAreas.map((area) => (
                      <button
                        key={area}
                        onClick={() => handleArrayToggle('mentorshipAreas', area)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          formData.mentorshipAreas.includes(area)
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                            : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="font-medium">{area}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('profile')}>
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button onClick={() => setStep('preferences')}>
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Mentoring Preferences</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Set your preferences for working with students
              </p>
            </div>

            <Card className="mb-8">
              <CardContent className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Preferred Student Levels
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {studentLevels.map((level) => (
                      <button
                        key={level}
                        onClick={() => handleArrayToggle('preferredStudentLevel', level)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.preferredStudentLevel.includes(level)
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                            : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maximum Students
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={formData.maxStudents}
                      onChange={(e) => handleInputChange('maxStudents', parseInt(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {[3, 5, 8, 10, 15, 20].map(num => (
                        <option key={num} value={num}>{num} students</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.availability}
                      onChange={(e) => handleInputChange('availability', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500 dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      I'm currently available to take on new students
                    </span>
                  </label>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('expertise')}>
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button onClick={() => setStep('verification')}>
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );

      case 'verification':
        return (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Verification Documents</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Upload documents to verify your expertise and credentials
              </p>
            </div>

            <Card className="mb-8">
              <CardContent className="p-8 space-y-6">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <Award className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Upload Credentials</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Degrees, certifications, portfolio samples, or professional references
                  </p>
                  <Button variant="outline">
                    Choose Files
                  </Button>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Verification Process</h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                    <li>• Documents are reviewed within 24-48 hours</li>
                    <li>• Verified mentors get a special badge</li>
                    <li>• You can start mentoring immediately after setup</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('preferences')}>
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button onClick={() => setStep('complete')}>
                Complete Setup
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center max-w-2xl mx-auto">
            <img 
              src="/image.png" 
              alt="ElevatED" 
              className="w-20 h-20 mx-auto mb-8 object-contain"
            />
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to the Mentor Community!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Your profile is being reviewed. You'll be notified once verification is complete. 
              Start exploring the platform and connecting with students!
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6">
                <Users className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Find Students</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Connect with talented students seeking guidance</p>
              </Card>
              <Card className="p-6">
                <Target className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Set Goals</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Help students achieve their learning objectives</p>
              </Card>
              <Card className="p-6">
                <Clock className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Flexible Schedule</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Mentor on your own schedule and availability</p>
              </Card>
            </div>
            
            <Button size="lg" onClick={handleComplete} disabled={isLoading}>
              {isLoading ? 'Setting up...' : 'Enter ElevatED'}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-16">
        {renderStep()}
      </div>
    </div>
  );
};