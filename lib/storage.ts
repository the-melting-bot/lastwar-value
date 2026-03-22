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
