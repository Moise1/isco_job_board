import React, { useState } from "react";
import { FaTimes, FaPaperclip } from "react-icons/fa";
import "../css/JobModal.css";

function JobModal({ job, onClose, onSubmit }) {
  const [coverLetter, setCoverLetter] = useState("");
  const [cvLink, setCvLink] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      jobId: job.id,
      coverLetter,
      cvLink,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Apply for {job.title}</h3>
          <button onClick={onClose} className="close-button">
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Cover Letter</label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Explain why you're the best fit for this position..."
                rows={8}
                required
              />
            </div>

            <div className="form-group">
              <label>CV/Resume Link</label>
              <div className="file-input-group">
                <FaPaperclip className="file-icon" />
                <input
                  type="text"
                  value={cvLink}
                  onChange={(e) => setCvLink(e.target.value)}
                  placeholder="Paste a link to your CV/Resume"
                  required
                />
              </div>
              <p className="hint-text">Or upload a file below</p>
              <input
                type="file"
                id="resume-upload"
                accept=".pdf,.doc,.docx"
                className="file-upload"
              />
              <label htmlFor="resume-upload" className="upload-button">
                Choose File
              </label>
            </div>

            <div className="modal-actions">
              <button type="button" onClick={onClose} className="cancel-button">
                Cancel
              </button>
              <button type="submit" className="submit-button">
                Submit Proposal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default JobModal;
