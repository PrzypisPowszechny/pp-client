import React from 'react';
import { connect } from 'react-redux';
import Editor from '../components/editor/Editor';
import {IEditorState} from "../reducers/editor";

interface IEditorContainerProps {
  editor?: IEditorState;
}

@connect(state => ({
  editor: state.editor,
}))
class EditorContainer extends React.Component<
  IEditorContainerProps,
  {}
  > {

  render() {
    const editor = this.props.editor;
    return (
      <Editor
        visible={editor.visible}
        invertedX={editor.inverted.x}
        invertedY={editor.inverted.y}
        locationX={editor.location.x}
        locationY={editor.location.y}
      />
    );
  }

}

export default EditorContainer;
