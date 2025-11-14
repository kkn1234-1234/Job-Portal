import React, { useState, useEffect } from "react";
import api from "../ap/api";

function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ title:"", company:"", location:"", description:"" });

  useEffect(() => { load(); }, []);

  const load = () => api.get("/jobs").then(res => setJobs(res.data));

  const addJob = () => {
    api.post("/jobs/add", form).then(() => {
      load();
      setForm({ title:"", company:"", location:"", description:"" });
    });
  };

  const deleteJob = (id) => api.delete(`/jobs/delete/${id}`).then(load);

  return (
    <div className="container">
      <h2>Employer Job Dashboard</h2>

      <input placeholder="Job Title" value={form.title} onChange={e => setForm({...form, title:e.target.value})}/>
      <input placeholder="Company" value={form.company} onChange={e => setForm({...form, company:e.target.value})}/>
      <input placeholder="Location" value={form.location} onChange={e => setForm({...form, location:e.target.value})}/>
      <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description:e.target.value})}/>
      <button onClick={addJob}>Add Job</button>

      <h3>Your Jobs</h3>
      {jobs.map(j => (
        <div key={j.id} style={{ margin:"10px", border:"1px solid #ccc", padding:"10px" }}>
          <b>{j.title}</b> — {j.company} ({j.location})
          <button onClick={() => deleteJob(j.id)}>❌ Delete</button>
        </div>
      ))}
    </div>
  );
}

export default EmployerDashboard;
