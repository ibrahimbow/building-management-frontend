export interface ShareAndHelpComment {
  id: string;
  text: string;
  createdAt: string;
  createdByUserId: string;
  createdByNickname: string;
  createdByAvatarUrl?: string;
}

export interface ShareAndHelp {
  id: string;
  title: string;
  description: string;
  createdAt: string;

  createdByUserId: string;
  createdByNickname: string;
  createdByAvatarUrl?: string;

  images: string[];

  comments: ShareAndHelpComment[];
}