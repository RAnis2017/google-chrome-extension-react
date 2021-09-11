import React, { useState, useEffect } from 'react';
import './Popup.css';

const Popup = () => {
  const [searchJobs, setSearchJobs] = useState([]);

  useEffect(() => {
    console.log('Company Searches', searchJobs)
    chrome.storage.local.get(['searchJobs'], (item) => {
      console.log('Company Searches', item)
      setSearchJobs(item.searchJobs[0])
    })
  }, []);

  return (
    <div className="App">
      <h1 className="title">Organization Chart</h1>
      <a href="/company.html" className="btn btn-primary btn-sm" target="_blank">New Mapping</a>
      {
        searchJobs.map((job, index) => (
          <div className="card mt-3" key={index} style={{ "width": "18rem;" }}>
            <div className="card-body">
              <h5 className="card-title">{job.label}</h5>
              <h6 className="card-subtitle mb-2 text-muted">ID: {job.id}</h6>
              <a href={"/company.html?selectedJob=" + job.id} target="_blank" className="card-link">Check Results</a>
              <a href={"/company.html?runJob=true&selectedJob=" + job.id} target="_blank" className="card-link">Run Job</a>
            </div>
          </div>
        ))
      }

    </div>
  );
};

export default Popup;
