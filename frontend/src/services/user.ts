// user.ts
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

export const getUserProfile = async (username: string) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('No access token found');
  }

  const response = await axios.get(`${API_URL}/user?username=${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};