import { combineReducers } from 'redux';
import editor from './editor/reducers';
import selector from './selector/reducers';

export default combineReducers({
  editor,
  selector,
});
