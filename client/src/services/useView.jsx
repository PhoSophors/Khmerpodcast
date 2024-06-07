import axios from 'axios';
import { api_url } from '../api/config';

export default function useView() {
  const incrementPlayCount = async (fileId) => {
    try {
      await axios.patch(`${api_url}/podcasts-count-view/incrementPlayCount/${fileId}`);
    } catch (err) {
      console.error(err);
    }
  }

  const incrementViewCount = async (fileId) => {
    try {
      await axios.patch(
        `${api_url}/podcasts-count-view/incrementViewCount/${fileId}`
      );
    } catch (err) {
      console.error(err);
    }
  }

  return { incrementPlayCount, incrementViewCount };
}