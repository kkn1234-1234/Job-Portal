import React from "react";

function JobCard({ job }) {
  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <p>{job.company}</p>
      <span>{job.location}</span>
      <button className="btn-outline">Apply Now</button>
    </div>
  );
}

export default JobCard;
