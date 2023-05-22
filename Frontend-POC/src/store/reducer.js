import {combineReducers} from 'redux';
import entitiesReducer from './entities';
// import authReducer from './auth/auth';
import uiReducer from './ui/ui';

export default combineReducers({
    entities: entitiesReducer,
    // auth: authReducer,
    ui: uiReducer,
});