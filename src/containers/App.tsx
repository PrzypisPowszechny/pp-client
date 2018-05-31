import React from 'react';
import Menu from 'components/menu';
import Viewer from 'components/viewer';
import Editor from 'components/editor';
import { connect } from 'react-redux';
import { handlers } from '../init/handlers';
import ViewerManager from '../components/viewer/ViewerManager';

interface AppProps {
  editor: any;
  viewerVisible: boolean;
  menuVisible: boolean;
}

@connect(
  state => ({
    editor: state.widgets.editor,
    viewerVisible: state.widgets.viewer.visible,
    menuVisible: state.widgets.menu.visible,
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
        <ViewerManager highlighter={handlers.highlighter}/>
      </div>
    );
  }
}
