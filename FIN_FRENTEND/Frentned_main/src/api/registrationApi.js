import axios from "axios";
import { API_BASE } from "lib/config";
import { getAuthorizationHeader } from "src/utils/authToken";

const getAuthHeaders = () => {
  return {
    headers: {
      Authorization: getAuthorizationHeader(),
      "Content-Type": "application/json",
    },
  };
};

export const registrationApi = {
  loadUsers() {
    return axios.get(`${API_BASE}/users/loadAll`, getAuthHeaders());
  },

  loadPermissions() {
    return axios.get(`${API_BASE}/permissions`, getAuthHeaders());
  },

  saveUser(payload) {
    return axios.post(`${API_BASE}/users`, payload, getAuthHeaders());
  },

  updateUser(payload) {
    return axios.put(`${API_BASE}/users`, payload, getAuthHeaders());
  },

  deleteUser(id) {
    return axios.delete(`${API_BASE}/users/${id}`, getAuthHeaders());
  },
};

export default registrationApi;
