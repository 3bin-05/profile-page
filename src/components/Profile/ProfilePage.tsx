import React, { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { ProfileService } from '../../services/profileService';
import { CompleteProfile, ProjectFormData, ExperienceFormData } from '../../types/profile';
import { ProfileHeader } from './ProfileHeader';
import { BioSection } from './BioSection';
import { ProjectsSection } from './ProjectsSection';
import { ExperienceSection } from './ExperienceSection';

interface ProfilePageProps {
  user: any;
  onLogout: () => void;
}

export function ProfilePage({ user, onLogout }: ProfilePageProps) {
  const [profile, setProfile] = useState<CompleteProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await ProfileService.getCompleteProfile();
      setProfile(data);
      setBio(data.profile?.bio || '');
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (bio !== (profile?.profile?.bio || '')) {
        await ProfileService.updateBio(bio);
      }
      await loadProfile();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleCancel = () => {
    setBio(profile?.profile?.bio || '');
    setIsEditing(false);
  };

  const handleAddProject = async (projectData: ProjectFormData) => {
    await ProfileService.createProject(projectData);
    await loadProfile();
  };

  const handleUpdateProject = async (id: string, projectData: Partial<ProjectFormData>) => {
    await ProfileService.updateProject(id, projectData);
    await loadProfile();
  };

  const handleDeleteProject = async (id: string) => {
    await ProfileService.deleteProject(id);
    await loadProfile();
  };

  const handleAddExperience = async (experienceData: ExperienceFormData) => {
    await ProfileService.createExperience(experienceData);
    await loadProfile();
  };

  const handleUpdateExperience = async (id: string, experienceData: Partial<ExperienceFormData>) => {
    await ProfileService.updateExperience(id, experienceData);
    await loadProfile();
  };

  const handleDeleteExperience = async (id: string) => {
    await ProfileService.deleteExperience(id);
    await loadProfile();
  };

  const handleLogout = async () => {
    try {
      await ProfileService.signOut();
      onLogout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="absolute top-4 right-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <ProfileHeader
          user={user}
          isEditing={isEditing}
          onToggleEdit={() => setIsEditing(!isEditing)}
          onSave={handleSave}
          onCancel={handleCancel}
        />

        <BioSection
          bio={bio}
          isEditing={isEditing}
          onBioChange={setBio}
        />

        <ProjectsSection
          projects={profile?.projects || []}
          isEditing={isEditing}
          onAddProject={handleAddProject}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
        />

        <ExperienceSection
          experiences={profile?.experiences || []}
          isEditing={isEditing}
          onAddExperience={handleAddExperience}
          onUpdateExperience={handleUpdateExperience}
          onDeleteExperience={handleDeleteExperience}
        />
      </div>
    </div>
  );
}