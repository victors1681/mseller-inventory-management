import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { auth } from "../config/firebase";
import { IConfig } from "../types/user";

// Create axios instance
export const restClient: AxiosInstance = axios.create({
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
restClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        if (config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error("Error getting auth token:", error);
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
restClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: any) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const user = auth.currentUser;
        if (user) {
          // Force refresh the token
          const newToken = await user.getIdToken(true);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return restClient(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Optionally redirect to login or sign out user
        // auth.signOut();
      }
    }

    return Promise.reject(error);
  }
);

// Set client URL based on user configuration
export const axiosSetClientUrl = (config?: IConfig, userTestMode?: boolean) => {
  if (config?.serverUrl) {
    if (config.testMode || userTestMode) {
      restClient.defaults.headers.common[
        "X-URL"
      ] = `${config.portalSandboxUrl}:${config.portalSandboxPort}`;
    } else {
      restClient.defaults.headers.common[
        "X-URL"
      ] = `${config.portalServerUrl}:${config.portalServerPort}`;
    }
  }
};

// Utility function to refresh access token
export const refreshAccessToken = async (): Promise<string | undefined> => {
  try {
    const token = await auth.currentUser?.getIdToken(true);
    return token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return undefined;
  }
};

export default restClient;
