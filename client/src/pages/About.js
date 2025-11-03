import React from 'react';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-header">
        <h1>About User Manager</h1>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Technology Stack</h2>
          <div className="tech-details">
            <div className="tech-category">
              <h3>Frontend</h3>
              <ul>
                <li><strong>React</strong> - Component-based UI library</li>
                <li><strong>React Router</strong> - Client-side routing</li>
                <li><strong>Axios</strong> - HTTP client for API requests</li>
                <li><strong>CSS3</strong> - Modern styling and animations</li>
              </ul>
            </div>

            <div className="tech-category">
              <h3>Backend</h3>
              <ul>
                <li><strong>Node.js</strong> - JavaScript runtime</li>
                <li><strong>Express.js</strong> - Web application framework</li>
                <li><strong>MongoDB</strong> - NoSQL database</li>
                <li><strong>Mongoose</strong> - ODM for MongoDB</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>API Endpoints</h2>
          <div className="api-list">
            <div className="api-item">
              <span className="method get">GET</span>
              <code>/api/users</code>
              <span className="description">Get all users</span>
            </div>
            <div className="api-item">
              <span className="method get">GET</span>
              <code>/api/users/:id</code>
              <span className="description">Get user by ID</span>
            </div>
            <div className="api-item">
              <span className="method get">GET</span>
              <code>/api/health</code>
              <span className="description">Server health</span>
            </div>
            <div className="api-item">
              <span className="method post">POST</span>
              <code>/api/users</code>
              <span className="description">Create new user</span>
            </div>
            <div className="api-item">
              <span className="method put">PUT</span>
              <code>/api/users/:id</code>
              <span className="description">Update user</span>
            </div>
            <div className="api-item">
              <span className="method delete">DELETE</span>
              <code>/api/users/:id</code>
              <span className="description">Delete user</span>
            </div>
            <div className="api-item">
              <span className="method post">POST</span>
              <code>/api/users/seed</code>
              <span className="description">Seed database</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
