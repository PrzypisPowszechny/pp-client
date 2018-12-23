import React from 'react';
import { connect } from 'react-redux';
import { selectModeForCurrentPage } from '../store/appModes/selectors';

import Menu from './menu/index';
import Editor from './editor/index';
import ViewerManager from './viewer/ViewerManager';
import AnnotationModeWidget from './AnnotationModeWidget/AnnotationModeWidget';
import AnnotationRequestForm from './AnnotationRequestForm/AnnotationRequestForm';
import SideWidget from './elements/SideWidget/SideWidget';
import Toast from './elements/Toast/Toast';

interface AppProps {
  editor: any;
  menuVisible: boolean;
  annotationModeWidgetVisible: boolean;
  requestModeWidgetVisible: boolean;
}

interface AppState {
  showNotification: boolean;
  notificationMessage: string;
}

@connect(
  state => ({
    editor: state.widgets.editor,
    menuVisible: state.widgets.menu.visible,
    annotationModeWidgetVisible: selectModeForCurrentPage(state).isAnnotationMode,
    requestModeWidgetVisible: selectModeForCurrentPage(state).isRequestMode,
  }),
)
export default class App extends React.Component<Partial<AppProps>, Partial<AppState>> {

  constructor(props: AppProps) {
    super(props);

    this.state = {
      showNotification: false,
     };
  }

  setNotification = (message: string) => {
    this.setState({ showNotification: true, notificationMessage: message },
      () => setTimeout(() => this.setState({ showNotification: false, notificationMessage: null }), 6000),
      );
  }

  // always updates...:
  // <Editor key={JSON.stringify(this.props.editor.range) + JSON.stringify(this.props.editor.annotationId)}/>
  render() {
    return (
      <div>
        {this.props.editor.visible && <Editor/>}
        {this.props.menuVisible && <Menu/>}
        {this.props.annotationModeWidgetVisible && <AnnotationModeWidget/>}
        {this.props.requestModeWidgetVisible &&
          <SideWidget><AnnotationRequestForm showNotification={this.setNotification} /></SideWidget>}
        {this.state.showNotification && <Toast message={this.state.notificationMessage} />}
        <ViewerManager/>
      </div>
    );
  }
}
