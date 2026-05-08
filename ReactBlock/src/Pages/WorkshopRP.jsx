// src/Pages/WorkshopRP.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
  useLocation
} from 'react-router-dom';

const COLORS = {
  blue: '#3b82f6',
  purple: '#a855f7',
  green: '#10b981',
  pink: '#ec4899',
  yellow: '#f59e0b',
  bg: '#050505',
  surface: '#0a0a0c',
  border: 'rgba(255, 255, 255, 0.06)',
  glass: 'rgba(12, 12, 14, 0.75)',
};

const API_URL = '/workshop/api/projects/';
const API_FILES_BASE = '/workshop/api/projects/';

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// ========== САЙДБАР SYWORK ==========
const WorkshopSidebar = () => {
  const [showMyWorks, setShowMyWorks] = useState(false);
  const location = useLocation();

  const toggleMyWorks = () => setShowMyWorks(prev => !prev);

  return (
    <motion.div
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="d-flex flex-column p-4 position-fixed top-0 start-0 h-100"
      style={{
        width: '280px',
        backgroundColor: 'rgba(5,5,5,0.85)',
        backdropFilter: 'blur(20px)',
        borderRight: `1px solid ${COLORS.border}`,
        zIndex: 100,
        boxShadow: '10px 0 40px rgba(0,0,0,0.5)',
      }}
    >
      <div className="mb-5">
        <div className="d-flex align-items-center gap-2 mb-2">
          <motion.i
            className="fa-solid fa-hammer"
            style={{ color: COLORS.purple, fontSize: '2rem' }}
            animate={{ rotate: [0, -15, 10, 0] }}
            transition={{ repeat: Infinity, duration: 4, repeatDelay: 3 }}
          />
          <span className="fw-bold text-white" style={{ fontSize: '1.8rem', letterSpacing: '-0.5px', textShadow: `0 0 15px ${COLORS.purple}40` }}>SyWork</span>
        </div>
        <div className="text-secondary font-monospace" style={{ fontSize: '0.7rem', letterSpacing: '2px' }}>
          ПІДРОЗДІЛ SYFLOW
        </div>
      </div>

      <div className="d-flex flex-column gap-2 flex-grow-1">
        <Link to="/" className="text-decoration-none">
          <SidebarItem icon="fa-solid fa-diagram-project" text="Проєкти" color={COLORS.purple} active={location.pathname === '/' || location.pathname === ''} />
        </Link>

        <div>
          <motion.button
            onClick={toggleMyWorks}
            whileHover={{ backgroundColor: 'rgba(168,85,247,0.1)' }}
            className="d-flex align-items-center w-100 p-3 rounded-3 border-0"
            style={{
              backgroundColor: showMyWorks ? 'rgba(168,85,247,0.15)' : 'transparent',
              border: showMyWorks ? `1px solid ${COLORS.purple}30` : '1px solid transparent',
              color: '#e4e4e7',
              fontSize: '1.05rem',
              transition: 'all 0.2s',
            }}
          >
            <i className="fa-solid fa-user-gear me-3" style={{ color: COLORS.purple, width: '20px' }} />
            <span className="fw-semibold">Мої роботи</span>
            <motion.i
              className="fa-solid fa-chevron-down ms-auto"
              animate={{ rotate: showMyWorks ? 180 : 0 }}
              style={{ fontSize: '0.9rem', color: '#a1a1aa' }}
            />
          </motion.button>

          <AnimatePresence>
            {showMyWorks && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="ms-3 overflow-hidden"
              >
                <Link to="/my-works" className="text-decoration-none">
                  <SidebarItem icon="fa-solid fa-folder-tree" text="Мої проєкти" color={COLORS.purple} sub active={location.pathname === '/my-works'} />
                </Link>
                <Link to="/editor" className="text-decoration-none">
                  <SidebarItem icon="fa-solid fa-pen-ruler" text="Редактор" color={COLORS.purple} sub active={location.pathname === '/editor'} />
                </Link>
                <Link to="/create" className="text-decoration-none">
                  <SidebarItem icon="fa-solid fa-square-plus" text="Створити" color={COLORS.purple} sub active={location.pathname === '/create'} />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Link to="/templates" className="text-decoration-none">
          <SidebarItem icon="fa-solid fa-file-code" text="Шаблони" color={COLORS.purple} active={location.pathname === '/templates'} />
        </Link>
      </div>

      <div className="mt-auto pt-3 border-top" style={{ borderColor: COLORS.border }}>
        <motion.a
          href="/dashboard/"
          whileHover={{ x: 4, color: '#fff' }}
          className="d-flex align-items-center p-2 text-decoration-none"
          style={{ color: '#a1a1aa', fontSize: '0.9rem' }}
        >
          <i className="fa-solid fa-arrow-left me-2" /> Назад до SyFlow
        </motion.a>
      </div>
    </motion.div>
  );
};

const SidebarItem = ({ icon, text, color, active, sub }) => (
  <motion.div
    whileHover={{ backgroundColor: 'rgba(168,85,247,0.1)', x: 6 }}
    className="d-flex align-items-center p-3 rounded-3"
    style={{
      color: active ? '#fff' : '#e4e4e7',
      backgroundColor: active ? 'rgba(168,85,247,0.15)' : 'transparent',
      border: active ? `1px solid ${color}40` : '1px solid transparent',
      marginLeft: sub ? '16px' : '0',
      transition: 'all 0.2s',
    }}
  >
    <i className={`${icon} me-3`} style={{ color: active ? color : '#a1a1aa', width: '20px' }} />
    <span className="fw-semibold" style={{ fontSize: sub ? '0.95rem' : '1.05rem' }}>{text}</span>
  </motion.div>
);

// ========== ФОН ==========
const BackgroundBlueprint = () => (
  <div className="position-fixed top-0 start-0 w-100 h-100" style={{ pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
    <motion.div
      style={{
        position: 'absolute',
        width: '200%',
        height: '200%',
        backgroundImage: 'linear-gradient(rgba(168,85,247,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.04) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        top: '-50%',
        left: '-50%',
      }}
      animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
      transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
    />
    <motion.div className="position-absolute rounded-circle" style={{ width: '500px', height: '500px', background: `radial-gradient(circle, ${COLORS.purple}10 0%, transparent 70%)`, top: '10%', left: '60%', filter: 'blur(60px)' }} animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ repeat: Infinity, duration: 8 }} />
    <motion.i className="fa-solid fa-gear position-absolute" style={{ fontSize: '12rem', bottom: '5%', right: '5%', opacity: 0.04, color: COLORS.purple }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 50, ease: 'linear' }} />
    <motion.i className="fa-solid fa-gear position-absolute" style={{ fontSize: '8rem', top: '15%', left: '20%', opacity: 0.04, color: COLORS.purple }} animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 40, ease: 'linear' }} />
  </div>
);

