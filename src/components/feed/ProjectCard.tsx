import { useState, useEffect } from 'react';
import { Heart, Heart as HeartOutline, HeartIcon, MessageCircle, Share2, Eye } from 'lucide-react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Project } from '../../types';
import { doc, updateDoc, arrayUnion, arrayRemove, collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { ProjectModal } from './ProjectModal';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [likes, setLikes] = useState(project.likes || 0);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [comments, setComments] = useState(project.comments || []);
  const [commentCount, setCommentCount] = useState(0);

  // On mount, check if user has liked
  useEffect(() => {
    if (user && project.likedBy && Array.isArray(project.likedBy)) {
      setLiked(project.likedBy.includes(user.id));
    }
    setLikes(project.likes || 0);
    setComments(project.comments || []);
  }, [user, project.likedBy, project.likes, project.comments]);

  // On mount and when modal opens, check if user has liked
  useEffect(() => {
    if (user && project.likedBy && Array.isArray(project.likedBy)) {
      setLiked(project.likedBy.includes(user.id));
    }
  }, [user, project.likedBy, modalOpen]);

  // Real-time comment count from subcollection
  useEffect(() => {
    const q = query(collection(db, 'projects', project.id, 'comments'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCommentCount(snapshot.size);
    });
    return () => unsubscribe();
  }, [project.id]);

  // Like handler (toggle like/unlike)
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    const ref = doc(db, 'projects', project.id);
    if (liked) {
      setLiked(false);
      setLikes(likes - 1);
      await updateDoc(ref, {
        likes: likes - 1,
        likedBy: arrayRemove(user.id),
      });
    } else {
      setLiked(true);
      setLikes(likes + 1);
      await updateDoc(ref, {
        likes: likes + 1,
        likedBy: arrayUnion(user.id),
      });
    }
  };

  // Share handler
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(window.location.origin + '/project/' + project.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Open modal
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  // Preview up to 2 comments
  const previewComments = comments.slice(0, 2) || [];

  // Callback to update comments from modal
  const handleCommentsUpdate = (newComments: any[]) => {
    setComments(newComments);
  };

  return (
    <>
      <Card
        hover
        className="overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105 shadow-lg hover:shadow-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
        onClick={handleOpenModal}
      >
        {/* Media */}
        <div className="aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
          {project.mediaType === 'video' ? (
            <video src={project.mediaUrl} controls className="w-full h-full object-cover" />
          ) : (
            <img 
              src={project.mediaUrl} 
              alt={project.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>
        {/* Content */}
        <div className="p-4 sm:p-6">
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
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-base sm:text-lg line-clamp-1">{project.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span 
                key={tag}
                className="px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
          {/* Preview Comments */}
          {previewComments.length > 0 && (
            <div className="mb-4">
              {previewComments.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <MessageCircle className="w-3 h-3" />
                  <span className="font-medium">{c.authorName}:</span>
                  <span className="truncate">{c.content}</span>
                </div>
              ))}
            </div>
          )}
          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 sm:gap-6">
              <button
                className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors ${liked ? 'text-red-500' : ''}`}
                onClick={handleLike}
              >
                {liked ? <Heart fill="#ef4444" className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                <span className="text-sm">{likes}</span>
              </button>
              <button
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                onClick={e => { e.stopPropagation(); setModalOpen(true); }}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{commentCount}</span>
              </button>
              <button
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">{copied ? 'Copied!' : 'Share'}</span>
              </button>
            </div>
            <button
              className="flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
              onClick={e => { e.stopPropagation(); setModalOpen(true); }}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">View</span>
            </button>
          </div>
        </div>
      </Card>
      <ProjectModal open={modalOpen} onClose={handleCloseModal} project={project} onCommentsUpdate={handleCommentsUpdate} />
    </>
  );
};