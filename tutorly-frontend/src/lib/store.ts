import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/features/auth/authApi";
import { tutorApi } from "@/features/tutors/tutorApi";
// import { categoryApi } from "@/features/categories/categoryApi";
import { bookingApi } from "@/features/bookings/bookingApi";
import { reviewApi } from "@/features/reviews/reviewApi";
import { adminApi } from "@/features/admin/adminApi";
// import { tutorBookingApi } from "@/features/tutorBookings/tutorBookingApi";
import { adminBookingApi } from "@/features/adminBookings/adminBookingApi";
import { adminCategoryApi } from "@/features/adminCategories/adminCategoryApi";
import { adminDashboardApi } from "@/features/adminDashboard/adminDashboardApi";
import authReducer from "@/features/auth/authSlice";
import { availabilityApi } from "@/features/availability/availabilityApi";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [tutorApi.reducerPath]: tutorApi.reducer,
    [availabilityApi.reducerPath]: availabilityApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    // [tutorBookingApi.reducerPath]: tutorBookingApi.reducer,
    [adminBookingApi.reducerPath]: adminBookingApi.reducer,
    [adminCategoryApi.reducerPath]: adminCategoryApi.reducer,
    [adminDashboardApi.reducerPath]: adminDashboardApi.reducer,
    
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      tutorApi.middleware,
      availabilityApi.middleware,
    //   categoryApi.middleware,
      bookingApi.middleware,
      reviewApi.middleware,
      adminApi.middleware,
      // tutorBookingApi.middleware,
      adminBookingApi.middleware,
      adminCategoryApi.middleware,
      adminDashboardApi.middleware
    ),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;