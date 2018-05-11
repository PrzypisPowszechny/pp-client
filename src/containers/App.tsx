import React from 'react';
import Menu from 'components/menu';
import Viewer from 'components/viewer';
import Editor from 'components/editor';
import Highlights from 'components/highlights/Highlights';
import {connect} from 'react-redux';

interface AppProps {
  editorVisible: boolean;
  viewerVisible: boolean;
  menuVisible: boolean;
}

@connect(
  state => ({
    editorVisible: state.widgets.editor.visible,
    viewerVisible: state.widgets.viewer.visible,
    menuVisible: state.widgets.menu.visible,
  }),
)
export default class App extends React.Component<Partial<AppProps>> {

  render() {
    return (
      <div>
        {this.props.editorVisible && <Editor/>}
        {this.props.viewerVisible && <Viewer/>}
        {this.props.menuVisible && <Menu/>}
        <Highlights/>
      </div>
    );
  }
}
