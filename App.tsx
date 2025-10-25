
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import StoryCard from './components/StoryCard';
import StoryView from './components/StoryView';
import LoadingSpinner from './components/LoadingSpinner';
import { generateStories, generateStoryContent } from './services/geminiService';
import type { Story } from './types';

const App: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateStories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setStories([]);
    setSelectedStory(null);
    try {
      const storyIdeas = await generateStories();
      const storiesWithImages: Story[] = storyIdeas.map((idea: {title: string, summary: string}, index: number) => ({
        id: `${Date.now()}-${index}`,
        title: idea.title,
        summary: idea.summary,
        imageUrl: `https://picsum.photos/seed/${idea.title.replace(/\s/g, '')}/800/600`,
        isGeneratingContent: false,
      }));
      setStories(storiesWithImages);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectStory = useCallback(async (story: Story) => {
    if (story.isGeneratingContent) return;

    if (story.content) {
      setSelectedStory(story);
      return;
    }

    setStories(prevStories => prevStories.map(s => s.id === story.id ? { ...s, isGeneratingContent: true } : s));
    setError(null);

    try {
      const content = await generateStoryContent(story.title);
      const updatedStory = { ...story, content, isGeneratingContent: false };
      
      setStories(prevStories => prevStories.map(s => s.id === story.id ? updatedStory : s));
      setSelectedStory(updatedStory);

    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      setStories(prevStories => prevStories.map(s => s.id === story.id ? { ...s, isGeneratingContent: false } : s));
    }
  }, []);

  const handleBackToList = () => {
    setSelectedStory(null);
  };

  const renderContent = () => {
    if (selectedStory) {
      return <StoryView story={selectedStory} onBack={handleBackToList} />;
    }

    return (
      <main className="container mx-auto px-4">
        <div className="flex justify-center mb-12">
          <button 
            onClick={handleGenerateStories} 
            disabled={isLoading}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && !stories.length ? 'Generating Ideas...' : 'Generate New Stories'}
          </button>
        </div>
        
        {isLoading && !stories.length && <LoadingSpinner size="lg" />}

        {error && <p className="text-center text-red-400 mb-4">{error}</p>}

        {stories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {stories.map(story => (
              <StoryCard key={story.id} story={story} onSelect={() => handleSelectStory(story)} />
            ))}
          </div>
        )}
        {!isLoading && stories.length === 0 && !error && (
            <div className="text-center text-slate-400 py-16">
                <p className="text-2xl">Ready for an adventure?</p>
                <p>Click the button above to generate some magical stories!</p>
            </div>
        )}
      </main>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans pb-16">
      <Header />
      {renderContent()}
    </div>
  );
};

export default App;
