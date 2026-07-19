export type ProjectPreview = {
  type: "live" | "video" | "image" | "unavailable";
  url?: string;
  poster?: string;
  alt?: string;
};

export type ProjectImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type ProjectId =
  | "museum-heist"
  | "sembraalas"
  | "sga"
  | "tinta"
  | "reservaciones";

export type Project = {
  id: ProjectId;
  slug: ProjectId;
  name: string;
  shortDescription?: string;
  fullDescription?: string;
  problem?: string;
  solution?: string;
  architecture?: string;
  role?: string;
  contribution?: string;
  result?: string;
  status?: string;
  year?: string;
  color: string;
  technologies: string[];
  images: ProjectImage[];
  preview: ProjectPreview;
  repositoryUrl?: string;
  liveUrl?: string;
  order: number;
};

export type PersonalLink = {
  label: string;
  url: string;
};

export type PersonalProfile = {
  fullName?: string;
  alias: string;
  professionalTitle?: string;
  location?: string;
  photo: {
    src: string;
    alt: string;
    objectPosition?: string;
    placeholder?: boolean;
  };
  description?: string;
  summary?: string;
  specialties: string[];
  technologies: string[];
  experience: string[];
  education: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  otherLinks: PersonalLink[];
  email?: string;
  resumeUrl?: string;
};
