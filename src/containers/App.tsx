import React from 'react';
import Menu from 'components/menu';
import Viewer from 'components/viewer';
import Editor from 'components/editor';
import Highlights from 'components/highlights/Highlights';
import {connect} from 'react-redux';

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
  render() {
    const editorKey = {
      annotationId: this.props.editor.annotationId,
      range: this.props.editor.range,
    };
    return (
      <div>
        {this.props.editor.visible && <Editor key={JSON.stringify(editorKey)}/> }
        {this.props.viewerVisible && <Viewer/>}
        {this.props.menuVisible && <Menu/>}
        <Highlights/>
      </div>
    );
  }
}
