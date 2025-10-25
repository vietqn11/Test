
import React from 'react';
import type { Story } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface StoryCardProps {
  story: Story;
  onSelect: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onSelect }) => {
  return (
    <div 
      onClick={onSelect}
      className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
    >
      <div className="relative h-48 w-full">
        <img 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          src={story.imageUrl} 
          alt={`Illustration for ${story.title}`} 
        />
        {story.isGeneratingContent && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <LoadingSpinner size="sm" />
            </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold text-white mb-2 truncate">{story.title}</h3>
        <p className="text-slate-400 text-sm">{story.summary}</p>
      </div>
    </div>
  );
};

export default StoryCard;
