import { useState } from 'react';
import Navbar from '../components/Navbar';
import { fullAnalysis } from '../services/api';
import './FullAnalysis.css';

const JOB_ROLES = [
  'Software Engineer', 'Data Scientist', 'Product Manager',
  'Frontend Developer', 'Backend Developer', 'DevOps Engineer',
  'Full Stack Developer', 'UI/UX Designer',
];

export default function FullAnalysis() {
  const [role, setRole] = useState('Software Engineer');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');


  const handleRunPipeline = async () => {
    setError('');
    setLoading(true);
    setResults(null);
    try {
      const { data } = await fullAnalysis(role);
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Deep analysis failed. Make sure a resume is uploaded.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page fade-in">
        <h1 className="page-title">🚀 Deep Agentic Analysis</h1>
        <p className="page-subtitle">Run our full multi-agent pipeline to get a 360° career health check.</p>

        {error && <div className="alert alert-error">{error}</div>}

        {!results && !loading && (
          <div className="card analysis-header-card">
            <h3 className="card-title">Ready to level up?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
              Our AI agents will chain together to analyze your resume, detect skill gaps for your target role, and build a custom roadmap.
            </p>
            
            <div className="form-group" style={{ maxWidth: 400, margin: '0 auto 24px' }}>
              <label>Target Role</label>
              <select className="form-input" value={role} onChange={(e) => setRole(e.target.value)}>
                {JOB_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <button className="btn btn-primary" onClick={handleRunPipeline}>
              🤖 Start Full AI Analysis
            </button>
          </div>
        )}

        {loading && (
          <div className="card fade-in" style={{ textAlign: 'center', padding: 48 }}>
            <div className="status-badge">
              <div className="pulsate"></div>
              <span>AI Pipeline in Progress...</span>
            </div>
            <h2 style={{ marginBottom: 32 }}>Orchestrating AI Agents</h2>
            
            <div style={{ textAlign: 'left', maxWidth: 500, margin: '0 auto' }}>
              <div className="pipeline-step active">
                <h4>1. ResumeAnalysisAgent</h4>
                <p className="page-subtitle" style={{ marginBottom: 0 }}>Extracting skills and experience summary...</p>
              </div>
              <div className="pipeline-step">
                <h4>2. SkillGapAgent</h4>
                <p className="page-subtitle" style={{ marginBottom: 0 }}>Comparing your profile against {role} requirements...</p>
              </div>
              <div className="pipeline-step">
                <h4>3. CareerAdvisorAgent</h4>
                <p className="page-subtitle" style={{ marginBottom: 0 }}>Generating personalized roadmaps and upskilling plan...</p>
              </div>
            </div>
          </div>
        )}

        {results && (
          <div className="full-analysis-results fade-in">
            <div className="analysis-grid">
              {/* Sidebar Summary */}
              <div className="sidebar-sticky">
                <div className="card" style={{ textAlign: 'center' }}>
                  <p className="page-subtitle" style={{ marginBottom: 8 }}>Profile Match</p>
                  <div className="match-score-large">
                    {results.career_roadmap?.recommended_paths?.[0]?.match_score || '??'}%
                  </div>
                  <p style={{ marginTop: 12, fontWeight: 600 }}>{role}</p>
                </div>

                <div className="card">
                  <h4 className="card-title">Quick Links</h4>
                  <ul className="resource-list" style={{ fontSize: '0.85rem' }}>
                    <li><a href="#skills" style={{ color: 'inherit' }}>Detected Skills</a></li>
                    <li><a href="#gaps" style={{ color: 'inherit' }}>Skill Gaps</a></li>
                    <li><a href="#roadmap" style={{ color: 'inherit' }}>Career Paths</a></li>
                    <li><a href="#upskilling" style={{ color: 'inherit' }}>Upskilling Plan</a></li>
                  </ul>
                  <button className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: 16 }} onClick={() => setResults(null)}>
                    New Analysis
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="main-content">
                {/* Resume Analysis */}
                <section id="skills" className="result-section">
                  <h2 className="section-title">🔍 Resume Insights</h2>
                  <div className="card">
                    <h3 className="card-title">Experience Summary</h3>
                    <p className="result-text" style={{ marginBottom: 20 }}>
                      {results.resume_analysis?.experience_summary}
                    </p>
                    <h3 className="card-title">Core Skills Found</h3>
                    <div className="tags">
                      {results.resume_analysis?.detected_skills?.map((s, i) => (
                        <span key={i} className="tag tag-success">{s}</span>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Skill Gaps */}
                <section id="gaps" className="result-section">
                  <h2 className="section-title">⚠️ Gap Analysis</h2>
                  <div className="card">
                    <p className="page-subtitle">Based on industry standards for <strong>{role}</strong>, here's what you might be missing:</p>
                    <div className="tags" style={{ marginBottom: 20 }}>
                      {results.skill_gap?.missing_skills?.map((s, i) => (
                        <span key={i} className="tag tag-warning">{s}</span>
                      ))}
                    </div>
                    <h3 className="card-title">AI Recommendations</h3>
                    <ul className="resource-list">
                      {results.skill_gap?.recommendations?.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                </section>

                {/* Career Roadmap */}
                <section id="roadmap" className="result-section">
                  <h2 className="section-title">🎯 Targeted Career Paths</h2>
                  <div className="grid-2">
                    {results.career_roadmap?.recommended_paths?.map((p, i) => (
                      <div key={i} className="card path-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <h3 className="card-title">{p.role}</h3>
                          <span className="tag tag-primary">{p.match_score}%</span>
                        </div>
                        <p className="result-text">{p.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Upskilling Plan */}
                <section id="upskilling" className="result-section">
                  <h2 className="section-title">📋 Comprehensive Upskilling Plan</h2>
                  <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table className="upskill-table">
                      <thead>
                        <tr>
                          <th>Skill</th>
                          <th>Priority</th>
                          <th>Recommended Resource</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.career_roadmap?.upskilling_plan?.map((u, i) => (
                          <tr key={i}>
                            <td style={{ fontWeight: 600 }}>{u.skill}</td>
                            <td>
                              <span className={`tag ${u.priority?.toLowerCase() === 'high' ? 'tag-danger' : 'tag-warning'}`}>
                                {u.priority}
                              </span>
                            </td>
                            <td className="result-text">{u.resource}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
