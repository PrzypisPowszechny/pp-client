import React from 'react';
import Menu from "../components/menu/Menu";
import Viewer from "../components/viewer/Viewer";
import AnnotationViewModel from "../models/AnnotationViewModel";
import Editor from "../components/editor/Editor";

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
