import React from 'react';
import Menu from 'components/menu';
import Viewer from 'components/viewer';
import AnnotationViewModel from 'models/AnnotationViewModel';
import Editor from 'components/editor';

export default function App() {

  const annotation = new AnnotationViewModel({id: 1});
    // mock data to display
  annotation.comment = 'Testowy komentarz '.repeat(10);
  annotation.referenceLinkTitle = 'Strona organizacji XYZ '.repeat(3);
  annotation.doesBelongToUser = true;

  return (
    <div>
      <Editor />
      <Menu />
      <Viewer
        locationX={100}
        locationY={700}
        annotations={[annotation]}
      />
    </div>
  );
}
