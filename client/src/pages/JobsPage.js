import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaSearch,
} from "react-icons/fa";
import "../css/Jobs.css";
import api from "../api";

function JobsPage() {
   const [jobs, setJobs] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [searchTerm, setSearchTerm] = useState("");
   const [filters, setFilters] = useState({
     location: "",
     salary: "",
     type: "",
   });
   const navigate = useNavigate();

   useEffect(() => {
     const fetchJobs = async () => {
       try {
         const response = await api.get("/jobs"); 
         setJobs(response.data);
       } catch (err) {
         setError(err.message || "Failed to fetch jobs");
         console.error("Error fetching jobs:", err);
       } finally {
         setLoading(false);
       }
     };

     fetchJobs();
   }, []);

   const handleApply = (jobId) => {
     navigate(`/apply/${jobId}`);
   };

   const handleSearch = (e) => {
     setSearchTerm(e.target.value);
   };

   const handleFilterChange = (e) => {
     const { name, value } = e.target;
     setFilters((prev) => ({
       ...prev,
       [name]: value,
     }));
   };

   const filteredJobs = jobs.filter((job) => {
       const matchesSearch =
           job?.title?.toLowerCase().includes(searchTerm.toLowerCase());
     const matchesLocation = filters.location
       ? job?.location === filters.location
       : true;
     const matchesType = filters.type ? job.type === filters.type : true;

     return matchesSearch && matchesLocation && matchesType;
   });

   if (loading) return <div className="loading">Loading jobs...</div>;
   if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <h1>Available Jobs</h1>
        <p>Find your next career opportunity</p>
      </div>

      <div className="search-filter-container">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by job title"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="filters">
          <select
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
          >
            <option value="">All Locations</option>
            <option value="Remote">Remote</option>
            <option value="New York">New York</option>
            <option value="San Francisco">San Francisco</option>
            <option value="London">London</option>
          </select>

          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
      </div>

      <div className="jobs-list">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-info">
                <h3>{job.title}</h3>
                <p className="company">{job.company}</p>

                <div className="job-meta">
                  <span>
                    <FaMapMarkerAlt /> {job.location}
                  </span>
                  <span>
                    <FaMoneyBillWave /> {job.salary}
                  </span>
                  <span>
                    <FaClock /> {job.type}
                  </span>
                </div>

                <p className="job-description">
                  {job.description.length > 150
                    ? `${job.description.substring(0, 150)}...`
                    : job.description}
                </p>
              </div>

              <div className="job-actions">
                <button
                  onClick={() => handleApply(job.id)}
                  className="apply-button"
                >
                  Apply Now
                </button>
                <button className="save-button">Save</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-jobs">
            <h3>No jobs found matching your criteria</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobsPage;
