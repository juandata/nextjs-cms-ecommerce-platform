import { createSlice } from "@reduxjs/toolkit";
import { setStorageData } from "../utils/useLocalStorage";

const CART = "CART";

const initialState = {
  loaded: false,
  coupon: {
    code: "",
    discount: 0,
  },
  items: [],
  billingInfo: {
    fullName: "",
    phone: "",
    email: "",
    house: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  },
  shippingInfo: {
    fullName: "",
    phone: "",
    email: "",
    house: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  },
  deliveryInfo: {
    type: "",
    area: "",
    cost: 0,
  },
  wishlist: 0,
  compare: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemExists = state.items.find(
        (item) => item._id === action.payload._id
      );
      const itemExistsWithQty = itemExists && action.payload.qty > 1;
      if (itemExistsWithQty) {
        itemExists.qty = itemExists.qty + action.payload.qty;
      } else if (itemExists) {
        itemExists.qty++;
      } else {
        state.items.push({ ...action.payload });
      }
      setStorageData(CART, state);
    },
    addVariableProductToCart: (state, action) => {
      const itemExists = state.items.find(
        (item) =>
          item._id === action.payload._id &&
          item.color.name == action.payload.color.name &&
          item.attribute.name == action.payload.attribute.name
      );
      const itemExistsWithQty = itemExists && action.payload.qty > 1;
      if (itemExistsWithQty) {
        itemExists.qty = itemExists.qty + action.payload.qty;
      } else if (itemExists) {
        itemExists.qty++;
      } else {
        state.items.push({ ...action.payload });
      }
      setStorageData(CART, state);
    },
    incrementQuantity: (state, action) => {
      const item = state.items.find((item) => item.uid === action.payload);
      item.qty++;
      setStorageData(CART, state);
    },
    decrementQuantity: (state, action) => {
      const item = state.items.find((item) => item.uid === action.payload);
      if (item.qty === 1) {
        const index = state.items.findIndex(
          (item) => item.uid === action.payload
        );
        state.items.splice(index, 1);
      } else {
        item.qty--;
      }
      setStorageData(CART, state);
    },
    removeFromCart: (state, action) => {
      const index = state.items.findIndex(
        (item) => item.uid === action.payload
      );
      state.items.splice(index, 1);
      setStorageData(CART, state);
    },
    updateCart: (state, action) => {
      const {
        coupon,
        items,
        shippingInfo,
        billingInfo,
        deliveryInfo,
        compare,
        wishlist,
      } = action.payload;
      const _coupon = coupon ? coupon : { code: "", discount: 0 };
      const _items = items ? items : [];
      const shippingData = shippingInfo
        ? shippingInfo
        : initialState.shippingInfo;
      const billingData = billingInfo ? billingInfo : initialState.billingInfo;
      const deliveryData = deliveryInfo
        ? deliveryInfo
        : initialState.deliveryInfo;
      const _compare = compare ? compare : [];
      const _wishlist = wishlist ? wishlist : 0;
      state.coupon = _coupon;
      state.items.push(..._items);
      state.billingInfo = billingData;
      state.shippingInfo = shippingData;
      state.deliveryInfo = deliveryData;
      state.compare = _compare;
      state.wishlist = _wishlist;
      state.loaded = true;
    },
    resetCart: (state, action) => {
      const { coupon, items, billingInfo, shippingInfo, deliveryInfo } =
        initialState;
      state.coupon = coupon;
      state.items = items;
      state.billingInfo = billingInfo;
      state.shippingInfo = shippingInfo;
      state.deliveryInfo = deliveryInfo;
      setStorageData(CART, state);
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload;
      setStorageData(CART, state);
    },
    updateBillingData: (state, action) => {
      state.billingInfo = action.payload.billingInfo;
      state.shippingInfo = action.payload.shippingInfo;
      state.deliveryInfo = action.payload.deliveryInfo;
      setStorageData(CART, state);
    },
    updateWishlist: (state, action) => {
      state.wishlist = action.payload;
      setStorageData(CART, state);
    },
    updateComparelist: (state, action) => {
      state.compare = action.payload;
      setStorageData(CART, state);
    },
  },
});

export const cartReducer = cartSlice.reducer;

export const {
  addToCart,
  addVariableProductToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  updateCart,
  resetCart,
  applyCoupon,
  updateBillingData,
  updateWishlist,
  updateComparelist,
} = cartSlice.actions;
