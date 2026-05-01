export function applyStoredSettings() {
  const settings = JSON.parse(localStorage.getItem('syflow_settings') || '{}');
  if (settings.theme) {
    document.body.classList.toggle('light-theme', settings.theme === 'light');
  }
  if (settings.font_family) {
    document.body.style.fontFamily = settings.font_family;
  }
  if (settings.language) {
    localStorage.setItem('syflow_lang', settings.language);
  }
}

export function getCurrentLanguage() {
  return localStorage.getItem('syflow_lang') || 'uk';
}