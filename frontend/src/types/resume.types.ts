export type Resume = {
  id: string;
  userId: string;

  originalName: string;
  fileUrl: string | null;
  mimeType: string;
  size: number;

  rawText: string | null;
  parsedJson: unknown | null;

  createdAt: string;
  updatedAt: string;
};

export type GetResumeResponse = {
  resume: Resume;
};

export type UploadResumeResponse = {
  resume: Resume;
};

export type DeleteResumeResponse = null;
