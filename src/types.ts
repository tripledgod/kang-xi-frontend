// Define API response interfaces
export interface ImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
}

export interface Image {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: {
    thumbnail: ImageFormat;
    small: ImageFormat;
    medium: ImageFormat;
    large: ImageFormat;
  };
}

export interface JourneyIcon {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: null;
  folderPath: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
}

export interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio: string;
  image: Image;
}

export interface Heritage {
  id: number;
  title: string;
  body: string;
  yearsExp: string;
  rareCollectibleItems: string;
  image: Image;
}

export interface Journey {
  id: number;
  title: string;
  description: string;
  icon: JourneyIcon;
}

export interface CoverImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail: ImageFormat;
    small: ImageFormat;
    medium: ImageFormat;
    large: ImageFormat;
  };
}

export interface Cover {
  id: number;
  title: string;
  subTitle: string;
  image: CoverImage;
}

export interface AboutResponse {
  data: {
    id: number;
    documentId: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    subtitle: string | null;
    mainContent: string;
    team: TeamMember[];
    heritage: Heritage;
    journey: Journey[];
    cover: Cover;
  };
  meta: Record<string, unknown>;
}
