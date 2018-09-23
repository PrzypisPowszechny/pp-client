import { annotationPPCategoriesLabels } from '../api/annotations';

export function formatPriority(priority) {
  return `${priority} - ${annotationPPCategoriesLabels[priority]}`;
}

export function formatBoolean(val: boolean) {
  return val ? 'True' : 'False';
}

export function formatReason(reason) {
  return `${reason}`;
}
