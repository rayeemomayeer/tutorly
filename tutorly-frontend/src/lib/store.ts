// src/lib/store.ts
import { configureStore } from "@reduxjs/toolkit";

// Import all RTK Query slices
import { authApi } from "@/features/auth/authApi";
import { tutorApi } from "@/features/tutors/tutorApi";
// import { categoryApi } from "@/features/categories/categoryApi";
import { bookingApi } from "@/features/bookings/bookingApi";
// import { reviewApi } from "@/features/reviews/reviewApi";
import { adminApi } from "@/features/admin/adminApi";
import { tutorBookingApi } from "@/features/tutorBookings/tutorBookingApi";
import { adminBookingApi } from "@/features/adminBookings/adminBookingApi";

export const store = configureStore({
  reducer: {
    // RTK Query reducers
    [authApi.reducerPath]: authApi.reducer,
    [tutorApi.reducerPath]: tutorApi.reducer,
    // [categoryApi.reducerPath]: categoryApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    // [reviewApi.reducerPath]: reviewApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [tutorBookingApi.reducerPath]: tutorBookingApi.reducer,
    [adminBookingApi.reducerPath]: adminBookingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      tutorApi.middleware,
    //   categoryApi.middleware,
      bookingApi.middleware,
    //   reviewApi.middleware,
      adminApi.middleware,
      tutorBookingApi.middleware,
      adminBookingApi.middleware
    ),
});

// Types for hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;