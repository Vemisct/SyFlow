// src/Pages/SettingsRP.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { applyStoredSettings } from '../utils/settingsUtils';

const COLORS = {
  primary: '#1e3a8a',
  primaryLight: '#2563eb',
  bg: '#050505',
  surface: '#0a0a0c',
  border: 'rgba(255,255,255,0.06)',
  glass: 'rgba(12,12,14,0.75)',
};

const TRANSLATIONS = {
  profile: { uk: 'Профіль', en: 'Profile' },
  interface: { uk: 'Інтерфейс', en: 'Interface' },
  notifications: { uk: 'Сповіщення', en: 'Notifications' },
  about: { uk: 'Про систему', en: 'About' },
  backToSyFlow: { uk: 'Назад до SyFlow', en: 'Back to SyFlow' },
  save: { uk: 'Зберегти', en: 'Save' },
  saving: { uk: 'Збереження...', en: 'Saving...' },
  nickname: { uk: 'Нікнейм', en: 'Nickname' },
  bio: { uk: 'Біографія', en: 'Bio' },
  avatar: { uk: 'Аватар', en: 'Avatar' },
  uploadAvatar: { uk: 'Завантажити фото', en: 'Upload photo' },
  language: { uk: 'Мова', en: 'Language' },
  font: { uk: 'Шрифт', en: 'Font' },
  theme: { uk: 'Тема', en: 'Theme' },
  animations: { uk: 'Анімації', en: 'Animations' },
  sound: { uk: 'Звукові сповіщення', en: 'Sound notifications' },
  dark: { uk: 'Темна', en: 'Dark' },
  light: { uk: 'Світла', en: 'Light' },
  systemFont: { uk: 'System', en: 'System' },
  mono: { uk: 'Monospace', en: 'Monospace' },
  sans: { uk: 'Sans Serif', en: 'Sans Serif' },
  ukLang: { uk: 'Українська', en: 'Ukrainian' },
  enLang: { uk: 'English', en: 'English' },
};

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

const SettingsSidebar = ({ activeTab, setActiveTab, T }) => {
  const tabs = [
    { key: 'profile', icon: 'fa-solid fa-user', label: T('profile') },
    { key: 'interface', icon: 'fa-solid fa-palette', label: T('interface') },
    { key: 'notifications', icon: 'fa-solid fa-bell', label: T('notifications') },
    { key: 'about', icon: 'fa-solid fa-circle-info', label: T('about') },
  ];
  return (
    <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
      className="d-flex flex-column p-3 position-fixed top-0 start-0 h-100"
      style={{ width: '240px', backgroundColor: COLORS.surface, borderRight: `1px solid ${COLORS.border}`, zIndex: 100, backdropFilter: 'blur(10px)' }}>
      <div className="mb-4">
        <h5 className="text-white fw-bold d-flex align-items-center gap-2 mb-0"><i className="fa-solid fa-gear" style={{ color: COLORS.primary }} /> SySett</h5>
        <small className="text-secondary font-monospace">НАЛАШТУВАННЯ</small>
      </div>
      <div className="d-flex flex-column gap-2 flex-grow-1">
        {tabs.map(t => (
          <motion.button key={t.key} onClick={() => setActiveTab(t.key)}
            whileHover={{ backgroundColor: 'rgba(30,58,138,0.15)', x: 4 }}
            className="d-flex align-items-center p-3 rounded-3 border-0 w-100 text-start"
            style={{ backgroundColor: activeTab === t.key ? 'rgba(30,58,138,0.2)' : 'transparent', color: activeTab === t.key ? '#fff' : '#a1a1aa', border: activeTab === t.key ? `1px solid ${COLORS.primary}40` : '1px solid transparent', transition: 'all 0.2s' }}>
            <i className={`${t.icon} me-3`} style={{ width: '20px' }} /> {t.label}
          </motion.button>
        ))}
      </div>
      <div className="mt-auto pt-3 border-top" style={{ borderColor: COLORS.border }}>
        <motion.a href="/dashboard/" whileHover={{ x: 4, color: '#fff' }} className="d-flex align-items-center p-2 text-decoration-none" style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>
          <i className="fa-solid fa-arrow-left me-2" /> {T('backToSyFlow')}
        </motion.a>
      </div>
    </motion.div>
  );
};

