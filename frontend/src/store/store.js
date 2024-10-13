import { configureStore } from "@reduxjs/toolkit"
import authReducer from './auth-slice'
import adminProductsSlice from './admin/productsSlice';
import shopProductsSlice from './shop/productsSlice';
import shopCartSlice from './shop/cartSlice';
import shopAddressSlice from './shop/addressSlice';
import shopOrderSlice from './shop/orderSlice'
import adminOrderSlice from './admin/orderSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        adminProducts: adminProductsSlice,
        shopProducts: shopProductsSlice,
        shopCart: shopCartSlice,
        shopAddress: shopAddressSlice,
        shopOrder: shopOrderSlice,
        adminOrder:adminOrderSlice,
    }
})


export default store;