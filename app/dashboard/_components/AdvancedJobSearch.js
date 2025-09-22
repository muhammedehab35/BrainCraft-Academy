// JobSearch.js
"use client";

import React, { useState, useEffect, useRef } from "react";
import { fetchJobs } from "../../../configs/jobsApi";

// Custom hook to manage suggestions for job titles and locations
const useSuggestions = (type) => {
  // Sample suggestion data - in a production environment, this could come from an API
  const jobTitles = [
    "Software Engineer",
    "Product Manager",
    "Data Scientist",
    "UX Designer",
    "Frontend Developer",
    "Backend Developer",
    "DevOps Engineer",
    "Project Manager",
    "Marketing Manager",
    "Sales Representative",
    "Full Stack Developer",
    "Business Analyst",
    "Quality Assurance Engineer",
    "Cloud Architect",
    "AI/ML Engineer"
  ];

  const locations = [
    "New York, NY",
    "San Francisco, CA",
    "Austin, TX",
    "Seattle, WA",
    "Boston, MA",
    "Chicago, IL",
    "Remote",
    "Los Angeles, CA",
    "Denver, CO",
    "Atlanta, GA",
    "Portland, OR",
    "Miami, FL",
    "Dallas, TX",
    "Washington, DC",
    "Philadelphia, PA"
  ];

  // Function to filter suggestions based on user input
  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const suggestions = type === 'query' ? jobTitles : locations;
    
    return inputValue.length === 0
      ? []
      : suggestions.filter(item =>
          item.toLowerCase().includes(inputValue)
        ).slice(0, 8); // Limit to 8 suggestions for better UX
  };

  return { getSuggestions };
};

// Main component for the advanced job search functionality
const AdvancedJobSearch = ({ onSearch }) => {
  // State management for form inputs and UI state
  const [searchParams, setSearchParams] = useState({ query: "", location: "" });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState({ query: [], location: [] });
  const [activeSuggestionField, setActiveSuggestionField] = useState(null);
  
  // Refs for handling click outside suggestion boxes
  const suggestionRefs = useRef({ query: null, location: null });

  // Initialize suggestion handlers
  const { getSuggestions: getJobSuggestions } = useSuggestions('query');
  const { getSuggestions: getLocationSuggestions } = useSuggestions('location');

  // Effect to handle clicks outside suggestion boxes
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionRefs.current.query && 
        !suggestionRefs.current.query.contains(event.target) &&
        suggestionRefs.current.location && 
        !suggestionRefs.current.location.contains(event.target)
      ) {
        setActiveSuggestionField(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle input changes and update suggestions
  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setSearchParams(prev => ({ ...prev, [field]: value }));
    
    const newSuggestions = field === 'query' 
      ? getJobSuggestions(value)
      : getLocationSuggestions(value);
    
    setSuggestions(prev => ({ ...prev, [field]: newSuggestions }));
    setActiveSuggestionField(newSuggestions.length > 0 ? field : null);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion, field) => {
    setSearchParams(prev => ({ ...prev, [field]: suggestion }));
    setSuggestions(prev => ({ ...prev, [field]: [] }));
    setActiveSuggestionField(null);
  };

  // Job search function
  const searchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchJobs(searchParams);
      setJobs(data.jobs || []);
      onSearch(true);
    } catch (err) {
      setError("Failed to fetch jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Suggestion box component
  const SuggestionBox = ({ field, suggestions }) => (
    <div
      ref={el => suggestionRefs.current[field] = el}
      className={`absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg overflow-hidden 
        ${activeSuggestionField === field && suggestions.length > 0 ? 'block' : 'hidden'}`}
    >
      <ul className="py-1">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700 text-sm"
            onClick={() => handleSuggestionClick(suggestion, field)}
          >
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  );

  // Job card component
  const JobCard = ({ job }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-200 overflow-hidden group">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#875BF7] transition duration-200">
          {job.title}
        </h3>
        <p className="text-gray-600 font-medium mb-1">{job.company}</p>
        <p className="text-gray-500 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.location}
        </p>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 text-sm font-medium text-[#875BF7] bg-[#875BF7]/10 rounded-full">
            {job.employmentType || "N/A"}
          </span>
        </div>
        <a
          href={job.jobProviders[0]?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center px-4 py-2 bg-gradient-to-r from-[#875BF7] to-[#7140F0] 
            hover:from-[#7140F0] hover:to-[#5B2BE7] text-white font-semibold rounded-lg 
            transition-all duration-200 hover:shadow-md"
        >
          Apply Now
        </a>
      </div>
    </div>
  );

  // Main render
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className=" mx-auto px-4 max-w-6xl">
        {/* Search Form Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Job Title Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                name="query"
                placeholder="Job title or keywords"
                value={searchParams.query}
                onChange={(e) => handleInputChange(e, 'query')}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 
                  focus:ring-[#875BF7] focus:border-transparent transition duration-200 
                  outline-none text-gray-700 placeholder-gray-400"
              />
              <SuggestionBox field="query" suggestions={suggestions.query} />
            </div>

            {/* Location Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                name="location"
                placeholder="City, state, or remote"
                value={searchParams.location}
                onChange={(e) => handleInputChange(e, 'location')}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 
                  focus:ring-[#875BF7] focus:border-transparent transition duration-200 
                  outline-none text-gray-700 placeholder-gray-400"
              />
              <SuggestionBox field="location" suggestions={suggestions.location} />
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={searchJobs}
            disabled={loading}
            className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-[#875BF7] to-[#7140F0] 
              hover:from-[#7140F0] hover:to-[#5B2BE7] text-white font-semibold rounded-lg 
              shadow-md hover:shadow-lg transition duration-200 disabled:opacity-50 
              disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" 
                    stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Searching...
              </span>
            ) : (
              "Search Jobs"
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {/* Empty State
        {jobs.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Start your search to discover available positions
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default AdvancedJobSearch;