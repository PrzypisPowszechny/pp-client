import React from 'react';

import EditorContainer from "../containers/EditorContainer";
import Menu from "../components/menu/Menu";

export default function App() {
  return (
    <div>
      <EditorContainer />
      <Menu
        visible={true}
        locationX={150}
        locationY={300}
      />
    </div>
  );
}
