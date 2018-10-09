import React from 'react';
import Menu from './menu/index';
import Editor from './editor/index';
import { connect } from 'react-redux';
import ViewerManager from './viewer/ViewerManager';
import { selectModeForCurrentPage } from '../store/appModes/selectors';
import AnnotationModeWidget from './annotationModeWidget/AnnotationModeWidget';

interface AppProps {
  editor: any;
  menuVisible: boolean;
  annotationModeWidgetVisible: boolean;
}

@connect(
  state => ({
    editor: state.widgets.editor,
    menuVisible: state.widgets.menu.visible,
    annotationModeWidgetVisible: selectModeForCurrentPage(state).isAnnotationMode,
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
        <ViewerManager/>
      </div>
    );
  }
}
