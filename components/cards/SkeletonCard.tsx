import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl animate-pulse">
    <div className="h-5 bg-[var(--bg-primary)] rounded-md w-3/4 mb-4"></div>
    <div className="flex gap-2">
      <div className="h-4 bg-[var(--bg-primary)] rounded-md w-12"></div>
      <div className="h-4 bg-[var(--bg-primary)] rounded-md w-16"></div>
    </div>
  </div>
    );
};

export default SkeletonCard;

