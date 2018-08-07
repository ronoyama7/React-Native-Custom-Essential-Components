import { LIST_SHOWCASE } from './types';
import { apiRequest } from '../api';

export const fetchShowcaseSuccess = (data) => {
  return {
    type: LIST_SHOWCASE,
    payload: data,
  };
};

export function fetchAllShowcase() {
  return (dispatch) => {
    apiRequest('get', 'favorite')
      .then((response) => {
        // if (!response.ok) {
        //   throw Error(response.statusText);
        // }
        

        // return response;
      })
      .catch((error) => {
      });
  };
}
