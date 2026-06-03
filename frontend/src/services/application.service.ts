import { api } from "@/lib/api";

import type {
  Application,
  CreateApplicationInput,
  CreateApplicationResponse,
  GetApplicationResponse,
  GetApplicationsParams,
  GetApplicationsResponse,
  UpdateApplicationInput,
  UpdateApplicationResponse,
  UpdateApplicationStatusInput,
} from "../types/application.types";

const APPLICATIONS_ENDPOINT = "/applications";

const cleanParams = (params?: GetApplicationsParams) => {
  if (!params) return undefined;

  return {
    status: params.status || undefined,
    keyword: params.keyword?.trim() || undefined,
    page: params.page,
    limit: params.limit,
    sort: params.sort || undefined,
  };
};

const getApplications = async (
  params?: GetApplicationsParams,
): Promise<GetApplicationsResponse> => {
  const response = await api.get<GetApplicationsResponse>(
    APPLICATIONS_ENDPOINT,
    {
      params: cleanParams(params),
    },
  );

  return response.data;
};

const getApplicationById = async (id: string): Promise<Application> => {
  const response = await api.get<GetApplicationResponse>(
    `${APPLICATIONS_ENDPOINT}/${id}`,
  );

  return response.data.data;
};

const createApplication = async (
  input: CreateApplicationInput,
): Promise<Application> => {
  const response = await api.post<CreateApplicationResponse>(
    APPLICATIONS_ENDPOINT,
    input,
  );

  return response.data.data;
};

const updateApplication = async (
  id: string,
  input: UpdateApplicationInput,
): Promise<Application> => {
  const response = await api.patch<UpdateApplicationResponse>(
    `${APPLICATIONS_ENDPOINT}/${id}`,
    input,
  );

  return response.data.data;
};

const updateApplicationStatus = async (
  id: string,
  input: UpdateApplicationStatusInput,
): Promise<Application> => {
  const response = await api.patch<UpdateApplicationResponse>(
    `${APPLICATIONS_ENDPOINT}/${id}/status`,
    input,
  );

  return response.data.data;
};

const deleteApplication = async (id: string): Promise<void> => {
  await api.delete(`${APPLICATIONS_ENDPOINT}/${id}`);
};

export const applicationService = {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  updateApplicationStatus,
  deleteApplication,
};