// ========== СПІЛЬНІ КОМПОНЕНТИ ==========
const LoadingSpinner = () => (
  <div className="text-center py-5">
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: COLORS.purple, borderRadius: '50%', margin: '0 auto' }} />
  </div>
);

const ErrorMessage = ({ message }) => (
  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="alert alert-danger bg-dark text-danger border-danger rounded-3">
    {message}
  </motion.div>
);

// ========== ГОЛОВНА СТОРІНКА ==========
const WorkshopHome = ({ user, onDelete }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('-created_at');
  const navigate = useNavigate();

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}?ordering=${sort}`);
      if (!res.ok) throw new Error('Сервер повернув помилку');
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Не вдалося завантажити проєкти');
    } finally {
      setLoading(false);
    }
  }, [sort]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-white fw-bold" style={{ fontSize: '2rem', textShadow: '0 0 20px rgba(255,255,255,0.1)' }}>Всі проєкти</h2>
        <select onChange={(e) => setSort(e.target.value)} value={sort} style={{ backgroundColor: '#18181b', color: '#e4e4e7', border: `1px solid ${COLORS.border}`, borderRadius: '20px', padding: '8px 16px', fontSize: '0.9rem' }}>
          <option value="-created_at">Спочатку нові</option>
          <option value="created_at">Спочатку старі</option>
          <option value="-stars_count">За популярністю</option>
        </select>
      </div>
      {error && <ErrorMessage message={error} />}
      {loading ? <LoadingSpinner /> : (
        <div className="row g-4">
          {projects.length > 0 ? projects.map(p => (
            <div key={p.id} className="col-12 col-xl-6">
              <ProjectCard project={p} onEdit={user && p.author?.id === user.id ? () => navigate(`/edit/${p.id}`) : null} />
              {user && p.author?.id === user.id && <button onClick={() => onDelete(p.id)} className="btn btn-sm text-danger mt-1">Видалити</button>}
            </div>
          )) : <div className="col-12 text-center py-5 text-secondary">Немає проєктів</div>}
        </div>
      )}
    </div>
  );
};

// ========== МОЇ РОБОТИ ==========
const MyWorks = ({ user }) => {
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);
    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error('Помилка завантаження');
        return res.json();
      })
      .then(data => {
        setMyProjects(Array.isArray(data) ? data.filter(p => p.author.id === user.id) : []);
        setLoading(false);
      })
      .catch(err => { console.error(err); setError('Не вдалося завантажити ваші проєкти'); setLoading(false); });
  }, [user]);

  const stats = {
    total: myProjects.length,
    templates: myProjects.filter(p => p.is_template).length,
    lookingForTeam: myProjects.filter(p => p.looking_for_team).length,
    totalStars: myProjects.reduce((sum, p) => sum + p.stars_count, 0),
  };

  return (
    <div>
      <h2 className="text-white fw-bold mb-4" style={{ fontSize: '2rem' }}>Мої роботи</h2>
      {error && <ErrorMessage message={error} />}
      <div className="row g-3 mb-4">
        <StatItem title="Проєктів" value={stats.total} icon="fa-solid fa-diagram-project" />
        <StatItem title="Шаблонів" value={stats.templates} icon="fa-solid fa-file-code" />
        <StatItem title="Шукають команду" value={stats.lookingForTeam} icon="fa-solid fa-users" />
        <StatItem title="Зірок" value={stats.totalStars} icon="fa-solid fa-star" />
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="row g-4">
          {myProjects.length > 0 ? myProjects.map(p => (
            <div key={p.id} className="col-12 col-xl-6">
              <ProjectCard project={p} />
              <div className="mt-2 d-flex gap-2">
                <button onClick={() => navigate(`/edit/${p.id}`)} className="btn btn-sm text-primary">Редагувати</button>
                <button onClick={() => navigate(`/editor/${p.id}`)} className="btn btn-sm text-info">Редактор</button>
              </div>
            </div>
          )) : <div className="col-12 text-center py-5 text-secondary">Ви ще не створили жодного проєкту</div>}
        </div>
      )}
    </div>
  );
};

const StatItem = ({ title, value, icon }) => (
  <div className="col-sm-6 col-lg-3">
    <motion.div whileHover={{ y: -3 }} className="p-3 rounded-4" style={{ backgroundColor: COLORS.glass, border: `1px solid ${COLORS.border}`, backdropFilter: 'blur(12px)', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
      <i className={`${icon} mb-2`} style={{ color: COLORS.purple, fontSize: '1.5rem' }} />
      <h4 className="text-white fw-bold mb-0">{value}</h4>
      <small className="text-secondary">{title}</small>
    </motion.div>
  </div>
);

// ========== НОВИЙ FileEditorPage (контейнер із вкладками) ==========
const FileEditorPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [activeInnerTab, setActiveInnerTab] = useState('workspace'); // 'workspace' | 'run' | 'terminal'

  useEffect(() => {
    fetch(`${API_URL}${projectId}/`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { setProject(data); })
      .catch(err => { setError('Проєкт не знайдено'); console.error(err); });
  }, [projectId]);

  if (error) return <ErrorMessage message={error} />;
  if (!project) return <LoadingSpinner />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
      style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      {/* Хедер */}
      <div className="d-flex align-items-center mb-3">
        <button onClick={() => navigate('/')} className="btn btn-sm text-secondary me-3">
          <i className="fa-solid fa-arrow-left me-1" /> Назад
        </button>
        <h2 className="text-white fw-bold m-0" style={{ fontSize: '1.6rem' }}>{project.title}</h2>
        <span className="ms-3 text-secondary font-monospace" style={{ fontSize: '0.8rem' }}>ID: {projectId}</span>
      </div>

      {/* Перемикач вкладок */}
      <div className="d-flex gap-2 mb-3">
        {[
          { key: 'workspace', label: 'Робоча поверхня', icon: 'fa-solid fa-code' },
          { key: 'run', label: 'Запуск', icon: 'fa-solid fa-play' },
          { key: 'terminal', label: 'Термінал', icon: 'fa-solid fa-terminal' },
        ].map(tab => (
          <motion.button
            key={tab.key}
            onClick={() => setActiveInnerTab(tab.key)}
            whileHover={{ backgroundColor: 'rgba(168,85,247,0.1)' }}
            whileTap={{ scale: 0.97 }}
            className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 border-0"
            style={{
              backgroundColor: activeInnerTab === tab.key ? 'rgba(168,85,247,0.15)' : 'transparent',
              color: activeInnerTab === tab.key ? '#fff' : '#a1a1aa',
              border: activeInnerTab === tab.key ? `1px solid ${COLORS.purple}40` : '1px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            <i className={tab.icon} style={{ fontSize: '0.9rem' }} />
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Вміст вкладок */}
      <div className="flex-grow-1" style={{ overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeInnerTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} style={{ height: '100%' }}>
            {activeInnerTab === 'workspace' && <WorkspaceTab projectId={projectId} />}
            {activeInnerTab === 'run' && <RunTab projectId={projectId} />}
            {activeInnerTab === 'terminal' && <TerminalTab projectId={projectId} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ========== ВКЛАДКА «РОБОЧА ПОВЕРХНЯ» (попередній файловий редактор) ==========
const WorkspaceTab = ({ projectId }) => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [content, setContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [error, setError] = useState(null);
  const API_FILES = `${API_FILES_BASE}${projectId}/files/`;

  const loadFiles = useCallback(async () => {
    try {
      const res = await fetch(API_FILES);
      if (res.ok) setFiles(await res.json());
      else setError('Не вдалося завантажити файли');
    } catch (err) { console.error(err); setError('Помилка мережі'); }
  }, [API_FILES]);

  useEffect(() => { loadFiles(); }, [loadFiles]);

  const saveFile = async () => {
    if (!selectedFile) return;
    const csrfToken = getCookie('csrftoken');
    try {
      const res = await fetch(`${API_FILES}${selectedFile.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
        body: JSON.stringify({ name: selectedFile.name, content }),
      });
      if (res.ok) {
        setIsDirty(false);
        setFiles(prev => prev.map(f => f.id === selectedFile.id ? { ...f, content } : f));
      } else alert('Помилка збереження');
    } catch (err) { console.error(err); alert('Помилка мережі'); }
  };

  const createFile = async () => {
    if (!newFileName.trim()) return;
    const csrfToken = getCookie('csrftoken');
    try {
      const res = await fetch(API_FILES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
        body: JSON.stringify({ name: newFileName, content: '' }),
      });
      if (res.ok) {
        const newFile = await res.json();
        setFiles(prev => [...prev, newFile]);
        setNewFileName('');
        setSelectedFile(newFile);
        setContent('');
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData?.detail || 'Не вдалося створити файл');
      }
    } catch (err) { console.error(err); alert('Помилка мережі'); }
  };

  const deleteFile = async (id) => {
    if (!confirm('Видалити файл?')) return;
    const csrfToken = getCookie('csrftoken');
    try {
      await fetch(`${API_FILES}${id}/`, { method: 'DELETE', headers: { 'X-CSRFToken': csrfToken } });
      setFiles(prev => prev.filter(f => f.id !== id));
      if (selectedFile?.id === id) { setSelectedFile(null); setContent(''); }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (selectedFile) { setContent(selectedFile.content); setIsDirty(false); }
    else setContent('');
  }, [selectedFile]);

  const getLanguage = (fileName) => {
    if (fileName.endsWith('.py')) return 'python';
    if (fileName.endsWith('.js') || fileName.endsWith('.jsx')) return 'javascript';
    if (fileName.endsWith('.html')) return 'html';
    if (fileName.endsWith('.css')) return 'css';
    if (fileName.endsWith('.json')) return 'json';
    return 'python'; // default
  };

  return (
    <div className="d-flex gap-3 h-100">
      {/* Панель файлів */}
      <motion.div initial={{ x: -20 }} animate={{ x: 0 }}
        className="d-flex flex-column" style={{ width: '250px', backgroundColor: COLORS.glass, backdropFilter: 'blur(16px)', border: `1px solid ${COLORS.border}`, borderRadius: '16px', padding: '1rem' }}>
        <h5 className="text-secondary mb-3">Файли проєкту</h5>
        <div className="d-flex gap-2 mb-3">
          <input value={newFileName} onChange={(e) => setNewFileName(e.target.value)} placeholder="новий файл..."
            className="form-control bg-dark text-white border-secondary" style={{ fontSize: '0.9rem' }} />
          <button onClick={createFile} className="btn btn-sm text-white" style={{ backgroundColor: COLORS.purple }}>
            <i className="fa-solid fa-plus" />
          </button>
        </div>
        <div className="flex-grow-1 overflow-auto">
          {files.map(file => (
            <motion.div key={file.id} whileHover={{ backgroundColor: 'rgba(168,85,247,0.1)' }}
              onClick={() => setSelectedFile(file)}
              className="d-flex justify-content-between align-items-center p-2 rounded-3"
              style={{ cursor: 'pointer', backgroundColor: selectedFile?.id === file.id ? 'rgba(168,85,247,0.2)' : 'transparent', marginBottom: '4px' }}>
              <span className="text-white" style={{ fontSize: '0.95rem' }}>
                <i className="fa-regular fa-file-code me-2" style={{ color: COLORS.purple }} />{file.name}
              </span>
              <button onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }} className="btn btn-sm p-0 text-secondary">
                <i className="fa-solid fa-trash-can" />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Редактор коду */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-grow-1 position-relative"
        style={{ backgroundColor: COLORS.glass, backdropFilter: 'blur(16px)', border: `1px solid ${COLORS.border}`, borderRadius: '16px', overflow: 'hidden' }}>
        {selectedFile ? (
          <>
            <div className="d-flex justify-content-between align-items-center px-3 py-2" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
              <span className="text-white fw-semibold">{selectedFile.name}</span>
              {isDirty && <button onClick={saveFile} className="btn btn-sm text-white" style={{ backgroundColor: COLORS.green }}><i className="fa-solid fa-save me-1" /> Зберегти</button>}
            </div>
            <div style={{ height: 'calc(100% - 45px)' }}>
              <CodeEditor value={content} onChange={(newContent) => { setContent(newContent); setIsDirty(true); }} language={getLanguage(selectedFile.name)} />
            </div>
          </>
        ) : (
          <div className="d-flex align-items-center justify-content-center h-100 text-secondary">Оберіть файл для редагування</div>
        )}
      </motion.div>
    </div>
  );
};

