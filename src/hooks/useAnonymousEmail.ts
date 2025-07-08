import { useState, useEffect } from "react";

const ANONYMOUS_EMAIL_KEY = "mural_anonymous_email";

export const useAnonymousEmail = () => {
  const [anonymousEmail, setAnonymousEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Gerar um email anônimo único
  const generateAnonymousEmail = (): string => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    return `anon_${timestamp}_${randomId}@mural.local`;
  };

  // Carregar ou criar email anônimo
  const loadOrCreateAnonymousEmail = (): string => {
    const stored = localStorage.getItem(ANONYMOUS_EMAIL_KEY);
    
    if (stored) {
      return stored;
    }
    
    const newEmail = generateAnonymousEmail();
    localStorage.setItem(ANONYMOUS_EMAIL_KEY, newEmail);
    return newEmail;
  };

  // Resetar email anônimo (criar novo)
  const resetAnonymousEmail = (): string => {
    const newEmail = generateAnonymousEmail();
    localStorage.setItem(ANONYMOUS_EMAIL_KEY, newEmail);
    setAnonymousEmail(newEmail);
    return newEmail;
  };

  useEffect(() => {
    const email = loadOrCreateAnonymousEmail();
    setAnonymousEmail(email);
    setLoading(false);
  }, []);

  return {
    anonymousEmail,
    loading,
    resetAnonymousEmail,
  };
}; 