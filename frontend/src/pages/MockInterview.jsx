import { useState } from 'react';
import Navbar from '../components/Navbar';
import { generateInterview, evaluateAnswer } from '../services/api';
import './MockInterview.css';

const JOB_ROLES = [
  'Software Engineer', 'Data Scientist', 'Product Manager',
  'Frontend Developer', 'Backend Developer', 'DevOps Engineer',
  'Machine Learning Engineer', 'Full Stack Developer', 'UI/UX Designer',
];

export default function MockInterview() {
  const [role, setRole] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentQ, setCurrentQ] = useState(null);
  const [answer, setAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setError('');
    setLoading(true);
    setQuestions([]);
    setCurrentQ(null);
    setEvaluation(null);
    try {
      const { data } = await generateInterview({ job_role: role, num_questions: 5 });
      setQuestions(data.questions || []);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async () => {
    if (!answer.trim()) return;
    setEvaluating(true);
    setError('');
    try {
      const { data } = await evaluateAnswer({
        job_role: role,
        question: currentQ.question,
        answer,
      });
      setEvaluation(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Evaluation failed');
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page fade-in">
        <h1 className="page-title">🎯 Mock Interview</h1>
        <p className="page-subtitle">Practice with AI-generated interview questions and get instant feedback.</p>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Role Selector */}
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 className="card-title">Select Job Role</h3>
          <div className="role-grid">
            {JOB_ROLES.map((r) => (
              <button
                key={r}
                className={`role-chip ${role === r ? 'active' : ''}`}
                onClick={() => setRole(r)}
              >
                {r}
              </button>
            ))}
          </div>
          <button
            className="btn btn-primary"
            style={{ marginTop: 16 }}
            onClick={handleGenerate}
            disabled={!role || loading}
          >
            {loading ? 'Generating...' : '🤖 Generate Questions'}
          </button>
        </div>

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>AI is preparing interview questions...</p>
          </div>
        )}

        {/* Questions List */}
        {questions.length > 0 && !currentQ && (
          <div className="card fade-in">
            <h3 className="card-title">Interview Questions</h3>
            <div className="question-list">
              {questions.map((q, i) => (
                <div key={i} className="question-item" onClick={() => { setCurrentQ(q); setAnswer(''); setEvaluation(null); }}>
                  <span className="question-num">{i + 1}</span>
                  <div>
                    <p className="question-text">{q.question}</p>
                    {q.category && <span className="tag tag-primary">{q.category}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Answer & Evaluate */}
        {currentQ && (
          <div className="card fade-in">
            <button className="btn btn-outline btn-sm" onClick={() => { setCurrentQ(null); setEvaluation(null); }} style={{ marginBottom: 16 }}>
              ← Back to Questions
            </button>
            <h3 className="card-title">{currentQ.question}</h3>
            {currentQ.category && <span className="tag tag-primary" style={{ marginBottom: 16, display: 'inline-block' }}>{currentQ.category}</span>}

            <div className="form-group">
              <label>Your Answer</label>
              <textarea
                className="form-input"
                rows={5}
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>

            <button className="btn btn-primary" onClick={handleEvaluate} disabled={evaluating || !answer.trim()}>
              {evaluating ? 'Evaluating...' : '🤖 Evaluate Answer'}
            </button>

            {evaluating && (
              <div className="loading-container" style={{ padding: '24px 0' }}>
                <div className="spinner"></div>
                <p>AI is evaluating your answer...</p>
              </div>
            )}

            {/* Evaluation Results */}
            {evaluation && (
              <div className="evaluation-results fade-in">
                <h3 className="section-title" style={{ marginTop: 24 }}>📊 Evaluation</h3>

                <div className="score-bar">
                  <span className="score-bar-label">Communication</span>
                  <div className="score-bar-track">
                    <div className="score-bar-fill" style={{ width: `${(evaluation.communication_score || 0) * 10}%` }}></div>
                  </div>
                  <span className="score-bar-value">{evaluation.communication_score}/10</span>
                </div>

                <div className="score-bar">
                  <span className="score-bar-label">Confidence</span>
                  <div className="score-bar-track">
                    <div className="score-bar-fill" style={{ width: `${(evaluation.confidence_score || 0) * 10}%` }}></div>
                  </div>
                  <span className="score-bar-value">{evaluation.confidence_score}/10</span>
                </div>

                <div className="score-bar">
                  <span className="score-bar-label">Accuracy</span>
                  <div className="score-bar-track">
                    <div className="score-bar-fill" style={{ width: `${(evaluation.accuracy_score || 0) * 10}%` }}></div>
                  </div>
                  <span className="score-bar-value">{evaluation.accuracy_score}/10</span>
                </div>

                {evaluation.feedback && (
                  <div style={{ marginTop: 16 }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: 8 }}>Feedback</h4>
                    <p className="result-text">{evaluation.feedback}</p>
                  </div>
                )}

                {evaluation.suggestions?.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: 8 }}>Improvement Suggestions</h4>
                    <ul className="resource-list">
                      {evaluation.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
