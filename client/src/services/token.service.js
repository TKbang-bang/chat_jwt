let token = null;

export const getAccessToken = () => token;

export const setAccessToken = (newToken) => (token = newToken);

export const removeAccessToken = () => (token = null);
