import React from 'react';

interface BioSectionProps {
  bio: string;
  isEditing: boolean;
  onBioChange: (bio: string) => void;
}

export function BioSection({ bio, isEditing, onBioChange }: BioSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">About Me</h2>
      
      {isEditing ? (
        <textarea
          value={bio}
          onChange={(e) => onBioChange(e.target.value)}
          placeholder="Tell us about yourself, your skills, and your professional journey..."
          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      ) : (
        <p className="text-gray-700 leading-relaxed">
          {bio || 'No bio added yet. Click "Edit Profile" to add your professional summary.'}
        </p>
      )}
    </div>
  );
}