// ----- ПРОФІЛЬ -----
const ProfileForm = ({ T }) => {
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/user/').then(r => r.json()).then(data => {
      setNickname(data.nickname || '');
      setBio(data.bio || '');
      setAvatarUrl(data.avatar_url || '');
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const csrfToken = getCookie('csrftoken');
    try {
      const res = await fetch('/api/user/', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
        body: JSON.stringify({ nickname, bio, avatar_url: avatarUrl }),
      });
      if (res.ok) alert('Профіль оновлено!');
      else throw new Error('Помилка збереження профілю');
    } catch (e) { console.error(e); alert('Помилка'); }
    finally { setSaving(false); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    setUploading(true);
    const csrfToken = getCookie('csrftoken');
    try {
      const res = await fetch('/api/upload-avatar/', {
        method: 'POST',
        body: formData,
        headers: { 'X-CSRFToken': csrfToken },
      });
      const data = await res.json();
      if (res.ok) setAvatarUrl(data.url);
      else alert('Помилка завантаження файлу');
    } catch (err) { console.error(err); }
    finally { setUploading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-4" style={{ backgroundColor: COLORS.glass, backdropFilter: 'blur(12px)', border: `1px solid ${COLORS.border}` }}>
      <h3 className="text-white fw-bold mb-3"><i className="fa-solid fa-user me-2" style={{ color: COLORS.primary }} /> {T('profile')}</h3>
      <div className="mb-3">
        <label className="text-secondary">{T('nickname')}</label>
        <input className="form-control bg-dark text-white border-secondary" value={nickname} onChange={e => setNickname(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="text-secondary">{T('bio')}</label>
        <textarea className="form-control bg-dark text-white border-secondary" rows="3" value={bio} onChange={e => setBio(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="text-secondary">{T('avatar')}</label>
        <div className="d-flex align-items-center gap-3">
          {avatarUrl && <img src={avatarUrl} alt="avatar" className="rounded-circle" style={{ width: '60px', height: '60px', objectFit: 'cover', border: `2px solid ${COLORS.primary}` }} />}
          <label className="btn btn-outline-secondary" style={{ borderColor: COLORS.border, color: '#a1a1aa' }}>
            {uploading ? 'Завантаження...' : T('uploadAvatar')}
            <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
          </label>
        </div>
      </div>
      <button className="btn text-white fw-bold" style={{ backgroundColor: COLORS.primary }} onClick={handleSave} disabled={saving}>
        {saving ? T('saving') : T('save')}
      </button>
    </motion.div>
  );
};

// ----- ІНТЕРФЕЙС -----
const InterfaceSettings = ({ T, settings, updateSettings, saveSettings, saving }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-4" style={{ backgroundColor: COLORS.glass, backdropFilter: 'blur(12px)', border: `1px solid ${COLORS.border}` }}>
    <h3 className="text-white fw-bold mb-3"><i className="fa-solid fa-palette me-2" style={{ color: COLORS.primary }} /> {T('interface')}</h3>
    <div className="mb-3">
      <label className="text-secondary">{T('language')}</label>
      <select className="form-control bg-dark text-white border-secondary" value={settings.language} onChange={e => updateSettings('language', e.target.value)}>
        <option value="uk">{T('ukLang')}</option>
        <option value="en">{T('enLang')}</option>
      </select>
    </div>
    <div className="mb-3">
      <label className="text-secondary">{T('font')}</label>
      <select className="form-control bg-dark text-white border-secondary" value={settings.font_family} onChange={e => updateSettings('font_family', e.target.value)}>
        <option value="system-ui, sans-serif">{T('systemFont')}</option>
        <option value='"Courier New", monospace'>{T('mono')}</option>
        <option value='"Segoe UI", Roboto, sans-serif'>{T('sans')}</option>
      </select>
    </div>
    <div className="mb-3">
      <label className="text-secondary">{T('theme')}</label>
      <select className="form-control bg-dark text-white border-secondary" value={settings.theme} onChange={e => updateSettings('theme', e.target.value)}>
        <option value="dark">{T('dark')}</option>
        <option value="light">{T('light')}</option>
      </select>
    </div>
    <div className="form-check mb-2">
      <input className="form-check-input" type="checkbox" checked={settings.animations_enabled} onChange={e => updateSettings('animations_enabled', e.target.checked)} id="anim" />
      <label className="form-check-label text-secondary" htmlFor="anim">{T('animations')}</label>
    </div>
    <div className="form-check mb-3">
      <input className="form-check-input" type="checkbox" checked={settings.sound_enabled} onChange={e => updateSettings('sound_enabled', e.target.checked)} id="sound" />
      <label className="form-check-label text-secondary" htmlFor="sound">{T('sound')}</label>
    </div>
    <button className="btn text-white fw-bold" style={{ backgroundColor: COLORS.primary }} onClick={saveSettings} disabled={saving}>
      {saving ? T('saving') : T('save')}
    </button>
  </motion.div>
);

const Placeholder = ({ title, icon }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-4 text-center" style={{ backgroundColor: COLORS.glass, border: `1px solid ${COLORS.border}` }}>
    <i className={`${icon} mb-3`} style={{ fontSize: '3rem', color: COLORS.primary, opacity: 0.5 }} />
    <h3 className="text-white fw-bold">{title}</h3>
    <p className="text-secondary">Цей розділ скоро з'явиться.</p>
  </motion.div>
);

const SettingsRP = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [lang, setLang] = useState(localStorage.getItem('syflow_lang') || 'uk');
  const [settings, setSettings] = useState({
    language: 'uk',
    font_family: 'system-ui, sans-serif',
    theme: 'dark',
    animations_enabled: true,
    sound_enabled: false,
  });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    fetch('/api/settings/')
      .then(r => r.json())
      .then(data => {
        setSettings(prev => ({ ...prev, ...data }));
        if (data.language) setLang(data.language);
      })
      .catch(console.error);
  }, []);

  const T = useCallback((key) => TRANSLATIONS[key]?.[lang] || key, [lang]);

  const updateSettings = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    if (field === 'language') setLang(value);
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    const csrfToken = getCookie('csrftoken');
    try {
      const res = await fetch('/api/settings/', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        // Застосувати налаштування глобально
        const { theme, font_family, language } = settings;
        document.body.classList.toggle('light-theme', theme === 'light');
        document.body.style.fontFamily = font_family;
        localStorage.setItem('syflow_lang', language);
        localStorage.setItem('syflow_settings', JSON.stringify(settings));
        applyStoredSettings(); // викликаємо утиліту (хоча можна й без неї)
        alert('Налаштування збережено!');
      } else {
        throw new Error('Помилка');
      }
    } catch (e) {
      console.error(e);
      alert('Помилка');
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
      className="d-flex w-100 min-vh-100" style={{ backgroundColor: COLORS.bg, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} T={T} />
      <div className="flex-grow-1 position-relative" style={{ marginLeft: '240px', padding: '2rem 3rem', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
            {activeTab === 'profile' && <ProfileForm T={T} />}
            {activeTab === 'interface' && <InterfaceSettings T={T} settings={settings} updateSettings={updateSettings} saveSettings={saveSettings} saving={savingSettings} />}
            {activeTab === 'notifications' && <Placeholder title={T('notifications')} icon="fa-solid fa-bell" />}
            {activeTab === 'about' && <Placeholder title={T('about')} icon="fa-solid fa-circle-info" />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SettingsRP;