const RunTab = ({ projectId }) => {
  const [files, setFiles] = useState([]);
  const [config, setConfig] = useState({
    main_file: '',
    arguments: '',
    python_version: '3',
    language: 'python',
  });
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_FILES_BASE}${projectId}/files/`)
      .then(res => res.json())
      .then(setFiles)
      .catch(console.error);

    fetch(`${API_FILES_BASE}${projectId}/run-config/`)
      .then(res => res.json())
      .then(data => setConfig(prev => ({ ...prev, ...data })))
      .catch(console.error);
  }, [projectId]);

  const saveConfig = async () => {
    const csrfToken = getCookie('csrftoken');
    try {
      const res = await fetch(`${API_FILES_BASE}${projectId}/run-config/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
        body: JSON.stringify(config),
      });
      if (res.ok) alert('Налаштування збережено!');
      else alert('Помилка збереження');
    } catch (err) { console.error(err); alert('Помилка мережі'); }
  };

  const runProject = async () => {
    setRunning(true);
    setError(null);
    setOutput(null);
    const csrfToken = getCookie('csrftoken');
    try {
      const res = await fetch(`${API_FILES_BASE}${projectId}/run/`, {
        method: 'POST',
        headers: { 'X-CSRFToken': csrfToken },
      });
      const data = await res.json();
      if (res.ok) {
        setOutput(data);
      } else {
        setError(data.error || 'Помилка запуску');
      }
    } catch (err) {
      console.error(err);
      setError('Помилка мережі');
    } finally {
      setRunning(false);
    }
  };

  // Обробка кольорових повідомлень з stderr
  const renderStderr = (stderr) => {
    if (!stderr) return null;
    const lines = stderr.split('\n');
    return lines.map((line, idx) => {
      let color = 'white';
      if (line.includes('FP-ERROR')) color = '#991b1b'; // темно-червоний
      else if (line.includes('FP-WARNING')) color = '#a16207'; // темно-жовтий
      else if (line.includes('FP-INFO')) color = '#1e3a8a'; // темно-синій
      return <div key={idx} style={{ color }}>{line}</div>;
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="d-flex flex-column h-100 gap-3 p-3" style={{ backgroundColor: COLORS.glass, backdropFilter: 'blur(16px)', border: `1px solid ${COLORS.border}`, borderRadius: '16px' }}>
      <div className="d-flex align-items-center gap-3">
        <h3 className="text-white fw-bold m-0"><i className="fa-solid fa-sliders me-2" style={{ color: COLORS.purple }} />Запуск проєкту</h3>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={saveConfig}
          className="btn btn-sm text-white" style={{ backgroundColor: COLORS.blue, borderRadius: '12px' }}>
          <i className="fa-solid fa-floppy-disk me-2" />Зберегти налаштування
        </motion.button>
      </div>

      <div className="row g-3">
        <div className="col-md-3">
          <label className="text-secondary mb-1">Мова</label>
          <select className="form-control bg-dark text-white border-secondary" value={config.language}
            onChange={e => setConfig(prev => ({ ...prev, language: e.target.value }))}>
            <option value="python">Python</option>
            <option value="flowperl">FlowPerl</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="text-secondary mb-1">Головний файл</label>
          <select className="form-control bg-dark text-white border-secondary" value={config.main_file}
            onChange={e => setConfig(prev => ({ ...prev, main_file: e.target.value }))}>
            <option value="">— Авто —</option>
            {files.filter(f => config.language === 'flowperl' ? f.name.endsWith('.fp') : f.name.endsWith('.py')).map(f => (
              <option key={f.id} value={f.name}>{f.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="text-secondary mb-1">Аргументи</label>
          <input className="form-control bg-dark text-white border-secondary" value={config.arguments}
            onChange={e => setConfig(prev => ({ ...prev, arguments: e.target.value }))} placeholder="--verbose" />
        </div>
        <div className="col-md-3">
          <label className="text-secondary mb-1">Версія Python</label>
          <select className="form-control bg-dark text-white border-secondary" value={config.python_version}
            onChange={e => setConfig(prev => ({ ...prev, python_version: e.target.value }))}>
            <option value="3">Python 3</option>
          </select>
        </div>
      </div>

      <div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={runProject} disabled={running}
          className="btn px-4 py-2 text-white fw-bold" style={{ backgroundColor: COLORS.green, borderRadius: '12px' }}>
          {running ? (
            <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', marginRight: '8px' }} /> Запуск...</>
          ) : (
            <><i className="fa-solid fa-play me-2" /> Запустити</>
          )}
        </motion.button>
      </div>

      {(output || error) && (
        <div className="flex-grow-1 mt-3 p-3 rounded-3" style={{ backgroundColor: '#0d0d0d', border: `1px solid ${COLORS.border}`, fontFamily: 'monospace', fontSize: '0.9rem', overflowY: 'auto', maxHeight: '400px' }}>
          {error && <div className="text-danger mb-2">❌ {error}</div>}
          {output && (
            <>
              {output.stdout && (
                <div className="mb-2">
                  <div className="text-success mb-1">📤 stdout:</div>
                  <pre className="text-white" style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{output.stdout}</pre>
                </div>
              )}
              {output.stderr ? (
                <div>
                  <div className="text-warning mb-1">⚠️ stderr:</div>
                  <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{renderStderr(output.stderr)}</pre>
                </div>
              ) : (
                !output.stdout && <div className="text-secondary">Код виконано без виводу.</div>
              )}
            </>
          )}
        </div>
      )}
    </motion.div>
  );
};

const TerminalTab = ({ projectId }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-5 text-center rounded-4" style={{ backgroundColor: COLORS.glass, backdropFilter: 'blur(12px)', border: `1px solid ${COLORS.border}`, height: '100%' }}>
    <i className="fa-solid fa-terminal mb-3" style={{ fontSize: '3rem', color: COLORS.purple, opacity: 0.5 }} />
    <h3 className="text-white fw-bold">Термінал</h3>
    <p className="text-secondary">Тут відображатимуться результати запуску та системні повідомлення.</p>
  </motion.div>
);

// ========== ОНОВЛЕНИЙ CodeEditor (додаємо підтримку нових мов) ==========
const CodeEditor = ({ value, onChange, language = 'python' }) => {
  const editorRef = useRef(null);
  const viewRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const getLanguageExtension = (lang) => {
      switch (lang) {
        case 'python': return python();
        case 'javascript': return javascript();
        case 'html': return html();
        case 'css': return css();
        case 'json': return json();
        default: return python();
      }
    };

    const extensions = [
      lineNumbers(),
      highlightActiveLine(),
      keymap.of(defaultKeymap),
      oneDark,
      getLanguageExtension(language),
      EditorView.updateListener.of((update) => {
        if (update.docChanged && onChange) {
          onChange(update.state.doc.toString());
        }
      }),
    ];

    const state = EditorState.create({ doc: value || '', extensions });
    const view = new EditorView({ state, parent: editorRef.current });
    viewRef.current = view;

    return () => view.destroy();
  }, []);

  useEffect(() => {
    if (viewRef.current && value !== undefined) {
      const cur = viewRef.current.state.doc.toString();
      if (value !== cur) viewRef.current.dispatch({ changes: { from: 0, to: cur.length, insert: value || '' } });
    }
  }, [value]);

  return <div ref={editorRef} style={{ height: '100%', width: '100%', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${COLORS.border}` }} />;
};

// ========== ВИБІР РЕДАКТОРА ==========
const ProjectEditor = () => {
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="py-4">
      <div className="mb-5">
        <h2 className="text-white fw-bold mb-2 d-flex align-items-center" style={{ fontSize: '2.2rem' }}>
          <i className="fa-solid fa-pen-ruler me-3" style={{ color: COLORS.purple }} />
          Редактор проєктів
        </h2>
        <p className="text-secondary" style={{ fontSize: '1.1rem' }}>
          Оберіть спосіб створення вашого шедевру в середовищі SyWork
        </p>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
        className="row g-4"
      >
        {[
          {
            title: 'Порожній проєкт',
            desc: 'Почати з нуля з чистим робочим простором.',
            icon: 'fa-solid fa-file-code',
            color: COLORS.purple,
            action: () => navigate('/create', { state: { fromEditor: true, type: 'blank' } }),
          },
          {
            title: 'З шаблону',
            desc: 'Обрати готовий шаблон із галереї спільноти.',
            icon: 'fa-solid fa-cubes',
            color: COLORS.blue,
            action: () => navigate('/templates', { state: { pickTemplate: true } }),
          },
          {
            title: 'Імпортувати',
            desc: 'Завантажити архів або підключити Git-репозиторій.',
            icon: 'fa-solid fa-file-import',
            color: COLORS.green,
            action: () => alert('Функціонал імпорту буде доступний пізніше'),
          },
        ].map((item, idx) => (
          <motion.div key={idx} className="col-md-6 col-lg-4"
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
          >
            <motion.div
              whileHover={{ y: -8, boxShadow: `0 20px 40px ${item.color}30`, borderColor: `${item.color}60` }}
              whileTap={{ scale: 0.98 }}
              onClick={item.action}
              className="p-4 h-100 rounded-4 position-relative overflow-hidden"
              style={{ backgroundColor: COLORS.glass, backdropFilter: 'blur(16px)', border: `1px solid ${COLORS.border}`, cursor: 'pointer' }}
            >
              <motion.div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ background: `radial-gradient(circle at 30% 0%, ${item.color}18 0%, transparent 70%)`, opacity: 0, pointerEvents: 'none' }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              <div className="position-relative z-1 d-flex flex-column h-100">
                <motion.div whileHover={{ rotate: 5, scale: 1.05 }} className="mb-3"
                  style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${item.color}30` }}
                >
                  <i className={item.icon} style={{ fontSize: '2rem', color: item.color }} />
                </motion.div>
                <h3 className="text-white fw-bold mb-2" style={{ fontSize: '1.5rem' }}>{item.title}</h3>
                <p className="text-secondary flex-grow-1" style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>{item.desc}</p>
                <motion.span whileHover={{ x: 5 }} className="d-inline-flex align-items-center mt-3" style={{ color: item.color, fontWeight: 600, fontSize: '0.9rem' }}>
                  Почати <i className="fa-solid fa-arrow-right ms-2" />
                </motion.span>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

// ========== ФОРМА СТВОРЕННЯ/РЕДАГУВАННЯ ==========
const ProjectFormPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(projectId);
  const [formData, setFormData] = useState({ title: '', description: '', tags: '', is_template: false, looking_for_team: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      fetch(`${API_URL}${projectId}/`)
        .then(res => {
          if (!res.ok) throw new Error('Проєкт не знайдено');
          return res.json();
        })
        .then(data => setFormData({
          title: data.title || '',
          description: data.description || '',
          tags: data.tags || '',
          is_template: data.is_template || false,
          looking_for_team: data.looking_for_team || false
        }))
        .catch(err => { console.error(err); setError('Не вдалося завантажити проєкт'); });
    }
  }, [projectId, isEdit]);

  const handleChange = field => e => setFormData(prev => ({ ...prev, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const csrfToken = getCookie('csrftoken');
    const url = isEdit ? `${API_URL}${projectId}/` : API_URL;
    const method = isEdit ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        navigate('/my-works', { replace: true });
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.detail || 'Помилка збереження');
      }
    } catch (err) {
      console.error(err);
      setError('Помилка мережі');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="p-4"
      style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: COLORS.glass, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.border}`, borderRadius: '28px', boxShadow: `0 25px 50px rgba(0,0,0,0.6)` }}
    >
      <div className="d-flex align-items-center gap-3 mb-4">
        <motion.div whileHover={{ rotate: 10 }} style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: `${COLORS.purple}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${COLORS.purple}40` }}>
          <i className="fa-solid fa-code" style={{ color: COLORS.purple, fontSize: '1.8rem' }} />
        </motion.div>
        <div>
          <h2 className="text-white fw-bold m-0" style={{ fontSize: '1.8rem' }}>{isEdit ? 'Редагування проєкту' : 'Новий проєкт'}</h2>
          <p className="text-secondary m-0" style={{ fontSize: '0.9rem' }}>{isEdit ? 'Змініть деталі вашого проєкту' : 'Заповніть форму, щоб створити проєкт у SyWork'}</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <motion.form
        onSubmit={handleSubmit}
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.div className="mb-4" variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}>
          <label className="text-secondary mb-2 d-block">Назва проєкту</label>
          <motion.input whileFocus={{ boxShadow: `0 0 0 2px ${COLORS.purple}40` }} className="form-control bg-dark text-white border-secondary"
            style={{ borderRadius: '12px', padding: '12px 16px', fontSize: '1rem', backgroundColor: 'rgba(0,0,0,0.3)' }}
            value={formData.title} onChange={handleChange('title')} required placeholder="Наприклад, Django REST Starter"
          />
        </motion.div>

        <motion.div className="mb-4" variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}>
          <label className="text-secondary mb-2 d-block">Опис</label>
          <motion.textarea whileFocus={{ boxShadow: `0 0 0 2px ${COLORS.purple}40` }} className="form-control bg-dark text-white border-secondary"
            rows="5" style={{ borderRadius: '12px', padding: '12px 16px', fontSize: '1rem', resize: 'vertical', backgroundColor: 'rgba(0,0,0,0.3)' }}
            value={formData.description} onChange={handleChange('description')} required placeholder="Опишіть ваш проєкт..."
          />
        </motion.div>

        <motion.div className="mb-4" variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}>
          <label className="text-secondary mb-2 d-block">Теги <span className="text-muted">(через кому)</span></label>
          <motion.input whileFocus={{ boxShadow: `0 0 0 2px ${COLORS.purple}40` }} className="form-control bg-dark text-white border-secondary"
            style={{ borderRadius: '12px', padding: '12px 16px', fontSize: '1rem', backgroundColor: 'rgba(0,0,0,0.3)' }}
            value={formData.tags} onChange={handleChange('tags')} placeholder="python, django, api"
          />
        </motion.div>

        <motion.div className="d-flex flex-wrap gap-4 mb-4" variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" checked={formData.is_template} onChange={handleChange('is_template')} id="isTemplate" />
            <label className="form-check-label text-secondary" htmlFor="isTemplate">Шаблон</label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" checked={formData.looking_for_team} onChange={handleChange('looking_for_team')} id="lookingForTeam" />
            <label className="form-check-label text-secondary" htmlFor="lookingForTeam">Шукаю команду</label>
          </div>
        </motion.div>

        <motion.div className="d-flex justify-content-end gap-3" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary rounded-3 px-4 py-2">Скасувати</button>
          <motion.button type="submit" whileHover={{ scale: 1.03, boxShadow: `0 0 25px ${COLORS.purple}80` }} whileTap={{ scale: 0.97 }} disabled={loading}
            className="btn text-white fw-bold rounded-3 px-4 py-2" style={{ background: `linear-gradient(135deg, ${COLORS.purple}, #7c3aed)`, border: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {loading ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }}
                  style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }}
                />
                Збереження...
              </>
            ) : isEdit ? 'Зберегти зміни' : 'Створити проєкт'}
          </motion.button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

