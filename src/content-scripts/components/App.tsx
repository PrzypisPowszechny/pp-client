import React from 'react';
import { connect } from 'react-redux';
import { selectModeForCurrentPage } from 'common/store/tabs/tab/appModes/selectors';

import Menu from './menu/index';
import Editor from './editor/index';
import ViewerManager from './viewer/ViewerManager';
import AnnotationModeWidget from './AnnotationModeWidget/AnnotationModeWidget';
import AnnotationRequestForm from './AnnotationRequestForm/AnnotationRequestForm';
import SideWidget from './elements/SideWidget/SideWidget';
import Toast from './elements/Toast/Toast';
import { selectTab } from 'common/store/tabs/selectors';
import { selectIsStorageInitialized, selectUser } from '../../common/store/storage/selectors';
import annotationLocator from '../modules/annotation-locator';
import { annotationLocationNotifier } from '../modules';
import highlightManager from '../modules/highlight-manager';

interface AppProps {
  isStorageInitialized: boolean;
  user: any;
  editorVisible: boolean;
  menuVisible: boolean;
  annotationModeWidgetVisible: boolean;
  requestModeWidgetVisible: boolean;
  notificationVisible: boolean;
}

@connect(
  (state) => {
    const tab = selectTab(state);
    return {
      isStorageInitialized: selectIsStorageInitialized(state),
      user: selectUser(state),
      editorVisible: tab.widgets.editor.visible,
      menuVisible: tab.widgets.menu.visible,
      notificationVisible: tab.widgets.notification.visible,
      annotationModeWidgetVisible: selectModeForCurrentPage(state).isAnnotationMode,
      requestModeWidgetVisible: selectModeForCurrentPage(state).isRequestMode,
    };
  },
)
export default class App extends React.Component<Partial<AppProps>, {}> {

  constructor(props: AppProps) {
    super(props);
  }

  render() {
    if (this.props.isStorageInitialized && this.props.user) {
      return (
        <div>
          {this.props.editorVisible && <Editor/>}
          {this.props.menuVisible && <Menu/>}
          {this.props.annotationModeWidgetVisible && <AnnotationModeWidget/>}
          {this.props.requestModeWidgetVisible && <SideWidget><AnnotationRequestForm/></SideWidget>}
          {this.props.notificationVisible && <Toast/>}
          <ViewerManager/>
        </div>
      );
    } else {
      return null;
    }
  }
}
