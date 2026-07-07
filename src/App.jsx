import { useState, useCallback, useEffect } from 'react'
import DecryptedText from './components/DecryptedText'
import CustomCursor from './components/CustomCursor'
import SpectrogramBg from './components/SpectrogramBg'
import './App.css'

const NAV_ITEMS = [
  { id: 'profile', label: 'Profile' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'projects', label: 'Projects' },
]

const SKILLS = [
  { title: 'Core Stack', items: 'Python · PySpark · SQL · Databricks' },
  { title: 'Data Platform', items: 'Delta Lake · Lakehouse · Medallion Architecture · ETL/ELT · REST APIs · DQX · PostgreSQL' },
  { title: 'BI & Visualisation', items: 'Power BI · DAX · Pandas · Star Schema · Dimensional Modelling · KPI Design · Microsoft Fabric' },
  { title: 'Machine Learning', items: 'scikit-learn · XGBoost · Random Forest · MLflow · NLP · sentence-transformers · Feature Engineering' },
  { title: 'Model Evaluation', items: 'Hypothesis Testing · Statistical Analysis · ROC-AUC · F1 · Cross-validation · Confusion Matrix' },
  { title: 'Generative AI', items: 'RAG · LLM APIs · Vector Embeddings · Vertex AI · Hugging Face · Anthropic API' },
  { title: 'Deep Learning', items: 'TensorFlow · PyTorch · CNN' },
  { title: 'Cloud', items: 'Databricks · GCS · Azure' },
  { title: 'Tools', items: 'Git · CI/CD · Azure DevOps · Bash · Jupyter' },
  { title: 'App Development', items: 'Flask · React' },
]

const PROJECTS = [
  {
    id: '4.1.0',
    title: 'RAG Learning Assistant',
    tech: 'Python · LLM APIs · RAG · Vector Embeddings · GCS · Vertex AI · Flask · React',
    green: ['RAG', 'Vertex AI', 'LLM'],
    bullets: [
      'Built full-stack RAG application integrating Google Cloud document storage and Vertex AI for vector embeddings and semantic search, enabling chatbot interaction and quiz generation grounded strictly in course material',
      'Fine-tuned LLM to improve response quality and domain relevance',
      'Designed dynamic document ingestion pipeline allowing users to upload multiple documents at runtime, automatically expanding the retrieval context',
    ],
    images: [],
  },
  {
    id: '4.2.0',
    title: 'Drug Synergy Prediction',
    tech: 'Python · scikit-learn · TensorFlow · UMAP · Feature Engineering',
    green: ['UMAP', 'TensorFlow', 'Gradient Boosting', 'Random Forest'],
    bullets: [
      'Built multimodal ML pipeline integrating drug fingerprints, RNA expression data and cell line metadata to predict drug synergy (ZIP score)',
      'Engineered interaction-aware features capturing drug-drug and drug-cell relationships, trained ensemble models combining Gradient Boosting, Random Forest and deep learning',
      'Applied UMAP for dimensionality reduction and implemented leakage prevention, outlier handling and stratified sampling across large-scale biomedical datasets',
    ],
    images: [
      { src: '/projects/synergy-heatmap.png', label: 'Fig 4.2.1', caption: 'Top 20 features correlated with synergy_zip' },
      { src: '/projects/synergy-umap.png', label: 'Fig 4.2.2', caption: 'UMAP — train vs validation split' },
    ],
  },
  {
    id: '4.3.0',
    title: 'Pump Diagnostics — MIMII',
    tech: 'Python · TensorFlow · CNN · librosa · Deep Learning',
    green: ['CNN', 'Mel spectrograms', 'ROC-AUC', 'anomaly detection'],
    bullets: [
      'Built CNN-based binary classifier for industrial anomaly detection, converting raw pump audio into Mel spectrograms, reframing an audio problem as computer vision',
      'Evaluated model performance using ROC-AUC, confusion matrix and classification report, with Dropout and L2 regularisation to control overfitting',
    ],
    images: [
      { src: '/projects/pump-filters.png', label: 'Fig 4.3.1', caption: 'CNN learned filters — Normal vs Anomaly' },
      { src: '/projects/pump-spectrograms.png', label: 'Fig 4.3.2', caption: 'Sample predictions on Mel spectrograms' },
    ],
  },
  {
    id: '4.4.0',
    title: 'in1 — AI Playground',
    tech: 'Python · Flask · React · LLM APIs · JWT',
    green: ['multi-model', 'API routing', 'JWT'],
    bullets: [
      'Built multi-model AI platform with modular API routing, authentication and prompt tracking',
    ],
    images: [],
  },
]

