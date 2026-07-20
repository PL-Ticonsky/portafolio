export type ProjectPreview = {
  type: "live" | "video" | "image" | "unavailable";
  url?: string;
  poster?: string;
  alt?: string;
};

export type ProjectMedia = {
  type: "image" | "video";
  src: string;
  alt: string;
  caption?: string;
  poster?: string;
};

export type ProjectSectionContent = {
  title: string;
  description: string;
};

export type ProjectNode = {
  position: [number, number, number];
  mobilePosition: [number, number, number];
  scale: number;
  rotationAxis: [number, number, number];
  rotationSpeed: number;
  floatAmplitude: number;
  floatSpeed: number;
  floatPhase: number;
};

export type Project = {
  id: string;
  slug: string;
  name: string;
  archiveNumber: string;
  shortDescription: string;
  context: ProjectSectionContent;
  problem: ProjectSectionContent;
  solution: ProjectSectionContent;
  contribution: ProjectSectionContent;
  role: string;
  type: string;
  result?: string;
  status: string;
  year: string;
  color: string;
  technologies: string[];
  media: ProjectMedia[];
  preview: ProjectPreview;
  repositoryUrl?: string;
  liveUrl?: string;
  order: number;
  node: ProjectNode;
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
