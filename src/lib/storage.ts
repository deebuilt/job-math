import { SavedJob } from "./types";

const STORAGE_KEY = "profit-calc-jobs";

export function loadJobs(): SavedJob[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveJob(job: SavedJob): void {
  const jobs = loadJobs();
  jobs.unshift(job);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

export function deleteJob(id: string): void {
  const jobs = loadJobs().filter((j) => j.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

export function clearAllJobs(): void {
  localStorage.removeItem(STORAGE_KEY);
}
