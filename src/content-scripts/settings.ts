import scopeStyles from '../css/common/vars/scope.scss';
import selectionStyles from 'css/selection.scss';

/*
 * Elements wearing this class will be ignored in viewer mouseleave handling
 * (their mouseenter will not trigger viewer disappearance)
 */
export const PPViewerIndirectChildClass = 'pp-viewer-indirect-child';

export const PPViewerHoverContainerClass = 'pp-viewer-hover-container';

export const PPScopeClass = scopeStyles['pp-scope-class'];

/*
 * Classes outside the main article content;
 * Elements belonging to other browser extensions or other typical containers such as "recommended articles"
 * could be excluded, too.
 */
export const outsideArticleClasses = [
  PPScopeClass,
];

export const PPHighlightClass = selectionStyles['pp-highlight-class'];

// The node within which annotations are made
// It's lazy so operations on DOM can be done here if needed
export function annotationRootNode() {
  return document.body;
}

export const quoteContextWidth = 100;

/*
 * Constants used within e2e tests -- special classes set only to make possible detection of selected elements
 */

