'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';

// Rate limiting
const RATE_LIMIT_KEY = 'stromplan_last_submit';
const RATE_LIMIT_MINUTES = 5;

export default function UploadForm() {
  const t = useTranslations('uploadForm');
  const locale = useLocale(); // Get current language
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sendReport: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Debug: log when file state changes
  useEffect(() => {
    console.log('🔄 File state changed:', file ? file.name : 'No file');
    console.log('🔄 Button should be:', file && !isSubmitting ? 'enabled' : 'disabled');
  }, [file, isSubmitting]);

  // Check rate limit on mount
  useEffect(() => {
    const lastSubmit = localStorage.getItem(RATE_LIMIT_KEY);
    if (lastSubmit) {
      const timePassed = Date.now() - parseInt(lastSubmit);
      const minutesPassed = timePassed / (1000 * 60);
      if (minutesPassed < RATE_LIMIT_MINUTES) {
        const remainingMinutes = Math.ceil(RATE_LIMIT_MINUTES - minutesPassed);
        setError(t('rateLimitError', { minutes: remainingMinutes }));
      }
    }
  }, [t]);

  // Validate file
  const validateFile = (file: File): string | null => {
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

    // Check size
    if (file.size > MAX_SIZE) {
      return t('fileTooLarge');
    }

    // Check type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return t('invalidFileType');
    }

    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'jpg', 'jpeg', 'png'].includes(extension || '')) {
      return t('invalidFileExtension');
    }

    return null;
  };

  // Generate preview for images
  const generatePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      const validation = validateFile(selectedFile);

      if (validation) {
        setValidationError(validation);
        return;
      }

      setValidationError(null);
      setFile(selectedFile);
      generatePreview(selectedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📁 File input changed');
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      console.log('📁 Selected file:', selectedFile.name, selectedFile.size, 'bytes');
      const validation = validateFile(selectedFile);

      if (validation) {
        console.log('❌ File validation failed:', validation);
        setValidationError(validation);
        return;
      }

      console.log('✅ File validation passed');
      setValidationError(null);
      setFile(selectedFile);
      console.log('✅ File state updated');
      generatePreview(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🚀 Form submit triggered!');
    console.log('File:', file);
    console.log('Email:', formData.email);
    console.log('Name:', formData.name);

    setIsSubmitting(true);
    setError(null);

    // Check rate limit
    const lastSubmit = localStorage.getItem(RATE_LIMIT_KEY);
    if (lastSubmit) {
      const timePassed = Date.now() - parseInt(lastSubmit);
      const minutesPassed = timePassed / (1000 * 60);
      if (minutesPassed < RATE_LIMIT_MINUTES) {
        const remainingMinutes = Math.ceil(RATE_LIMIT_MINUTES - minutesPassed);
        console.log('❌ Rate limit hit');
        setError(t('rateLimitError', { minutes: remainingMinutes }));
        setIsSubmitting(false);
        return;
      }
    }

    if (!file) {
      console.log('❌ No file selected');
      setError(t('noFileError'));
      setIsSubmitting(false);
      return;
    }

    if (!formData.email) {
      console.log('❌ No email provided');
      setError('Email is required');
      setIsSubmitting(false);
      return;
    }

    // Final validation
    const validation = validateFile(file);
    if (validation) {
      setError(validation);
      setIsSubmitting(false);
      return;
    }

    try {
      // Create FormData to send file and form fields
      const formDataToSend = new FormData();

      // Add the file
      formDataToSend.append('file', file);

      // Add form fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('sendReport', formData.sendReport.toString());

      // Add language (IMPORTANT!)
      formDataToSend.append('language', locale);
      formDataToSend.append('locale', locale);

      // Add metadata
      formDataToSend.append('fileName', file.name);
      formDataToSend.append('fileSize', file.size.toString());
      formDataToSend.append('fileType', file.type);
      formDataToSend.append('timestamp', new Date().toISOString());

      // Add browser info
      formDataToSend.append('userAgent', navigator.userAgent);
      formDataToSend.append('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);

      console.log('📤 Sending to API route...');
      console.log('Language:', locale);
      console.log('Email:', formData.email);
      console.log('File:', file.name, file.size, 'bytes');

      // Send to our API route (which will forward to n8n webhook)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataToSend,
        signal: controller.signal,
        // Don't set Content-Type header - browser will set it automatically with boundary
      });

      clearTimeout(timeoutId);

      console.log('✅ Response received:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Error response:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ API response:', result);

      // Save submission data for success screen
      setSubmissionData({
        email: formData.email,
        fileName: file.name,
        fileSize: (file.size / 1024 / 1024).toFixed(2),
        language: locale,
        timestamp: new Date().toLocaleString(locale)
      });

      // Set rate limit
      localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());

      setIsSubmitting(false);
      setSubmitted(true);

    } catch (err: any) {
      console.error('Error submitting form:', err);

      if (err.name === 'AbortError') {
        setError(t('timeoutError'));
      } else if (err.message.includes('Failed to fetch')) {
        setError(t('networkError'));
      } else {
        setError(err instanceof Error ? err.message : t('genericError'));
      }

      setIsSubmitting(false);
    }
  };

  if (submitted && submissionData) {
    return (
      <section id="upload-form" className="py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Success Animation */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mb-6 animate-bounce-slow shadow-2xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {t('successTitle')}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                {t('successMessage')}
              </p>
            </div>

            {/* Submission Details Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t('submissionDetails')}
              </h3>

              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-700 dark:to-slate-600 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">{t('emailSentTo')}</p>
                    <p className="text-gray-900 dark:text-white font-medium">{submissionData.email}</p>
                  </div>
                </div>

                {/* File Info */}
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-700 dark:to-slate-600 rounded-lg">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">{t('uploadedFile')}</p>
                    <p className="text-gray-900 dark:text-white font-medium">{submissionData.fileName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{submissionData.fileSize} MB</p>
                  </div>
                </div>

                {/* Language */}
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-700 dark:to-slate-600 rounded-lg">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">{t('reportLanguage')}</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {submissionData.language === 'de' && '🇦🇹 Deutsch'}
                      {submissionData.language === 'en' && '🇬🇧 English'}
                      {submissionData.language === 'ru' && '🇷🇺 Русский'}
                    </p>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-slate-700 dark:to-slate-600 rounded-lg">
                  <svg className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">{t('submittedAt')}</p>
                    <p className="text-gray-900 dark:text-white font-medium">{submissionData.timestamp}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-lg p-6 mb-8">
              <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {t('whatHappensNext')}
              </h4>
              <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{t('nextStep1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{t('nextStep2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{t('nextStep3')}</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFile(null);
                  setFilePreview(null);
                  setFormData({ name: '', email: '', phone: '', sendReport: true });
                }}
                className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                {t('uploadAnother')}
              </button>
              <a
                href={`/${locale}`}
                className="px-8 py-4 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 text-primary-600 dark:text-primary-400 border-2 border-primary-600 dark:border-primary-400 rounded-lg font-semibold text-lg transition-all text-center"
              >
                {t('backToHome')}
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="upload-form" className="py-20 bg-white dark:bg-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="px-6 py-2 bg-green-500 text-white rounded-full font-bold text-lg">
                🎉 {t('freeBadge')}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('subtitle')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-700 dark:to-slate-800 rounded-2xl shadow-xl p-8 md:p-12">
            {/* File Upload Area */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                {t('billLabel')} *
              </label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-300 dark:border-slate-600 hover:border-primary-400'
                }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />

                {!file ? (
                  <>
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      {t('dragDrop')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {t('fileTypes')}
                    </p>
                    <label
                      htmlFor="file-upload"
                      className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold cursor-pointer transition-colors"
                    >
                      {t('selectFile')}
                    </label>
                  </>
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-lg p-4">
                    {/* File Preview for Images */}
                    {filePreview && (
                      <div className="mb-4">
                        <img
                          src={filePreview}
                          alt="File preview"
                          className="max-h-64 mx-auto rounded-lg shadow-md border-2 border-green-200 dark:border-green-700"
                        />
                      </div>
                    )}

                    {/* File Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {filePreview ? (
                          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                        )}
                        <div className="text-left">
                          <p className="font-semibold text-gray-900 dark:text-white">{file.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setFilePreview(null);
                          setValidationError(null);
                        }}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title={t('removeFile')}
                      >
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    {/* Success message */}
                    <div className="mt-3 flex items-center gap-2 text-green-600 dark:text-green-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">{t('fileUploaded')}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Validation Error */}
              {validationError && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="font-semibold">{validationError}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  {t('nameLabel')}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-colors"
                  placeholder={t('namePlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  {t('emailLabel')} *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-colors"
                  placeholder={t('emailPlaceholder')}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  {t('phoneLabel')}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-colors"
                  placeholder={t('phonePlaceholder')}
                />
              </div>
            </div>

            {/* Checkbox for PDF report */}
            <div className="mb-8">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sendReport}
                  onChange={(e) => setFormData({...formData, sendReport: e.target.checked})}
                  className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t('sendReportLabel')}
                </span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700 dark:text-red-300 font-semibold">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!file || isSubmitting}
              onClick={(e) => {
                console.log('🖱️ Submit button clicked!');
                console.log('Event:', e);
                console.log('Button disabled?', !file || isSubmitting);
                console.log('Has file?', !!file);
                console.log('File object:', file);
                console.log('Is submitting?', isSubmitting);
                console.log('Form data:', formData);

                // If button is disabled, log why
                if (!file) {
                  console.log('❌ BUTTON DISABLED: No file selected');
                }
                if (isSubmitting) {
                  console.log('❌ BUTTON DISABLED: Already submitting');
                }
              }}
              className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('analyzing')}
                </span>
              ) : (
                t('submitButton')
              )}
            </button>

            {/* Debug info - показываем почему кнопка отключена */}
            {!file && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 text-center">
                ⚠️ Пожалуйста, сначала выберите файл
              </p>
            )}

            {/* Privacy Notice */}
            <p className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400">
              {t('privacyNotice')}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
