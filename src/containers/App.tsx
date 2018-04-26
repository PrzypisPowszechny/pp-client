import React from 'react';
import Menu from 'components/menu';
import Viewer from 'components/viewer';
import Editor from 'components/editor';
import Highlights from 'components/highlights/Highlights';

export default function App() {
  return (
    <div>
      <Editor />
      <Highlights />
      <Menu />
      <Viewer />
    </div>
  );
}
