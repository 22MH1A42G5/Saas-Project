import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const externalIdService = {
  generateExternalId: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/generate-external-id`);
      return response.data.external_id;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to generate external ID' };
    }
  },

  validateARN: async (arn, externalId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/validate-arn`, {
        aws_arn: arn,
        external_id: externalId
      });
      return response.data.valid;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to validate ARN' };
    }
  }
};

export default externalIdService;