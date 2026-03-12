import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';

  const features = [
    {
      icon: '📄',
      title: 'Resume Analysis',
      desc: 'Upload your resume and get AI-powered insights on skills, strengths, and improvement areas.',
      path: '/resume',
      color: 'var(--primary)',
    },
    {
      icon: '🎯',
      title: 'Mock Interview',
      desc: 'Practice with AI-generated interview questions and receive detailed evaluation feedback.',
      path: '/interview',
      color: 'var(--accent)',
    },
    {
      icon: '🗺️',
      title: 'Career Roadmap',
      desc: 'Discover personalized career paths and get an actionable upskilling plan.',
      path: '/career',
      color: 'var(--success)',
    },
    {
      icon: '🚀',
      title: 'Deep AI Analysis',
      desc: 'Run a full agentic pipeline to get a 360° career check, skill gaps, and roadmap in one click.',
      path: '/analysis',
      color: 'var(--primary-light)',
      featured: true,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="page fade-in">
        <div className="dashboard-welcome">
          <h1 className="page-title">Welcome back, {userName}! 👋</h1>
          <p className="page-subtitle">
            Your AI-powered learning companion. Choose a feature to get started.
          </p>
        </div>

        <div className="grid-3">
          {features.map((f) => (
            <div
              key={f.title}
              className={`card dashboard-feature-card ${f.featured ? 'featured' : ''}`}
              onClick={() => navigate(f.path)}
              style={{ cursor: 'pointer' }}
            >
              <span className="dashboard-feature-icon">{f.icon}</span>
              <h3 className="card-title">{f.title}</h3>
              <p className="dashboard-feature-desc">{f.desc}</p>
              <span className="btn btn-outline btn-sm" style={{ marginTop: 12 }}>
                Get Started →
              </span>
            </div>
          ))}
        </div>

        <div className="dashboard-info card" style={{ marginTop: 32 }}>
          <h3 className="card-title">🤖 How VidyaMitra Works</h3>
          <div className="dashboard-steps">
            <div className="dashboard-step">
              <span className="step-num">1</span>
              <p>Upload your resume (PDF/DOCX)</p>
            </div>
            <div className="dashboard-step">
              <span className="step-num">2</span>
              <p>AI agents analyze skills & detect gaps</p>
            </div>
            <div className="dashboard-step">
              <span className="step-num">3</span>
              <p>Get career recommendations & interview prep</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
