'use client';

import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export default function PageHeader({ title, description, className = '' }: PageHeaderProps) {
  return (
    <div className={`flex-1 ${className}`}>
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
} 