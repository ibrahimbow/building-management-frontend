export type FileType =
  | 'PROFILE_AVATAR'
  | 'ANNOUNCEMENT_IMAGE'
  | 'SHARE_AND_HELP_IMAGE';

export interface UploadedFile {
  fileName: string;
  url: string;
  contentType: string;
  size: number;
}