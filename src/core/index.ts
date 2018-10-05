export { default as Highlighter } from './Highlighter';
export { default as TextSelector } from './TextSelector';

// The node within which annotations are made
// It's lazy so operations on DOM can be done here if needed
export function annotationRootNode() {
  return document.body;
}