const shouldShowBackgroundByDefault = () =>
  typeof window === 'undefined' ||
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

function HighlightGreen({ text, keywords, images, setHoverImg }) {
  if (!keywords.length) return text
  const escaped = keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
  const splitRe = new RegExp(`(${escaped})`, 'gi')
  const testRe = new RegExp(`^(?:${escaped})$`, 'i')
  const parts = text.split(splitRe)
  const img = images[0]?.src || null
  return parts.map((part, i) =>
    testRe.test(part)
      ? img
        ? <button
            key={i}
            type="button"
            className="green-term green-term-button"
            onMouseEnter={() => setHoverImg(img)}
            onMouseLeave={() => setHoverImg(null)}
            onFocus={() => setHoverImg(img)}
            onBlur={() => setHoverImg(null)}
            onClick={() => setHoverImg(current => current === img ? null : img)}
          >{part}</button>
        : <span key={i} className="green-term">{part}</span>
      : part
  )
}

function App() {
  const [view, setView] = useState('landing')
  const [hoverImg, setHoverImg] = useState(null)
  const [showBackground, setShowBackground] = useState(shouldShowBackgroundByDefault)

  const enter = useCallback(() => {
    setShowBackground(shouldShowBackgroundByDefault())
    setView('content')
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotionPreference = () => {
      if (motionQuery.matches) setShowBackground(false)
    }

    syncMotionPreference()
    motionQuery.addEventListener('change', syncMotionPreference)
    return () => motionQuery.removeEventListener('change', syncMotionPreference)
  }, [])

  const goHome = useCallback(() => {
    setView('landing')
    window.scrollTo(0, 0)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  if (view === 'landing') {
    return (
      <div className="landing" onClick={enter}>
        <CustomCursor />
        <div className="landing-center">
          <h1 className="landing-name">
            <span className="landing-line clickable">
              <DecryptedText
                text="ANTON"
                speed={30}
                maxIterations={14}
                sequential
                revealDirection="start"
                animateOn="view"
                className="decrypted-char"
                encryptedClassName="encrypted-char"
              />
            </span>
            <span className="landing-line clickable">
              <DecryptedText
                text="ERNSTSSON"
                speed={30}
                maxIterations={14}
                sequential
                revealDirection="start"
                animateOn="view"
                className="decrypted-char"
                encryptedClassName="encrypted-char"
              />
            </span>
          </h1>
        </div>
        <footer className="landing-footer">
          <div className="landing-footer-row">
            <span>© Data Engineer — AI Developer</span>
          </div>
          <div className="landing-footer-row">
            <span>Stockholm, Sweden</span>
            <span>—</span>
            <span>(+46) 762 541 024</span>
            <span>—</span>
            <a className="clickable" href="mailto:anton.ernstson@gmail.com" onClick={e => e.stopPropagation()}>anton.ernstson@gmail.com</a>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="content-page">
      <CustomCursor />

      {showBackground && (
        <div className="spectrogram-fixed">
          <SpectrogramBg />
        </div>
      )}

      {hoverImg && (
        <div className="hover-img-overlay">
          <img src={hoverImg} alt="" />
        </div>
      )}

      <nav className="navbar">
        <button className="nav-btn clickable" onClick={goHome}>Home</button>
        {NAV_ITEMS.map(item => (
          <button key={item.id} className="nav-btn clickable" onClick={() => scrollTo(item.id)}>
            {item.label}
          </button>
        ))}
      </nav>

      <button
        className="animation-toggle"
        type="button"
        onClick={() => setShowBackground(current => !current)}
        aria-pressed={showBackground}
      >
        <span className="animation-toggle-label">Animation</span>
        <span className="animation-toggle-track" aria-hidden="true">
          <span className="animation-toggle-thumb" />
        </span>
      </button>

      <div className="content-body">
        {/* ── PROFILE ── */}
        <section id="profile" className="section-block">
          <h2 className="section-big-title">PROFILE</h2>
          <div className="section-content">
            <p className="profile-text">
              Data Engineer and Analytics Engineer building production-grade pipelines,
              lakehouse architectures and BI solutions that actually get used. Applies ML and
              NLP to surface insights traditional reporting cannot see, delivered
              independently in regulated environments.
            </p>
            <p className="profile-text">
              <em>Data defines what we are able to see, and I find great joy in beautiful views.</em>
            </p>

            <div className="landing-roles" style={{ marginTop: 20 }}>
              <span className="hl">Data Engineer</span>
              <span className="hl">AI Developer</span>
            </div>

            <div className="contact-block">
              <h3>Contact</h3>
              <ul className="contact-list">
                <li>Stockholm, Sweden</li>
                <li>(+46) 762 541 024</li>
                <li><a className="clickable" href="mailto:anton.ernstson@gmail.com">anton.ernstson@gmail.com</a></li>
              </ul>
            </div>

            <div className="skills-block">
              <h3>Stack</h3>
              <div className="skills-grid">
                {SKILLS.map(skill => (
                  <div key={skill.title} className="skill-group">
                    <h3>{skill.title}</h3>
                    <p>{skill.items}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── EXPERIENCE ── */}
        <section id="experience" className="section-block">
          <h2 className="section-big-title">EXPERIENCE</h2>
          <div className="section-content">
            <div className="entry">
              <div className="entry-header">
                <span className="entry-title">Analytics Engineer Intern — Avtalat</span>
                <span className="entry-date">JAN 2026 – JUNE 2026</span>
              </div>
              <ul>
                <li>Built end-to-end NLP pipeline in Databricks (PySpark, sentence-transformers) to cluster ITSM incidents and identify problem candidates (PRB)</li>
                <li>Designed GDPR-compliant PII anonymization pipeline (regex + Presidio, spaCy), fully contained within Databricks</li>
                <li>Tracked clustering experiments using MLflow to ensure reproducibility</li>
                <li>Linked data quality (ISO 25012) to ML performance, identifying documentation gaps</li>
                <li>Delivered insights to IT stakeholders, supporting improvements in ITSM processes</li>
              </ul>
            </div>

            <div className="entry">
              <div className="entry-header">
                <span className="entry-title">Data Engineer Intern — Fora AB</span>
                <span className="entry-date">NOV 2025 – JAN 2026</span>
              </div>
              <ul>
                <li>Designed and implemented Medallion Architecture in Databricks using Freshservice REST APIs</li>
                <li>Defined data model and built Star Schema with surrogate keys for scalable analytics</li>
                <li>Developed production-grade ETL pipelines with data validation (DQX) and robust error handling</li>
                <li>Delivered a production data platform, that became the single source of truth for ITSM reporting</li>
              </ul>
            </div>

            <div className="entry">
              <div className="entry-header">
                <span className="entry-title">Machine Operator — Delicato</span>
                <span className="entry-date">2022 – 2025</span>
              </div>
              <ul>
                <li>Operated and maintained production line, ensuring quality and efficiency</li>
                <li>Vice-Chair of local union club, handling communication and onboarding</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── EDUCATION ── */}
        <section id="education" className="section-block">
          <h2 className="section-big-title">EDUCATION</h2>
          <div className="section-content">
            <div className="entry">
              <div className="entry-header">
                <span className="entry-title">AI Developer (YH)</span>
                <span className="entry-date">2024 – 2026</span>
              </div>
              <p className="entry-subtitle">Jensens Yrkeshögskola</p>
              <p className="entry-description">
                Focused on applied machine learning, data engineering, LLM applications and
                production-oriented AI systems.
              </p>
              <div className="education-detail">
                <span className="education-label">Thesis</span>
                <p className="entry-subtitle">NLP &amp; ML for ITSM Incident Clustering &amp; Process Maturity</p>
              </div>
              <div className="education-detail">
                <span className="education-label">Key Areas</span>
                <div className="education-tags">
                  <span className="hl">Python</span>
                  <span className="hl">SQL</span>
                  <span className="hl">Machine Learning</span>
                  <span className="hl">Deep Learning</span>
                  <span className="hl">Cloud</span>
                  <span className="hl">Data Engineering</span>
                  <span className="hl">Full-stack AI apps</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section id="projects" className="section-block">
          <h2 className="section-big-title">PROJECTS</h2>
          <div className="section-content">
            {PROJECTS.map(proj => (
              <div key={proj.id} className="entry project-entry">
                <div className="entry-header">
                  <span className="entry-title">§{proj.id} {proj.title}</span>
                </div>
                <p className="entry-tech">{proj.tech}</p>
                <ul>
                  {proj.bullets.map((b, i) => (
                    <li key={i}>
                      <HighlightGreen
                        text={b}
                        keywords={proj.green}
                        images={proj.images}
                        setHoverImg={setHoverImg}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
          <span className="back-to-top-arrow" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export default App
