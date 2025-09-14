import { supabase } from '../lib/supabase';
import { CompleteProfile, Project, Experience, ProjectFormData, ExperienceFormData } from '../types/profile';

export class ProfileService {
  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }

  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  static async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  static async getCompleteProfile(): Promise<CompleteProfile> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError;
    }

    // Get projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (projectsError) throw projectsError;

    // Get experiences
    const { data: experiences, error: experiencesError } = await supabase
      .from('experiences')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: false });

    if (experiencesError) throw experiencesError;

    return {
      profile: profile || null,
      projects: projects || [],
      experiences: experiences || [],
    };
  }

  static async updateBio(bio: string) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        bio,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async createProject(projectData: ProjectFormData): Promise<Project> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        ...projectData,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateProject(id: string, projectData: Partial<ProjectFormData>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteProject(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async createExperience(experienceData: ExperienceFormData): Promise<Experience> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('experiences')
      .insert({
        user_id: user.id,
        ...experienceData,
        end_date: experienceData.end_date || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateExperience(id: string, experienceData: Partial<ExperienceFormData>): Promise<Experience> {
    const { data, error } = await supabase
      .from('experiences')
      .update({
        ...experienceData,
        end_date: experienceData.end_date || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteExperience(id: string) {
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}