import { LibraryTopic } from "../../articales/api/article.api";

export type LibraryRegion =
  | "AXIAL SKELETON"
  | "UPPER LIMB"
  | "LOWER LIMB"
  | "OTHER";

export type LibraryQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  speciality?: string;
  bodyArea?: string;
  [key: string]: string | number | undefined;
};

export type LibraryImage = {
  public_id: string;
  secure_url: string;
};

export type LibraryArticle = {
  _id: string;
  name: string;
  description: string;
  topicIds: LibraryTopic[];
  image?: LibraryImage;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type LibraryMeta = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type GetAllLibraryArticlesResponse = {
  message: string;
  statusCode: number;
  status: string;
  meta: LibraryMeta;
  data: LibraryArticle[];
};
