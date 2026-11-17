import React from 'react';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'mr', label: 'मराठी' },
  { code: 'hi', label: 'हिन्दी' },
];

export const LanguageSwitcher = ({ compact = false }) => {
  const { i18n, t } = useTranslation();
  const currentLanguage = languages.some(({ code }) => code === i18n.resolvedLanguage)
    ? i18n.resolvedLanguage
    : 'en';

  return (
    <label className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-slate-textDark shadow-sm">
      <Languages className="h-4 w-4 shrink-0 text-brand-forest" aria-hidden="true" />
      {!compact && <span className="sr-only sm:not-sr-only">{t('Language')}</span>}
      <select
        aria-label={t('Language')}
        value={currentLanguage}
        onChange={(event) => i18n.changeLanguage(event.target.value)}
        className="max-w-[7rem] cursor-pointer bg-transparent font-semibold outline-none focus-visible:ring-2 focus-visible:ring-brand-forest"
      >
        {languages.map(({ code, label }) => (
          <option key={code} value={code}>{label}</option>
        ))}
      </select>
    </label>
  );
};

export default LanguageSwitcher;
