
const apiUrl = 'http://localhost:8080/api';

export const apiRequest = (method, path, options) => {
  return fetch(`${apiUrl}/${path}`, method, options)
    .then((response) => {
      return response.json().then((json) => {
        return response.success ? json : Promise.reject(json);
      });
    });
};
