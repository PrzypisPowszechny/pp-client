import React from 'react';
import { connect } from 'react-redux';

import { selectUser, trySelectStorage } from 'common/store/storage/selectors';
import { selectTab } from 'common/store/tabs/selectors';
import { selectModeForCurrentPage } from 'common/store/tabs/tab/appModes/selectors';

import AnnotationForm from './AnnotationForm/AnnotationForm';
import AnnotationModeWidget from './AnnotationModeWidget/AnnotationModeWidget';
import AnnotationRequestForm from './AnnotationRequestForm/AnnotationRequestForm';
import Editor from './editor/index';
import SideWidget from './elements/SideWidget/SideWidget';
import Toast from './elements/Toast/Toast';
import Menu from './menu/index';
import ViewerManager from './viewer/ViewerManager';

import { IAnnotationFormState, IAnnotationRequestFormState } from '../../common/store/tabs/tab/widgets';

interface AppProps {
  isStorageInitialized: boolean;
  user: any;
  editorVisible: boolean;
  menuVisible: boolean;
  annotationModeWidgetVisible: boolean;
  notificationVisible: boolean;
  annotationRequestForm: IAnnotationRequestFormState;
  annotationForm: IAnnotationFormState;
}

@connect(
  (state) => {
    const tab = selectTab(state);
    return {
      isStorageInitialized: Boolean(trySelectStorage(state)),
      user: selectUser(state),
      editorVisible: tab.widgets.editor.visible,
      menuVisible: tab.widgets.menu.visible,
      annotationModeWidgetVisible: selectModeForCurrentPage(state).isAnnotationMode,
      notificationVisible: tab.widgets.notification.visible,
      annotationRequestForm: tab.widgets.annotationRequestForm,
      annotationForm: tab.widgets.annotationForm,
    };
  },
)
export default class App extends React.Component<Partial<AppProps>, {}> {

  constructor(props: AppProps) {
    super(props);
  }

  render() {
    const { isStorageInitialized, user } = this.props;
    if (isStorageInitialized && user) {
      const { annotationForm, annotationRequestForm } = this.props;
      return (
        <div>
          {this.props.editorVisible && <Editor/>}
          {this.props.menuVisible && <Menu/>}
          {this.props.annotationModeWidgetVisible && <AnnotationModeWidget/>}
          {this.props.notificationVisible && <Toast/>}
          {annotationRequestForm.visible &&
          <SideWidget><AnnotationRequestForm key={annotationRequestForm.initialData.quote}/></SideWidget>
          }
          {annotationForm.visible &&
          <SideWidget><AnnotationForm key={annotationForm.annotationRequestId}/></SideWidget>
          }
          <ViewerManager/>
        </div>
      );
    } else {
      return null;
    }
  }
}