// ========== ДЕТАЛЬНА СТОРІНКА ПРОЄКТУ ==========
const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}${projectId}/`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { setProject(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [projectId]);

  if (loading) return <LoadingSpinner />;
  if (!project) return <div className="text-center py-5 text-danger">Проєкт не знайдено</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-4" style={{ backgroundColor: COLORS.glass, backdropFilter: 'blur(16px)', border: `1px solid ${COLORS.border}` }}>
      <div className="d-flex align-items-center gap-3 mb-4">
        <i className="fa-solid fa-code" style={{ fontSize: '3rem', color: COLORS.purple }} />
        <div>
          <h2 className="text-white fw-bold mb-1">{project.title}</h2>
          <div className="d-flex gap-2">{project.tags_list?.map(tag => <span key={tag} className="badge" style={{ backgroundColor: `${COLORS.purple}30`, color: COLORS.purple }}>{tag}</span>)}</div>
        </div>
      </div>
      <p className="text-secondary mb-4">{project.description}</p>
      <div className="d-flex gap-4 text-secondary mb-4">
        <span><i className="fa-solid fa-user me-2" /> {project.author?.nickname}</span>
        <span><i className="fa-solid fa-calendar me-2" /> {new Date(project.created_at).toLocaleDateString()}</span>
        <span><i className="fa-solid fa-star me-2" /> {project.stars_count}</span>
      </div>
      <button onClick={() => navigate(`/editor/${project.id}`)} className="btn text-white" style={{ background: `linear-gradient(135deg, ${COLORS.purple}, #7c3aed)`, border: 'none', boxShadow: `0 0 15px ${COLORS.purple}40` }}>
        <i className="fa-solid fa-code me-2" /> Відкрити редактор
      </button>
    </motion.div>
  );
};

