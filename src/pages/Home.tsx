import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Filter } from 'lucide-react';
import { ProjectCard } from '../components/feed/ProjectCard';
import { Button } from '../components/ui/Button';
import { mockProjects } from '../utils/mockData';
import { Project } from '../types';

export const Home: React.FC = () => {
  const [posts, setPosts] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<'all' | 'trending' | 'following'>('all');

  // Simulate loading more posts
  const loadMorePosts = () => {
    if (loading) return;
    
    setLoading(true);
    setTimeout(() => {
      // Simulate API call - duplicate and modify existing posts with new IDs
      const newPosts = mockProjects.map((project, index) => ({
        ...project,
        id: `${project.id}-${posts.length + index}`,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        likes: Math.floor(Math.random() * 500) + 50,
        authorName: ['Maya Patel', 'Jordan Kim', 'Sophia Rodriguez', 'Ethan Zhang', 'Aria Johnson'][Math.floor(Math.random() * 5)]
      }));
      
      setPosts(prev => [...prev, ...newPosts]);
      setLoading(false);
      
      // Simulate end of content after 20 posts
      if (posts.length + newPosts.length >= 20) {
        setHasMore(false);
      }
    }, 1000);
  };

  // Load initial posts
  useEffect(() => {
    loadMorePosts();
  }, []);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading || !hasMore) {
        return;
      }
      loadMorePosts();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, posts.length]);

  const filters = [
    { id: 'all', label: 'All Posts', icon: Sparkles },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'following', label: 'Following', icon: Filter }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Discover Amazing Talent
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Explore incredible projects from gifted students around the world
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2">
          {filters.map((filterOption) => {
            const Icon = filterOption.icon;
            return (
              <button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id as any)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  filter === filterOption.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                {filterOption.label}
              </button>
            );
          })}
        </div>

        {/* Posts Feed */}
        <div className="space-y-6 sm:space-y-8">
          {posts.map((post) => (
            <ProjectCard key={post.id} project={post} />
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        )}

        {/* End of Content */}
        {!hasMore && posts.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              You've reached the end! Check back later for more amazing content.
            </p>
          </div>
        )}

        {/* Empty State */}
        {posts.length === 0 && !loading && (
          <div className="text-center py-16">
            <Sparkles className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No posts yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base">
              Be the first to share your amazing work with the community!
            </p>
            <Button>Share Your Project</Button>
          </div>
        )}
      </div>
    </div>
  );
};