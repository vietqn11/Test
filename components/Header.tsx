
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center py-8 md:py-12">
      <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500">
        Story Teller AI
      </h1>
      <p className="text-slate-400 mt-2 text-lg">Your Personal AI Story Generator</p>
    </header>
  );
};

export default Header;
