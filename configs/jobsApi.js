import axios from "axios";

// Base URL and API Key for the external API
const API_BASE_URL = "https://jobs-api14.p.rapidapi.com/v2";
const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;

// Headers for all API requests
const headers = {
  "X-RapidAPI-Key": API_KEY,
  "X-RapidAPI-Host": "jobs-api14.p.rapidapi.com",
};

/**
 * Fetch jobs from the API.
 * 
 * @param {Object} params - The query parameters for the job search.
 * @returns {Promise<Object>} - The job search results.
 */
export const fetchJobs = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/list`, {
      headers,
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error.message);
    throw new Error("Failed to fetch jobs.");
  }
};

/**
 * Fetch job titles for a given query.
 * 
 * @param {Object} params - The query parameters for job titles.
 * @returns {Promise<Object>} - The list of job titles.
 */
export const fetchJobTitles = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/salary/getJobTitles`, {
      headers,
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching job titles:", error.message);
    throw new Error("Failed to fetch job titles.");
  }
};

/**
 * Fetch salary range for a specific job title and country.
 * 
 * @param {Object} params - The query parameters for salary range.
 * @returns {Promise<Object>} - The salary range data.
 */
export const fetchSalaryRange = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/salary/getSalaryRange`, {
      headers,
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching salary range:", error.message);
    throw new Error("Failed to fetch salary range.");
  }
};
