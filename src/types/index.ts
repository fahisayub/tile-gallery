export interface Project {
  id: string;
  title: string;
  description: string;
  imagePath: string;
  category: string;
  material?: string;
  location?: string;
  date?: string;
  images?: string[];
}

export interface Category {
  id: string;
  name: string;
  label: string;
}

export interface Stat {
  number: string;
  label: string;
} 