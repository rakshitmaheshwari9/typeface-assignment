import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Interceptor token:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/signin', { email, password });
    console.log('Login response:', response.data);
    const result = {
      user: response.data.user,
      token: response.data.accessToken,
      refreshToken: response.data.refreshToken
    };
    console.log('Structured login result:', result);
    return result;
  },
  signup: async (username: string, email: string, password: string) => {
    const response = await api.post('/user', { username, email, password });
    return {
      user: response.data,
      token: response.data.accessToken,
      refreshToken: response.data.refreshToken
    };
  },
};

export const fileAPI = {
  getFiles: async (page: number = 1, limit: number = 10) => {
    const response = await api.get(`/files?page=${page}&limit=${limit}`);
    return response.data;
  },
  uploadFile: async (file: File) => {
    const presignedUrlResponse = await api.post('/files/presigned-url', {
      filename: file.name,
      contentType: file.type,
      filesize: file.size
    });
    const { uploadUrl, fileId } = presignedUrlResponse.data;

    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });

    return { fileId };
  },
  previewFile: async (fileId: string) => {
    const response = await api.get(`/files/${fileId}/url`);
    return response.data.url;
  },
  deleteFile: async (fileId: string) => {
    const response = await api.delete(`/files/${fileId}`);
    return response.data;
  },
};

export default api; 