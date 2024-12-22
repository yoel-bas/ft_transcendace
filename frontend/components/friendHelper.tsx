import { axiosInstance } from '@/utils/axiosInstance';
import { getCookies } from './auth';
import axios from 'axios';
import { toast } from 'react-toastify';

export const fetchSearchResults = async (
    searchInput: string,
    setSearchResults: (data: any) => void,
    setSearchLoading: (loading: boolean) => void,
) => {
    try {
      setSearchLoading(true);
      const res = await axiosInstance.get(`auth/users/`, {
        params: {
          search: searchInput
        }
      });
      setSearchResults(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setSearchLoading(false);
    }
  }
  
  export const handleBlock = async (
    username: string,
    setIsUpdate: (update: boolean) => void
  ) => {
    const body = {
      username: username
    }
    try {
      const cookies = await getCookies();
      const csrfToken = cookies.cookies.csrftoken;
      const response = await axios.post('https://localhost/api/auth/block/', body, {
        headers: {
          "Content-Type": "application/json",
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        setIsUpdate(true);
        toast.success("User blocked successfully")
      }
    } catch (error) {
      toast.error(error.response.data.error)
    }
  }

  export const handleUnblock = async (
    username: string,
    setIsUpdate: (update: boolean) => void
  ) => {
    const body = {
      username: username
    }
    try {
      const cookies = await getCookies();
      const csrfToken = cookies.cookies.csrftoken;
      const response = await axios.post('https://localhost/api/auth/unblock/', body, {
        headers: {
          "Content-Type": "application/json",
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        setIsUpdate(true);
        toast.success("User unblocked successfully")
      }
    } catch (error) {
      toast.error(error.response.data.error)
    }
  }

  export const getFriends = async () => {
    try {
        const res = await axiosInstance.get('auth/get-friends/')
        if (res.status === 200) {
            return res.data
        }
    } catch (error) {
        console.log(error)
    }
}