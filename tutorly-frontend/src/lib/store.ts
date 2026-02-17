import { configureStore } from "@reduxjs/toolkit";
import { tutorApi } from "@/features/tutors/tutorApi";
import { authApi } from "@/features/auth/authApi";
// import { categoryApi } from "@/features/categories/categoryApi";
// import { bookingApi } from "@/features/bookings/bookingApi";
// import { reviewApi } from "@/features/reviews/reviewApi";
// import { adminApi } from "@/features/admin/adminApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [tutorApi.reducerPath]: tutorApi.reducer,
    // [categoryApi.reducerPath]: categoryApi.reducer,
    // [bookingApi.reducerPath]: bookingApi.reducer,
    // [reviewApi.reducerPath]: reviewApi.reducer,
    // [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      tutorApi.middleware,
    //   categoryApi.middleware,
    //   bookingApi.middleware,
    //   reviewApi.middleware,
    //   adminApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;