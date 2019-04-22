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
import { trySelectStorage, selectUser } from '../../common/store/storage/selectors';

interface AppProps {
  isStorageInitialized: boolean;
  user: any;
  editorVisible: boolean;
  menuVisible: boolean;
  annotationModeWidgetVisible: boolean;
  annotationRequestFormVisible: boolean;
  notificationVisible: boolean;
}

@connect(
  (state) => {
    const tab = selectTab(state);
    return {
      isStorageInitialized: Boolean(trySelectStorage(state)),
      user: selectUser(state),
      editorVisible: tab.widgets.editor.visible,
      menuVisible: tab.widgets.menu.visible,
      annotationRequestFormVisible: tab.widgets.annotationRequestForm.visible,
      notificationVisible: tab.widgets.notification.visible,
      annotationModeWidgetVisible: selectModeForCurrentPage(state).isAnnotationMode,
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
          {this.props.annotationRequestFormVisible && <SideWidget><AnnotationRequestForm/></SideWidget>}
          {this.props.notificationVisible && <Toast/>}
          <ViewerManager/>
        </div>
      );
    } else {
      return null;
    }
  }
}
