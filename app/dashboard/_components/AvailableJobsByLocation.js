"use client";

import React, { useState, useEffect } from "react";
import { fetchJobs } from "../../../configs/jobsApi";

export async function getServerSideProps() {
  const location = "Atlanta";
  const query = "Software Developer";

  try {
    const data = await fetchJobs({ location, query });
    return { props: { initialJobs: data.jobs || [] } };
  } catch {
    return { props: { initialJobs: [] } };
  }
}

const AvailableJobsByLocation = ({ initialJobs = [] }) => {
  const [jobs, setJobs] = useState(initialJobs);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to generate a unique key for each job
  const generateUniqueKey = (job, index) => {
    // Create a unique key using multiple job properties and index
    return `${job.id || ''}-${job.title?.replace(/\s+/g, '')}-${job.company?.replace(/\s+/g, '')}-${index}`;
  };

  useEffect(() => {
    const fetchInitialJobs = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchJobs({
          location: "Atlanta",
          query: "Software Developer",
        });
        
        // Remove duplicate jobs based on ID if it exists, or combination of title and company
        const uniqueJobs = data.jobs?.reduce((acc, current) => {
          const isDuplicate = acc.find(job => 
            (job.id && job.id === current.id) || 
            (job.title === current.title && job.company === current.company)
          );
          if (!isDuplicate) {
            acc.push(current);
          }
          return acc;
        }, []) || [];

        setJobs(prev => {
          // Combine previous and new jobs, ensuring no duplicates
          const combined = [...prev, ...uniqueJobs];
          return combined.filter((job, index, self) => 
            index === self.findIndex(j => 
              (j.id && j.id === job.id) || 
              (j.title === job.title && j.company === job.company)
            )
          );
        });
      } catch (err) {
        setError("Failed to fetch jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-2">
            Available Jobs in Atlanta
          </h1>
          <p className="text-gray-600 text-center text-lg">
            Discover Software Developer positions in your area
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-8">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {loading && jobs.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!loading && jobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 text-lg">No jobs available at the moment</p>
            <p className="text-gray-500 mt-2">Please check back later for new opportunities</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <div
                key={generateUniqueKey(job, index)}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6">
                  {/* Job card content remains the same */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                      {job.title}
                    </h3>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full">
                      {job.employmentType || "Full-time"}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-700 font-semibold flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {job.company}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                    </p>
                  </div>

                  <div className="mt-6">
                    <a
                      href={job.jobProviders[0]?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center px-4 py-2 bg-gradient-to-r from-[#875BF7] to-[#7140F0] hover:from-[#7140F0] hover:to-[#5B2BE7] text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-md"
                    >
                      Apply Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {loading && jobs.length > 0 && (
          <div className="text-center mt-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading more jobs...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableJobsByLocation;