export interface UserProfile {
  id: string;
  user_id: string;
  bio: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  link: string;
  description: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  user_id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CompleteProfile {
  profile: UserProfile | null;
  projects: Project[];
  experiences: Experience[];
}

export interface ProjectFormData {
  title: string;
  link: string;
  description: string;
  tags: string[];
}

export interface ExperienceFormData {
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  description: string;
}