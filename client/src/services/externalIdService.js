// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000';

// const externalIdService = {
//   generateExternalId: async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/generate-external-id`);
//       return response.data.external_id;
//     } catch (error) {
//       throw error.response?.data || { message: 'Failed to generate external ID' };
//     }
//   },

//   validateARN: async (arn, externalId) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/validate-arn`, {
//         aws_arn: arn,
//         external_id: externalId
//       });
//       return response.data.valid;
//     } catch (error) {
//       throw error.response?.data || { message: 'Failed to validate ARN' };
//     }
//   }
// };

// export default externalIdService;


// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:2000';

// const externalIdService = {
//   generateExternalId: async () => {
//     const token = localStorage.getItem('authToken');
//     const response = await axios.post(
//       `${API_BASE_URL}/generate-external-id`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return response.data.external_id;
//   },

//   submitArn: async (aws_arn) => {
//     const token = localStorage.getItem('authToken');
//     const response = await axios.post(
//       `${API_BASE_URL}/submit-arn`,
//       { aws_arn },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return response.data;
//   }
// };

// export default externalIdService;



import axios from 'axios';

const API_BASE_URL = 'http://localhost:2000';

const externalIdService = {
  generateExternalId: async () => {
    const token = localStorage.getItem('authToken');
    const response = await axios.post(
      `${API_BASE_URL}/generate-external-id`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.external_id;
  },

  // Add this function:
  validateARN: async (aws_arn) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.post(
        `${API_BASE_URL}/submit-arn`,
        { aws_arn },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // If the backend returns 200, it's valid
      return true;
    } catch (error) {
      // If the backend returns 400/500, it's invalid
      return false;
    }
  }
};

export default externalIdService;