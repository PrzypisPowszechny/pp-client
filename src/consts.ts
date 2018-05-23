
/*
 * Elements wearing this class will be ignored in viewer mouseleave handling
 * (their mouseenter will not trigger viewer disappearance)
 */
export const PPViewerIndirectChildClass = 'pp-viewer-indirect-child';

// IMPORTANT: Keep it in sync with css/common/vars/scope
export const PPScopeClass = 'pp-ui';

/*
 * Classes outside the main article content;
 * Elements belonging to other browser extensions or other typical containers such as "recommended articles"
 * could be excluded, too.
 */
export const outsideArticleClasses = [
  PPScopeClass,
];

// IMPORTANT: Keep it in sync with css/selection.scss
export const PPHighlightClass = 'pp-highlight';
