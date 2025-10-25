
import React from 'react';
import type { Story } from '../types';

interface StoryViewProps {
  story: Story;
  onBack: () => void;
}

const StoryView: React.FC<StoryViewProps> = ({ story, onBack }) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Back to Stories
      </button>

      <article>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">{story.title}</h1>
        <p className="text-lg text-slate-400 mb-8 italic">{story.summary}</p>
        <img 
          src={story.imageUrl} 
          alt={story.title} 
          className="w-full h-64 md:h-96 object-cover rounded-lg shadow-xl mb-8"
        />
        <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed space-y-6">
          {story.content?.split('\n').map((paragraph, index) => (
            paragraph.trim() && <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  );
};

export default StoryView;
