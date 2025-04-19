'use client';

import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="text-center mb-10">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h1>
      {description && (
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">{description}</p>
      )}
    </div>
  );
};

export default PageHeader; 