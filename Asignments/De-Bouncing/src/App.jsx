import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [query, setQuery] = useState("");
  const [debounce, setDebounce] = useState("");

  const jobOpenings = [
    {
      brandLogo: "https://pngimg.com/uploads/meta/meta_PNG12.png",
      companyName: "Meta",
      datePosted: "5 days ago",
      post: "Frontend Engineer",
      tag1: "Full Time",
      tag2: "Junior Level",
      pay: "$65/hour",
      location: "Menlo Park, USA",
    },
    {
      brandLogo:
        "https://static.vecteezy.com/system/resources/previews/014/018/561/non_2x/amazon-logo-on-transparent-background-free-vector.jpg",
      companyName: "Amazon",
      datePosted: "2 weeks ago",
      post: "Backend Developer",
      tag1: "Full Time",
      tag2: "Mid Level",
      pay: "$70/hour",
      location: "Hyderabad, India",
    },
    {
      brandLogo:
        "https://substackcdn.com/image/fetch/$s_!G1lk!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8ed3d547-94ff-48e1-9f20-8c14a7030a02_2000x2000.jpeg",
      companyName: "Apple",
      datePosted: "3 weeks ago",
      post: "iOS Developer",
      tag1: "Part Time",
      tag2: "Senior Level",
      pay: "$90/hour",
      location: "Cupertino, USA",
    },
    {
      brandLogo:
        "https://images.ctfassets.net/4cd45et68cgf/Rx83JoRDMkYNlMC9MKzcB/2b14d5a59fc3937afd3f03191e19502d/Netflix-Symbol.png?w=700&h=456",
      companyName: "Netflix",
      datePosted: "10 days ago",
      post: "Machine Learning Engineer",
      tag1: "Full Time",
      tag2: "Senior Level",
      pay: "$110/hour",
      location: "Los Gatos, USA",
    },
    {
      brandLogo:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png",
      companyName: "Google",
      datePosted: "1 week ago",
      post: "Cloud Solutions Architect",
      tag1: "Full Time",
      tag2: "Mid Level",
      pay: "$85/hour",
      location: "Bangalore, India",
    },
    {
      brandLogo:
        "https://download.logo.wine/logo/Microsoft_Store/Microsoft_Store-Logo.wine.png",
      companyName: "Microsoft",
      datePosted: "4 weeks ago",
      post: "Data Scientist",
      tag1: "Full Time",
      tag2: "Junior Level",
      pay: "$75/hour",
      location: "Redmond, USA",
    },
    {
      brandLogo:
        "https://blog.logomaster.ai/hs-fs/hubfs/ibm-logo-1967.jpg?width=672&height=454&name=ibm-logo-1967.jpg",
      companyName: "IBM",
      datePosted: "2 days ago",
      post: "AI Research Engineer",
      tag1: "Full Time",
      tag2: "Senior Level",
      pay: "$95/hour",
      location: "New York, USA",
    },
    {
      brandLogo:
        "https://www.pngplay.com/wp-content/uploads/13/Tesla-Logo-PNG-HD-Quality.png",
      companyName: "Tesla",
      datePosted: "6 days ago",
      post: "Software Engineer",
      tag1: "Full Time",
      tag2: "Mid Level",
      pay: "$80/hour",
      location: "Austin, USA",
    },
    {
      brandLogo:
        "https://www.nvidia.com/content/dam/en-zz/Solutions/about-nvidia/logo-and-brand/nvidia-og-image-white-bg-1200x630.jpg",
      companyName: "NVIDIA",
      datePosted: "3 weeks ago",
      post: "GPU Programmer",
      tag1: "Full Time",
      tag2: "Senior Level",
      pay: "$120/hour",
      location: "Santa Clara, USA",
    },
    {
      brandLogo:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnOVjTWaheo4E99cgYZ6y14tpsgHlm0VN8Hw&s",
      companyName: "Oracle",
      datePosted: "8 days ago",
      post: "Database Administrator",
      tag1: "Full Time",
      tag2: "Mid Level",
      pay: "$70/hour",
      location: "Mumbai, India",
    },
    {
  brandLogo: "https://i.pinimg.com/736x/ee/90/d6/ee90d6ac9c5990148e11ee9a74593e1c.jpg",
  companyName: "Salesforce",
  datePosted: "4 days ago",
  post: "CRM Developer",
  tag1: "Full Time",
  tag2: "Mid Level",
  pay: "$85/hour",
  location: "San Francisco, USA",
},
{
  brandLogo: "https://i.pinimg.com/736x/4d/3c/df/4d3cdf398e946991aa7a3c5c4960f06c.jpg",
  companyName: "Adobe",
  datePosted: "1 week ago",
  post: "UI/UX Designer",
  tag1: "Full Time",
  tag2: "Senior Level",
  pay: "$95/hour",
  location: "Noida, India",
},
{
  brandLogo: "https://i.pinimg.com/1200x/16/38/1f/16381f7c2b21da49b1afb3529c46f41a.jpg",
  companyName: "Spotify",
  datePosted: "6 days ago",
  post: "React Developer",
  tag1: "Full Time",
  tag2: "Junior Level",
  pay: "$60/hour",
  location: "Stockholm, Sweden",
},
{
  brandLogo: "https://i.pinimg.com/736x/ba/dc/df/badcdf66f646cc9afdab9d2632b75c59.jpg",
  companyName: "Intel",
  datePosted: "3 days ago",
  post: "Embedded Systems Engineer",
  tag1: "Full Time",
  tag2: "Mid Level",
  pay: "$88/hour",
  location: "Chennai, India",
},
{
  brandLogo: "https://i.pinimg.com/736x/2c/ea/3e/2cea3e7494f8f6f763216b708c21f4f2.jpg",
  companyName: "Uber",
  datePosted: "9 days ago",
  post: "Mobile App Developer",
  tag1: "Full Time",
  tag2: "Senior Level",
  pay: "$92/hour",
  location: "Bangalore, India",
},
{
  brandLogo: "https://i.pinimg.com/736x/29/f4/c1/29f4c1552e07d47036d352517e2c7a9b.jpg",
  companyName: "Twitter",
  datePosted: "12 days ago",
  post: "Frontend Engineer",
  tag1: "Full Time",
  tag2: "Mid Level",
  pay: "$78/hour",
  location: "San Jose, USA",
},
{
  brandLogo: "https://i.pinimg.com/1200x/05/0a/c9/050ac92cb432973286bbba0b3637f17c.jpg",
  companyName: "Samsung",
  datePosted: "2 weeks ago",
  post: "Android Developer",
  tag1: "Full Time",
  tag2: "Junior Level",
  pay: "$72/hour",
  location: "Seoul, South Korea",
},
{
  brandLogo: "https://i.pinimg.com/1200x/f4/22/30/f42230e621c19fea5815dde7a09ed83c.jpg",
  companyName: "PayPal",
  datePosted: "5 days ago",
  post: "Backend Engineer",
  tag1: "Full Time",
  tag2: "Mid Level",
  pay: "$83/hour",
  location: "Pune, India",
},
{
  brandLogo: "https://i.pinimg.com/736x/c8/dc/e1/c8dce16663e5e2d215231332e9e6287e.jpg",
  companyName: "Accenture",
  datePosted: "1 week ago",
  post: "Cloud Engineer",
  tag1: "Full Time",
  tag2: "Senior Level",
  pay: "$90/hour",
  location: "Gurgaon, India",
},
{
  brandLogo: "https://i.pinimg.com/1200x/7e/87/d1/7e87d170707a6bf88aae1fa5c8514fb0.jpg",
  companyName: "Capgemini",
  datePosted: "3 weeks ago",
  post: "Software Tester",
  tag1: "Full Time",
  tag2: "Junior Level",
  pay: "$55/hour",
  location: "Kolkata, India",
},
  ];

  useEffect(() => {
    const id = setTimeout(() => {
      setDebounce(query);
    }, 500);

    return () => clearTimeout(id);
  }, [query]);

  const filteredJobs = jobOpenings.filter(
    (job) =>
      job.companyName.toLowerCase().includes(debounce.toLowerCase()) ||
      job.post.toLowerCase().includes(debounce.toLowerCase()) ||
      job.location.toLowerCase().includes(debounce.toLowerCase()),
  );

  return (
    <div className="container">
      <h1>🔥 Job Search Portal</h1>

      <input
        type="text"
        placeholder="Search by company, role, location..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search"
      />

      <div className="cardContainer">
        {filteredJobs.map((job, index) => (
          <div className="card" key={index}>
            <img src={job.brandLogo} alt={job.companyName} className="logo" />

            <h2>{job.companyName}</h2>
            <p className="post">{job.post}</p>

            <div className="tags">
              <span>{job.tag1}</span>
              <span>{job.tag2}</span>
            </div>

            <p>💰 {job.pay}</p>
            <p>📍 {job.location}</p>
            <p className="date">{job.datePosted}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
