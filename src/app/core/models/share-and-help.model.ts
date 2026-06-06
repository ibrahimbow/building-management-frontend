export interface ShareAndHelpComment {
  id: string;
  comment: string;
  createdAt: string;

  createdByUserId: number;
  createdByDisplayName: string;
  createdByAvatarUrl: string | null;
}

export interface ShareAndHelp {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string | null;

  createdByUserId: number;
  createdByDisplayName: string;
  createdByAvatarUrl: string | null;

  comments: ShareAndHelpComment[];
}

export interface CreateShareAndHelpRequest {
  title: string;
  description: string;
  imageUrl: string | null;
}

export interface UpdateShareAndHelpRequest {
  title: string;
  description: string;
  imageUrl: string | null;
}

export interface CreateShareAndHelpCommentRequest {
  comment: string;
}