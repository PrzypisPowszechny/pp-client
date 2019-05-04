/*
  Import Semantic-ui packagesbut only selected components, so a not to meddle with the websites' css and js
*/

/*
  Semantic ui relies on a box-sizing reset to work, as noted in documentation here:
  https://semantic-ui.com/globals/reset.html

  However, Semantic-ui reset includes global styles (*) which we cannot afford to include as a browser extension.
  For this reason, our semantic ui reset is localised to components
  !!  with a `pp-ui`-class parent !!

  Individual semantic-ui components outside any `pp-ui` container (such as modals)
  need to wear this class tag themselves
*/

/*
 Import selected components
  */
import 'semantic-ui-css/components/label.css';
import 'semantic-ui-css/components/popup.css';
