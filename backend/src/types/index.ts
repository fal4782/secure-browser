import { Container } from 'dockerode';

export interface ContainerInfo {
  container: Container;
  vncPort: string;
  url: string;
  createdAt: Date;
  timeoutId: NodeJS.Timeout;
}

export interface CreateContainerResponse {
  containerId: string;
  vncPort: string;
  vncUrl: string;
}

export interface ContainerSummary {
  containerId: string;
  url: string;
  vncPort: string;
  createdAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CreateContainerRequest {
  url: string;
}

export interface OpenUrlRequest {
  url: string;
}