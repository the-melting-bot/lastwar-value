import { Evaluation } from './types';

const STORAGE_KEY = 'lastwar-evaluations';

export function saveEvaluation(evaluation: Evaluation): void {
  const evaluations = getEvaluations();
  evaluations.push(evaluation);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(evaluations));
  }
}

export function getEvaluations(): Evaluation[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as Evaluation[];
  } catch {
    return [];
  }
}

export function getLatestEvaluation(): Evaluation | null {
  const evaluations = getEvaluations();
  if (evaluations.length === 0) return null;
  return evaluations[evaluations.length - 1];
}

export function deleteEvaluation(id: string): void {
  const evaluations = getEvaluations().filter((e) => e.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(evaluations));
  }
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  // Clear all app-related localStorage keys
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('lastwar') || key.includes('evaluation') || key.includes('form'))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
  // Also explicitly remove the main storage key
  localStorage.removeItem(STORAGE_KEY);
}
