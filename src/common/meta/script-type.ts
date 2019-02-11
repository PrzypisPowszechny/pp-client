enum ScriptType {
  background,
  contentScript,
  popup,
}

let scriptType;

function getScriptType() {
  if (scriptType === undefined) {
    throw new Error(
      'Script type referenced but not set. Set your script type at the beginning of the entry point');
  }
  return scriptType;
}

function setScriptType(type: ScriptType) {
  console.log(type);
  scriptType = type;
}

export {
  setScriptType,
  getScriptType,
  ScriptType,
};