// ========== КАРТКА ПРОЄКТУ ==========
const ProjectCard = ({ project, onEdit }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8, boxShadow: `0 25px 40px ${COLORS.purple}20`, borderColor: `${COLORS.purple}50` }}
      className="p-4 h-100 position-relative overflow-hidden"
      style={{ backgroundColor: COLORS.glass, backdropFilter: 'blur(16px)', border: `1px solid ${COLORS.border}`, borderRadius: '24px', cursor: 'pointer' }}
      onClick={() => navigate(`/project/${project.id}`)}
    >
      <motion.div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ background: `radial-gradient(circle at 20% 0%, ${COLORS.purple}18 0%, transparent 60%)`, opacity: 0.5, pointerEvents: 'none' }}
      />
      <div className="position-relative z-1">
        <div className="d-flex align-items-start gap-3 mb-3">
          <motion.div whileHover={{ rotate: 10, scale: 1.1 }} style={{ width: '52px', height: '52px', borderRadius: '16px', backgroundColor: `${COLORS.purple}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${COLORS.purple}30`, boxShadow: `0 0 15px ${COLORS.purple}30` }}>
            <i className="fa-solid fa-code" style={{ color: COLORS.purple, fontSize: '1.8rem' }} />
          </motion.div>
          <div style={{ flex: 1 }}>
            <h3 className="text-white fw-bold mb-1" style={{ fontSize: '1.4rem' }}>{project.title}</h3>
            <p className="text-secondary m-0" style={{ fontSize: '0.9rem', maxHeight: '2.8em', overflow: 'hidden' }}>{project.description}</p>
          </div>
        </div>
        <div className="d-flex flex-wrap gap-2 mb-3">
          {project.tags_list?.map((tag, i) => (
            <span key={i} className="badge" style={{ backgroundColor: `${COLORS.purple}25`, color: COLORS.purple, borderRadius: '12px', padding: '6px 12px', fontWeight: 500 }}>{tag}</span>
          ))}
          {project.looking_for_team && <span className="badge" style={{ backgroundColor: `${COLORS.pink}25`, color: COLORS.pink, borderRadius: '12px', padding: '6px 12px' }}>🚀 шукаю команду</span>}
          {project.is_template && <span className="badge" style={{ backgroundColor: `${COLORS.yellow}25`, color: COLORS.yellow, borderRadius: '12px', padding: '6px 12px' }}>📄 шаблон</span>}
        </div>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="d-flex align-items-center gap-2">
            <img src={project.author?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${project.author?.nickname || 'user'}`} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%', border: `1px solid ${COLORS.border}` }} />
            <span className="text-secondary" style={{ fontSize: '0.8rem' }}>{project.author?.nickname}</span>
          </div>
          <span className="text-secondary" style={{ fontSize: '0.7rem' }}>{new Date(project.created_at).toLocaleDateString()}</span>
        </div>
        {onEdit && (
          <div className="mt-3 d-flex gap-2">
            <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="btn btn-sm text-secondary">Редагувати</button>
            <button onClick={(e) => { e.stopPropagation(); navigate(`/editor/${project.id}`); }} className="btn btn-sm" style={{ color: COLORS.purple }}>Редактор</button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ========== ЗАСТОСУНОК ==========
const WorkshopApp = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetch('/api/user/').then(res => res.ok ? res.json() : null).then(setUser).catch(() => {});
  }, []);

  const handleDelete = async (projectId) => {
    if (!confirm('Видалити проєкт?')) return;
    const csrfToken = getCookie('csrftoken');
    try {
      const res = await fetch(`${API_URL}${projectId}/`, { method: 'DELETE', headers: { 'X-CSRFToken': csrfToken } });
      if (res.ok) window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
      className="d-flex w-100 min-vh-100" style={{ backgroundColor: COLORS.bg, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <BackgroundBlueprint />
      <WorkshopSidebar />
      <div className="flex-grow-1 position-relative" style={{ marginLeft: '280px', padding: '2.5rem 4rem', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><WorkshopHome user={user} onDelete={handleDelete} /></PageWrapper>} />
            <Route path="/my-works" element={<PageWrapper><MyWorks user={user} /></PageWrapper>} />
            <Route path="/editor" element={<PageWrapper><ProjectEditor /></PageWrapper>} />
            <Route path="/create" element={<PageWrapper><ProjectFormPage /></PageWrapper>} />
            <Route path="/edit/:projectId" element={<PageWrapper><ProjectFormPage /></PageWrapper>} />
            <Route path="/project/:projectId" element={<PageWrapper><ProjectDetail /></PageWrapper>} />
            <Route path="/templates" element={<PageWrapper><WorkshopHome user={user} onDelete={handleDelete} /></PageWrapper>} />
            <Route path="/editor/:projectId" element={<PageWrapper><FileEditorPage /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const PageWrapper = ({ children }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
    {children}
  </motion.div>
);

// ========== ТОЧКА ВХОДУ ==========
const WorkshopRP = () => (
  <Router>
    <WorkshopApp />
  </Router>
);

export default WorkshopRP;