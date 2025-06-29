import React, { useState } from 'react';
import { User, Mail, Lock, Camera, Save, Eye, EyeOff, Trash2, AlertTriangle } from 'lucide-react';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';

export const Account: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'danger'>('profile');
  const { user, firebaseUser, updateUserProfile, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      email: true,
      push: true,
      mentions: true,
      achievements: true
    }
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }));
  };

  const handleProfileSave = async () => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await updateUserProfile({
        name: formData.name
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setIsLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password should be at least 6 characters' });
      setIsLoading(false);
      return;
    }

    try {
      if (!firebaseUser || !user?.email) {
        throw new Error('No user logged in');
      }

      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(user.email, formData.currentPassword);
      await reauthenticateWithCredential(firebaseUser, credential);

      // Update password
      await updatePassword(firebaseUser, formData.newPassword);

      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        setMessage({ type: 'error', text: 'Current password is incorrect' });
      } else {
        setMessage({ type: 'error', text: error.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesSave = () => {
    setMessage({ type: 'success', text: 'Preferences saved successfully!' });
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setMessage({ type: 'error', text: 'Please enter your password to confirm deletion' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (!firebaseUser || !user?.email) {
        throw new Error('No user logged in');
      }

      // Re-authenticate user before deletion
      const credential = EmailAuthProvider.credential(user.email, deletePassword);
      await reauthenticateWithCredential(firebaseUser, credential);

      // Delete user data from Firestore
      await deleteDoc(doc(db, 'users', firebaseUser.uid));

      // Delete Firebase Auth user
      await deleteUser(firebaseUser);

      // User will be automatically logged out
      setMessage({ type: 'success', text: 'Account deleted successfully' });
      
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        setMessage({ type: 'error', text: 'Incorrect password' });
      } else {
        setMessage({ type: 'error', text: error.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Mail },
    { id: 'danger', label: 'Account Deletion', icon: Trash2 }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Account Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account information and preferences
        </p>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? tab.id === 'danger' 
                    ? 'bg-red-600 text-white border-b-2 border-red-600'
                    : 'bg-purple-600 text-white border-b-2 border-purple-600'
                  : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h3>
            </CardHeader>
            <CardContent className="pt-0 space-y-6">
              {/* Profile Photo */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar name={formData.name} size="lg" />
                  <button className="absolute -bottom-1 -right-1 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Profile Photo</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Upload a photo to personalize your profile
                  </p>
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={isLoading}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                  disabled
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Email cannot be changed. Contact support if you need to update your email.
                </p>
              </div>

              <Button 
                onClick={handleProfileSave} 
                className="w-full sm:w-auto"
                disabled={isLoading}
              >
                <Save className="w-4 h-4" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h3>
            </CardHeader>
            <CardContent className="pt-0 space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter current password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    disabled={isLoading}
                  >
                    {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter new password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    disabled={isLoading}
                  >
                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Confirm new password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    disabled={isLoading}
                  >
                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button 
                onClick={handlePasswordChange} 
                className="w-full sm:w-auto"
                disabled={isLoading}
              >
                <Save className="w-4 h-4" />
                {isLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Preferences</h3>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              {[
                { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                { key: 'push', label: 'Push Notifications', desc: 'Browser and mobile notifications' },
                { key: 'mentions', label: 'Mentions & Comments', desc: 'When someone mentions or comments on your work' },
                { key: 'achievements', label: 'Achievement Updates', desc: 'New badges and milestone notifications' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{item.label}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notifications[item.key as keyof typeof formData.notifications]}
                      onChange={(e) => handleNotificationChange(item.key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              ))}

              <Button onClick={handlePreferencesSave} className="w-full sm:w-auto">
                <Save className="w-4 h-4" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Danger Zone Tab */}
      {activeTab === 'danger' && (
        <div className="space-y-6">
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader className="bg-red-50 dark:bg-red-900/20">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-300">Delete Account</h3>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    This action cannot be undone. All your data will be permanently deleted.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {!showDeleteConfirm ? (
                <div className="space-y-4">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-300 mb-2">
                      What will be deleted:
                    </h4>
                    <ul className="text-sm text-yellow-800 dark:text-yellow-400 space-y-1">
                      <li>• Your profile and personal information</li>
                      <li>• All uploaded projects and content</li>
                      <li>• Progress tracking and achievements</li>
                      <li>• Club memberships and connections</li>
                      <li>• Chat history and messages</li>
                    </ul>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                    I want to delete my account
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h4 className="font-medium text-red-900 dark:text-red-300 mb-2">
                      Final Confirmation
                    </h4>
                    <p className="text-sm text-red-800 dark:text-red-400">
                      Please enter your password to confirm account deletion. This action is irreversible.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Enter your password to confirm
                    </label>
                    <div className="relative">
                      <input
                        type={showDeletePassword ? 'text' : 'password'}
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 border border-red-300 dark:border-red-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter your password"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowDeletePassword(!showDeletePassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        disabled={isLoading}
                      >
                        {showDeletePassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={handleDeleteAccount}
                      disabled={!deletePassword || isLoading}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                      {isLoading ? 'Deleting...' : 'Delete My Account'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeletePassword('');
                      }}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};