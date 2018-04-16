import React from 'react';

import AnnotationViewModel from 'models/AnnotationViewModel';

import Editor from 'components/editor';
import Menu from 'components/menu';
import Viewer from 'components/viewer';

export default function App() {

  const annotation = new AnnotationViewModel({id: 1});
    // mock data to display
  annotation.comment = 'Testowy komentarz '.repeat(10);
  annotation.referenceLinkTitle = 'Strona organizacji XYZ '.repeat(3);
  annotation.doesBelongToUser = true;

  return (
    <div>
      <EditorContainer />
      <Menu
        visible={true}
        locationX={150}
        locationY={300}
      />
      <Viewer
        locationX={100}
        locationY={700}
        annotations={[annotation]}
      />
    </div>
  );
}
