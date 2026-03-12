import { useState } from 'react';
import Navbar from '../components/Navbar';
import { getCareerRoadmap } from '../services/api';
import './CareerRoadmap.css';

export default function CareerRoadmap() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await getCareerRoadmap();
      setRoadmap(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate roadmap');
    } finally {
      setLoading(false);
    }
  };

  const priorityColor = (p) => {
    switch (p?.toLowerCase()) {
      case 'high': return 'tag-danger';
      case 'medium': return 'tag-warning';
      default: return 'tag-primary';
    }
  };

  return (
    <>
      <Navbar />
      <div className="page fade-in">
        <h1 className="page-title">🗺️ Career Roadmap</h1>
        <p className="page-subtitle">Get AI-powered career path recommendations based on your resume.</p>

        {error && <div className="alert alert-error">{error}</div>}

        {!roadmap && !loading && (
          <div className="card" style={{ textAlign: 'center', padding: 48 }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
              Make sure you've uploaded a resume first, then click below to generate your personalized career roadmap.
            </p>
            <button className="btn btn-primary" onClick={handleGenerate}>
              🤖 Generate Career Roadmap
            </button>
          </div>
        )}

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>AI is analyzing your career potential...</p>
          </div>
        )}

        {roadmap && (
          <div className="roadmap-results fade-in">
            {/* Current Profile */}
            {roadmap.current_profile && (
              <div className="card" style={{ marginBottom: 20 }}>
                <h3 className="card-title">👤 Your Profile</h3>
                <p className="result-text">{roadmap.current_profile}</p>
              </div>
            )}

            {/* Transferable Skills */}
            {roadmap.transferable_skills?.length > 0 && (
              <div className="card" style={{ marginBottom: 20 }}>
                <h3 className="card-title">🔄 Transferable Skills</h3>
                <div className="tags">
                  {roadmap.transferable_skills.map((s, i) => (
                    <span key={i} className="tag tag-success">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Paths */}
            {roadmap.recommended_paths?.length > 0 && (
              <>
                <h2 className="section-title">🎯 Recommended Career Paths</h2>
                <div className="grid-2" style={{ marginBottom: 24 }}>
                  {roadmap.recommended_paths.map((p, i) => (
                    <div key={i} className="card career-path-card">
                      <div className="career-path-header">
                        <h3 className="card-title">{p.role}</h3>
                        {p.match_score && (
                          <span className="match-badge">{p.match_score}% match</span>
                        )}
                      </div>
                      <p className="result-text">{p.description}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Upskilling Plan */}
            {roadmap.upskilling_plan?.length > 0 && (
              <>
                <h2 className="section-title">📋 Upskilling Plan</h2>
                <div className="card">
                  <div className="upskill-list">
                    {roadmap.upskilling_plan.map((item, i) => (
                      <div key={i} className="upskill-item">
                        <span className={`tag ${priorityColor(item.priority)}`}>{item.priority || 'Medium'}</span>
                        <div>
                          <strong>{item.skill}</strong>
                          {item.resource && <p className="result-text">{item.resource}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <button className="btn btn-outline" style={{ marginTop: 24 }} onClick={handleGenerate}>
              🔄 Regenerate Roadmap
            </button>
          </div>
        )}
      </div>
    </>
  );
}
