import React from 'react';
import Menu from 'components/menu';
import Viewer from 'components/viewer';
import AnnotationViewModel from 'models/AnnotationViewModel';
import Editor from 'components/editor';
import Highlights from "../components/highlights/Highlights";

export default function App() {
  return (
    <div>
      <Highlights />
      <Menu />
    </div>
  );
}
