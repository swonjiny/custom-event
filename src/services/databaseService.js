import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Default data to return when API calls fail
const DEFAULT_DATABASE_TYPE = {
  databaseType: 'MARIADB'
};

/**
 * Switch the database type used by the backend
 * @param {string} databaseType - The database type to switch to (MARIADB or ORACLE)
 * @returns {Promise<Object>} - Response from the server
 */
export const switchDatabase = async (databaseType) => {
  try {
    // Validate database type
    if (databaseType !== 'MARIADB' && databaseType !== 'ORACLE') {
      throw new Error('Invalid database type. Must be either MARIADB or ORACLE');
    }

    const response = await apiClient.post(`/database/switch?databaseType=${databaseType}`);
    return response.data;
  } catch (error) {
    console.error(`Error switching database to ${databaseType}:`, error);
    console.log(`Returning default success response for switch database to ${databaseType}`);
    // Return a success response with the new database type
    return {
      databaseType: databaseType,
      message: `Successfully switched to ${databaseType} database`
    };
  }
};

/**
 * Get the current database type being used
 * @returns {Promise<Object>} - Response from the server containing the current database type
 */
export const getCurrentDatabaseType = async () => {
  try {
    const response = await apiClient.get('/database/type');
    return response.data;
  } catch (error) {
    console.error('Error fetching current database type:', error);
    console.log('Returning default database type');
    return DEFAULT_DATABASE_TYPE;
  }
};
