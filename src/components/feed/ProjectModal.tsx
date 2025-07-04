import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { MessageCircle, X } from 'lucide-react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';

interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
  project: Project;
  onCommentsUpdate?: (comments: any[]) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ open, onClose, project }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState<any[]>([]);

  // Real-time comments sync from subcollection
  useEffect(() => {
    if (!open) return;
    const q = query(
      collection(db, 'projects', project.id, 'comments'),
      orderBy('createdAt', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(fetched);
    });
    return () => unsubscribe();
  }, [open, project.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim()) return;
    setSubmitting(true);
    const newComment = {
      authorId: user.id,
      authorName: user.name,
      content: comment,
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, 'projects', project.id, 'comments'), newComment);
    setComment('');
    setSubmitting(false);
  };

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
      <Card className="w-full max-w-5xl max-h-[95vh] overflow-y-auto relative bg-white dark:bg-gray-900 p-0 md:p-8">
        <button onClick={onClose} className="absolute top-3 right-3 p-2 text-gray-400 hover:text-purple-600 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <X className="w-6 h-6" />
        </button>
        {/* Media */}
        <div className="w-full aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden mb-6 rounded-xl flex items-center justify-center">
          {project.mediaType === 'video' ? (
            <video src={project.mediaUrl} controls className="max-h-[50vh] w-auto max-w-full rounded-xl" />
          ) : (
            <img src={project.mediaUrl} alt={project.title} className="max-h-[50vh] w-auto max-w-full rounded-xl object-contain" />
          )}
        </div>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar name={project.authorName} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white truncate">{project.authorName}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{project.createdAt.toLocaleDateString()}</p>
          </div>
          <Badge variant="default" className="text-xs">{project.talent}</Badge>
        </div>
        {/* Title and Description */}
        <h2 className="font-bold text-2xl text-gray-900 dark:text-white mb-2">{project.title}</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4 text-base">{project.description}</p>
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-xs rounded-full">#{tag}</span>
          ))}
        </div>
        {/* Comments */}
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" /> Comments
          </h3>
          <div className="space-y-3 max-h-40 overflow-y-auto">
            {comments.length === 0 && <div className="text-gray-500 text-sm">No comments yet.</div>}
            {comments.map((c, i) => (
              <div key={c.id || i} className="flex items-start gap-2 text-sm">
                <Avatar name={c.authorName} size="sm" />
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">{c.authorName}</span>
                  <span className="ml-2 text-gray-400 text-xs">{c.createdAt?.toDate ? c.createdAt.toDate().toLocaleDateString() : ''}</span>
                  <div className="text-gray-700 dark:text-gray-300">{c.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Add Comment */}
        {user && (
          <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
            <input
              type="text"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Add a public comment..."
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              Post
            </button>
          </form>
        )}
      </Card>
    </div>
  );
}; 