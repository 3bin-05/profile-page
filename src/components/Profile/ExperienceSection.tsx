import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, Building } from 'lucide-react';
import { format } from 'date-fns';
import { Experience, ExperienceFormData } from '../../types/profile';

interface ExperienceSectionProps {
  experiences: Experience[];
  isEditing: boolean;
  onAddExperience: (experience: ExperienceFormData) => Promise<void>;
  onUpdateExperience: (id: string, experience: Partial<ExperienceFormData>) => Promise<void>;
  onDeleteExperience: (id: string) => Promise<void>;
}

export function ExperienceSection({ 
  experiences, 
  isEditing, 
  onAddExperience, 
  onUpdateExperience, 
  onDeleteExperience 
}: ExperienceSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<string | null>(null);
  const [formData, setFormData] = useState<ExperienceFormData>({
    company: '',
    role: '',
    start_date: '',
    end_date: '',
    description: '',
  });

  const resetForm = () => {
    setFormData({
      company: '',
      role: '',
      start_date: '',
      end_date: '',
      description: '',
    });
    setShowForm(false);
    setEditingExperience(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingExperience) {
        await onUpdateExperience(editingExperience, formData);
      } else {
        await onAddExperience(formData);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving experience:', error);
    }
  };

  const handleEdit = (experience: Experience) => {
    setFormData({
      company: experience.company,
      role: experience.role,
      start_date: experience.start_date,
      end_date: experience.end_date || '',
      description: experience.description,
    });
    setEditingExperience(experience.id);
    setShowForm(true);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM yyyy');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Experience</h2>
        {isEditing && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Experience</span>
          </button>
        )}
      </div>

      {(showForm && isEditing) && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Company name"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Job title/role"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date (optional)</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
          </div>

          <textarea
            placeholder="Description of your role and achievements"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            rows={4}
          />

          <div className="flex items-center space-x-3">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              {editingExperience ? 'Update Experience' : 'Add Experience'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {experiences.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No work experience added yet.</p>
            {isEditing && (
              <p className="text-sm mt-2">Click "Add Experience" to showcase your professional journey.</p>
            )}
          </div>
        ) : (
          experiences.map(experience => (
            <div key={experience.id} className="border-l-4 border-blue-200 pl-6 pb-6">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">{experience.role}</h3>
                  <p className="text-blue-600 font-medium">{experience.company}</p>
                </div>
                {isEditing && (
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(experience)}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteExperience(experience.id)}
                      className="text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-1 text-gray-500 text-sm mb-3">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDate(experience.start_date)} - {experience.end_date ? formatDate(experience.end_date) : 'Present'}
                </span>
              </div>
              
              {experience.description && (
                <p className="text-gray-700 leading-relaxed">{experience.description}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}