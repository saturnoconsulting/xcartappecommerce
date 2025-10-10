import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import cartReducer from './reducers/cartReducer.js';
import UserReducer from './reducers/userReducer';
//import customerReducer from './reducers/customerReducer';


const store = configureStore({
    reducer: {
        cart: cartReducer,
        user: UserReducer,
        //customer: customerReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
});

export const ReduxProvider = ({ children }) => (
    <Provider store={store}>
        {children}
    </Provider>
);