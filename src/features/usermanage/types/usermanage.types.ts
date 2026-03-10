// src/features/usermanage/types/usermanage.types.ts

export interface UserProfileImage {
  public_id: string;
  secure_url: string;
}

export interface User {
  _id: string;
  email: string;
  role: string;
  country?: string;
  FirstName?: string;
  LastName?: string;
  // The API sometimes returns an empty array instead of an object for missing images
  profileImage?: UserProfileImage | unknown[];
}

export interface GetAllUsersResponse {
  message: string;
  statusCode: number;
  status: string;
  data: User[];
}
