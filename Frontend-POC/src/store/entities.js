import { combineReducers } from 'redux';
import transactionsReducer from './transactions/transactions';
import walletsReducer from './wallets/wallets';
// import categoriesReducer from './categories/categories';
// import grievancesReducer from './grievances/grievances';
// import appointmentsReducer from './timeTable/appointments';
// import appointmentsRequestReducer from './appointmentsRequests/appointmentsRequsets';
// import documentsRequestsReducer from './documentsRequests/documentsRequests';
// import announcementsReducer from './announcements/announcements';
// import chatsReducer from './chats/chats';
// import staffRatingsReducer from './staffRatings/staffRatings';

export default combineReducers({
    transactions: transactionsReducer,
    wallets: walletsReducer,
    // categories: categoriesReducer,
    // chats: chatsReducer,
    // grievances: grievancesReducer,
    // appointments: appointmentsReducer,
    // appointmentsRquest: appointmentsRequestReducer,
    // documentsRequests: documentsRequestsReducer,
    // announcements: announcementsReducer,
    // ratings: staffRatingsReducer

});