import { api } from "@/lib/api";
import type {
  DeleteResumeResponse,
  GetResumeResponse,
  UploadResumeResponse,
} from "@/types/resume.types";

export const resumeService = {
  async getResume(): Promise<GetResumeResponse> {
    const response = await api.get<{
      status: string;
      data: GetResumeResponse;
    }>("/resume/me");

    return response.data.data;
  },

  async uploadResume(file: File): Promise<UploadResumeResponse> {
    const formData = new FormData();

    formData.append("resume", file);

    const response = await api.post<{
      status: string;
      data: UploadResumeResponse;
    }>("/resume/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  },

  async deleteResume(): Promise<DeleteResumeResponse> {
    const response = await api.delete<{
      status: string;
      data: DeleteResumeResponse;
    }>("/resume");

    return response.data.data;
  },
};
