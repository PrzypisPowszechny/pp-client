import { annotationPrioritiesLabels } from '../api/annotations';

export function formatPriority(priority) {
  return `${priority} - ${annotationPrioritiesLabels[priority]}`;
}

export function formatBoolean(val: boolean) {
  return val ? 'True' : 'False';
}

export function formatReason(reason) {
  return `${reason}`;
}
