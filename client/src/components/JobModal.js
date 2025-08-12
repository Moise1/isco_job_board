import React, { useEffect, useState } from "react";
import { FaTimes, FaPaperclip } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { submitJobApplication, reset } from "../redux/applicationsSlice";
import { toast } from "react-toastify";


function JobModal({ job, onClose, onSubmit }) {

    const dispatch = useDispatch();

  const [coverLetter, setCoverLetter] = useState("");
  const [cvLink, setCvLink] = useState("");

  const { loading, error, success, message } = useSelector(
    (state) => state.jobApplication
  );
  
    const handleSubmit = (e) => {
      e.preventDefault();
      dispatch(submitJobApplication({
        job_id: job.id,
        cover_letter: coverLetter,
        cv_link: cvLink
      }));
    };

   useEffect(() => {
     if (success) {
      toast.success(message || "Application submitted!");
      dispatch(reset());
      onClose();
     }
   }, [success, dispatch, onClose]);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="bg-white h-full w-full max-w-lg flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            Apply for {job.title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="position-details">
              <ul>
                <li>
                  <strong>Location:</strong> {job.location}
                </li>
                <li>
                  <strong>Salary:</strong> ${job.max_salary}
                </li>
              </ul>
            </div>
            {/* Cover Letter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Letter
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Explain why you're the best fit for this position..."
                rows={8}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>

            {/* CV/Resume */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CV/Resume Link
              </label>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                <FaPaperclip className="text-gray-400 mr-2" />
                <input
                  type="text"
                  value={cvLink}
                  onChange={(e) => setCvLink(e.target.value)}
                  placeholder="Paste a link to your CV/Resume"
                  required
                  className="flex-1 focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            {error && <p className="text-red-600">{error}</p>}

            
            {/* Modal Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default JobModal;
