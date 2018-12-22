import React from 'react';
import { connect } from 'react-redux';
import { selectModeForCurrentPage } from '../store/appModes/selectors';

import Menu from './menu/index';
import Editor from './editor/index';
import ViewerManager from './viewer/ViewerManager';
import AnnotationModeWidget from './AnnotationModeWidget/AnnotationModeWidget';
import AnnotationRequestForm from './AnnotationRequestForm/AnnotationRequestForm';
import SideWidget from './elements/SideWidget/SideWidget';

interface AppProps {
  editor: any;
  menuVisible: boolean;
  annotationModeWidgetVisible: boolean;
  requestModeWidgetVisible: boolean;
}

@connect(
  state => ({
    editor: state.widgets.editor,
    menuVisible: state.widgets.menu.visible,
    annotationModeWidgetVisible: selectModeForCurrentPage(state).isAnnotationMode,
    requestModeWidgetVisible: selectModeForCurrentPage(state).isRequestMode,
  }),
)
export default class App extends React.Component<Partial<AppProps>> {
  // always updates...:
  // <Editor key={JSON.stringify(this.props.editor.range) + JSON.stringify(this.props.editor.annotationId)}/>
  render() {
    return (
      <div>
        {this.props.editor.visible && <Editor/>}
        {this.props.menuVisible && <Menu/>}
        {this.props.annotationModeWidgetVisible && <AnnotationModeWidget/>}
        {this.props.requestModeWidgetVisible && <SideWidget><AnnotationRequestForm/></SideWidget>}
        <ViewerManager/>
      </div>
    );
  }
}
