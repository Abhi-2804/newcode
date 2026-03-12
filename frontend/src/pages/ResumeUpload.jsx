import { useState } from 'react';
import Navbar from '../components/Navbar';
import { uploadResume, analyzeResume } from '../services/api';
import './ResumeUpload.css';

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      await uploadResume(file);
      setUploaded(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    setError('');
    setAnalyzing(true);
    try {
      const { data } = await analyzeResume();
      setAnalysis(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page fade-in">
        <h1 className="page-title">📄 Resume Analysis</h1>
        <p className="page-subtitle">Upload your resume and let AI agents analyze your skills and experience.</p>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Upload Section */}
        <div className="card upload-card">
          <div className="upload-zone" onClick={() => document.getElementById('file-input').click()}>
            <input
              id="file-input"
              type="file"
              accept=".pdf,.docx,.doc"
              style={{ display: 'none' }}
              onChange={(e) => { setFile(e.target.files[0]); setUploaded(false); setAnalysis(null); }}
            />
            <div className="upload-icon">📁</div>
            <p className="upload-text">
              {file ? file.name : 'Click to select a resume (PDF or DOCX)'}
            </p>
          </div>

          <div className="upload-actions">
            <button className="btn btn-primary" onClick={handleUpload} disabled={!file || uploading}>
              {uploading ? 'Uploading...' : 'Upload Resume'}
            </button>
            {uploaded && (
              <button className="btn btn-primary" onClick={handleAnalyze} disabled={analyzing}>
                {analyzing ? 'Analyzing...' : '🤖 Analyze with AI'}
              </button>
            )}
          </div>
          {uploaded && <div className="alert alert-success">✅ Resume uploaded successfully!</div>}
        </div>

        {/* Loading */}
        {analyzing && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>AI agents are analyzing your resume...</p>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="analysis-results fade-in">
            <h2 className="section-title">🔍 Analysis Results</h2>

            <div className="grid-2">
              <div className="card">
                <h3 className="card-title">✅ Detected Skills</h3>
                <div className="tags">
                  {(analysis.detected_skills || []).map((s, i) => (
                    <span key={i} className="tag tag-success">{s}</span>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="card-title">⚠️ Missing Skills</h3>
                <div className="tags">
                  {(analysis.missing_skills || []).map((s, i) => (
                    <span key={i} className="tag tag-warning">{s}</span>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="card-title">💡 Recommended Skills</h3>
                <div className="tags">
                  {(analysis.recommended_skills || []).map((s, i) => (
                    <span key={i} className="tag tag-primary">{s}</span>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="card-title">📝 Experience Summary</h3>
                <p className="result-text">{analysis.experience_summary || 'N/A'}</p>
              </div>
            </div>

            {analysis.learning_resources?.length > 0 && (
              <div className="card" style={{ marginTop: 20 }}>
                <h3 className="card-title">📚 Learning Resources</h3>
                <ul className="resource-list">
                  {analysis.learning_resources.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
