import { combineReducers } from 'redux';
import editor from './editor/reducers';
import selector from './selector/reducers';
import annotations from './annotations/reducers';

export default combineReducers({
  annotations,
  editor,
  selector,
});
