import React, { useState,useEffect } from "react";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaSearch,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchJobs,
  setTitleFilter,
  setLocationFilter,
  setSalaryRange,
  clearFilters,
} from "../redux/jobsSlice";
import * as wcc from "world-countries-capitals";

function JobsPage() {
  const dispatch = useDispatch();
  const { filteredJobs, loading, error, filters } = useSelector(
    (state) => state.jobs
  );

  const [locations, setLocations] = useState([]);
  const [salaryRange, setSalaryRange] = useState({
    min: "",
    max: "",
  });

  useEffect(() => {
    dispatch(fetchJobs());

    // Load country/capital options
    const countriesData = wcc.getAllCountryDetails();
    
    const formattedLocations = countriesData.map((item) => ({
      label: `${capitalize(item.capital || "")}, ${capitalize(
        item.country || ""
      )}`,
      value: `${capitalize(item.capital || "")}, ${capitalize(
        item.country || ""
      )}`.toLowerCase(),
    }));

    setLocations(formattedLocations);
  }, [dispatch]);

  const capitalize = (str) => {
    if (!str) return ""; // Add null check
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleTitleSearch = (e) => {
    dispatch(setTitleFilter(e.target.value));
  };

  const handleLocationChange = (e) => {
    dispatch(setLocationFilter(e.target.value));
  };

  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    setSalaryRange((prev) => ({
      ...prev,
      [name]: value ? parseInt(value) : null,
    }));
  };

  const applySalaryFilter = () => {
    dispatch(
      setSalaryRange({
        min: salaryRange.min,
        max: salaryRange.max,
      })
    );
  };

  const resetFilters = () => {
    dispatch(clearFilters());
    setSalaryRange({ min: "", max: "" });
  };

  if (loading) return <div className="loading">Loading jobs...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Available Jobs
        </h1>
        <p className="text-lg text-gray-600">
          Find your next career opportunity
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search Bar - Takes remaining space */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by job title"
              value={filters.title}
              onChange={handleTitleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters - Flex wrap for smaller screens */}
        <div className="flex flex-wrap gap-2">
          {/* Location Filter */}
          <select
            name="location"
            value={filters.location || ""}
            onChange={handleLocationChange}
            className="w-[220px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          >
            <option value="">All Locations</option>
            {locations.map((loc, idx) => (
              <option key={idx} value={loc.value}>
                {loc.label}
              </option>
            ))}
          </select>

          {/* Salary Range */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="min"
              placeholder="Min salary"
              value={salaryRange.min || ""}
              onChange={handleSalaryChange}
              className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              name="max"
              placeholder="Max salary"
              value={salaryRange.max || ""}
              onChange={handleSalaryChange}
              className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={applySalaryFilter}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap"
            >
              Filter
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {job.title}
                </h3>
                <p className="text-primary font-medium">{job.company}</p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <FaMapMarkerAlt className="text-gray-400" /> {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <FaMoneyBillWave className="text-gray-400" /> $
                  {job.min_salary} - ${job.max_salary}
                </span>
                <span className="flex items-center gap-1">
                  <FaBriefcase className="text-gray-400" /> {job.type}
                </span>
              </div>

              <p className="text-gray-700 mb-6">
                {job.description.length > 150
                  ? `${job.description.substring(0, 150)}...`
                  : job.description}
              </p>

              <button className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                Apply Now
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 mb-4">
              No jobs found matching your criteria
            </h3>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobsPage;