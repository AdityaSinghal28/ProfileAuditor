/**
 * Unified API Client for ProfileAuditor frontend.
 * Encapsulates all backend HTTP interactions with proper error handling and base URL configuration.
 */

import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000,
});

export const resumeService = {
  /**
   * Upload and process a resume file
   */
  uploadResume: async (formData) => {
    const response = await apiClient.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Extract raw text from resume for live editing
   */
  extractText: async (formData) => {
    const response = await apiClient.post('/resume/extract-text', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Convert uploaded PDF/DOC to rich HTML
   */
  convertPdfToDoc: async (formData) => {
    const response = await apiClient.post('/resume/convert-pdf-to-doc', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Export edited resume as Word (.docx) file
   */
  exportDocx: async (rawText, documentName = 'Optimized_Resume') => {
    const response = await apiClient.post(
      '/resume/export-docx',
      { raw_text: rawText, document_name: documentName },
      { responseType: 'blob' }
    );
    return response.data;
  },

  /**
   * Fetch parsed resume data by ID
   */
  getResume: async (resumeId) => {
    const response = await apiClient.get(`/resume/${resumeId}`);
    return response.data;
  },
};

export const verificationService = {
  /**
   * Check verification results for a resume
   */
  getVerification: async (resumeId) => {
    const response = await apiClient.get(`/verification/${resumeId}`);
    return response.data;
  },

  /**
   * Initiate verification against GitHub and LeetCode
   */
  startVerification: async (resumeId, handles = {}) => {
    const response = await apiClient.post(`/verification/${resumeId}`, handles);
    return response.data;
  },
};

export const scoreService = {
  /**
   * Retrieve calculated Reality Score and breakdown
   */
  getScore: async (resumeId) => {
    const response = await apiClient.get(`/score/${resumeId}`);
    return response.data;
  },

  /**
   * Evaluate live ATS health score and JD fit in real-time
   */
  evaluateLiveAts: async (resumeText, jobDescription = null) => {
    const response = await apiClient.post('/score/live-ats', {
      resume_text: resumeText,
      job_description: jobDescription,
    });
    return response.data;
  },
};

export const inviteService = {
  /**
   * Send interview invitation email to candidate
   */
  sendInvite: async (resumeId, inviteDetails) => {
    const response = await apiClient.post(`/invite/${resumeId}`, inviteDetails);
    return response.data;
  },
};

export default {
  resume: resumeService,
  verification: verificationService,
  score: scoreService,
  invite: inviteService,
};

