import React, { useState } from 'react';
import { Upload as UploadIcon, Image, Video, FileText, X, Plus, Tag, Globe, Users, Lock, CheckCircle } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const Upload: React.FC = () => {
  const [uploadType, setUploadType] = useState<'image' | 'video' | 'document'>('image');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [talent, setTalent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'clubs' | 'private'>('public');
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { user } = useAuth();

  const talents = [
    'Music', 'Piano', 'Guitar', 'Violin', 'Vocals',
    'Visual Arts', 'Painting', 'Drawing', 'Sculpture', 'Digital Art',
    'Science', 'Physics', 'Chemistry', 'Biology', 'Mathematics',
    'Technology', 'Programming', 'AI/ML', 'Robotics', 'Web Development',
    'Literature', 'Creative Writing', 'Poetry', 'Journalism',
    'Other'
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const uploadFileToStorage = async (file: File): Promise<string> => {
    if (!user) throw new Error('User not authenticated');
    
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const filePath = `projects/${user.id}/${fileName}`;
    
    const storageRef = ref(storage, filePath);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('You must be logged in to upload projects');
      return;
    }

    if (files.length === 0) {
      alert('Please select at least one file to upload');
      return;
    }

    setIsUploading(true);
    
    try {
      // Upload files to Firebase Storage
      const uploadPromises = files.map(file => uploadFileToStorage(file));
      const fileUrls = await Promise.all(uploadPromises);
      
      // Create project document in Firestore
      const projectData = {
        title,
        description,
        authorId: user.id,
        authorName: user.name,
        talent,
        mediaUrls: fileUrls,
        mediaType: uploadType,
        tags,
        visibility,
        likes: 0,
        comments: [],
        createdAt: serverTimestamp(),
        verified: false
      };

      await addDoc(collection(db, 'projects'), projectData);
      
      // Update user's project count
      // This could be done with a cloud function or here
      
      setUploadSuccess(true);
      
      // Reset form
      setTitle('');
      setDescription('');
      setTalent('');
      setTags([]);
      setFiles([]);
      
    } catch (error) {
      console.error('Error uploading project:', error);
      alert('Failed to upload project. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const getUploadTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'document': return <FileText className="w-5 h-5" />;
      default: return <UploadIcon className="w-5 h-5" />;
    }
  };

  const getVisibilityIcon = (vis: string) => {
    switch (vis) {
      case 'public': return <Globe className="w-4 h-4" />;
      case 'clubs': return <Users className="w-4 h-4" />;
      case 'private': return <Lock className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  if (uploadSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-green-900 dark:text-green-300 mb-2">
            Project Uploaded Successfully!
          </h1>
          <p className="text-green-700 dark:text-green-400 mb-6">
            Your project has been submitted and is now under review. You'll be notified once it's approved.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => setUploadSuccess(false)}>
              Upload Another Project
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Share Your Work</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload your projects, performances, and creations to inspire the community
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Upload Type Selection */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Content Type</h3>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-3 gap-4">
              {[
                { type: 'image', label: 'Image', desc: 'Photos, artwork, diagrams' },
                { type: 'video', label: 'Video', desc: 'Performances, tutorials, demos' },
                { type: 'document', label: 'Document', desc: 'Research, essays, scores' }
              ].map((option) => (
                <button
                  key={option.type}
                  type="button"
                  onClick={() => setUploadType(option.type as any)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    uploadType === option.type
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {getUploadTypeIcon(option.type)}
                    <span className="font-medium text-gray-900 dark:text-white">{option.label}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{option.desc}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Files</h3>
          </CardHeader>
          <CardContent className="pt-0">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <UploadIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Drop files here or click to browse
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Supported: Images (JPG, PNG, GIF), Videos (MP4, MOV), Documents (PDF, DOC)
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                accept={
                  uploadType === 'image' ? 'image/*' :
                  uploadType === 'video' ? 'video/*' :
                  '.pdf,.doc,.docx,.txt'
                }
              />
              <label htmlFor="file-upload">
                <Button type="button" variant="outline" className="cursor-pointer">
                  Choose Files
                </Button>
              </label>
            </div>

            {/* File Preview */}
            {files.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Selected Files</h4>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getUploadTypeIcon(uploadType)}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Details</h3>
          </CardHeader>
          <CardContent className="pt-0 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Give your project a compelling title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                placeholder="Describe your project, the process, challenges, and what you learned..."
                required
              />
            </div>

            {/* Talent Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Talent Category *
              </label>
              <select
                value={talent}
                onChange={(e) => setTalent(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select a talent category</option>
                {talents.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Add tags to help others discover your work"
                />
                <Button type="button" onClick={addTag} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="default" className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Visibility
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'public', label: 'Public', desc: 'Everyone can see' },
                  { value: 'clubs', label: 'Clubs Only', desc: 'Only club members' },
                  { value: 'private', label: 'Private', desc: 'Only you can see' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setVisibility(option.value as any)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      visibility === option.value
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {getVisibilityIcon(option.value)}
                      <span className="font-medium text-gray-900 dark:text-white">{option.label}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button 
            type="submit" 
            className="flex-1" 
            size="lg"
            disabled={isUploading || files.length === 0}
          >
            <UploadIcon className="w-5 h-5" />
            {isUploading ? 'Uploading...' : 'Publish Project'}
          </Button>
        </div>
      </form>
    </div>
  );
};