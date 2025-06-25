export const handleApiError = (error) => {
    if (error.response) {
      // Server responded with error status
      return error.response.data?.message || `Server error: ${error.response.status}`;
    } else if (error.request) {
      // Network error
      return 'Network error: Unable to connect to server. Please check your internet connection.';
    } else {
      // Other error
      return error.message || 'An unexpected error occurred';
    }
  }; 
  
  export const isAuthError = (error) => {
    return error.response?.status === 401 || 
           error.message?.includes('unauthorized') || 
           error.message?.includes('token');
  };