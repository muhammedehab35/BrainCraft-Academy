import axios from "axios";

const API_BASE_URL = "https://jobs-api14.p.rapidapi.com/v2";
const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;

const headers = {
  "X-RapidAPI-Key": API_KEY,
  "X-RapidAPI-Host": "jobs-api14.p.rapidapi.com",
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { endpoint, ...params } = req.query; // Extract query parameters
      const response = await axios.get(`${API_BASE_URL}/${endpoint}`, {
        headers,
        params,
      });
      res.status(200).json(response.data);
    } catch (error) {
      res
        .status(error.response?.status || 500)
        .json({ error: error.message || "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
