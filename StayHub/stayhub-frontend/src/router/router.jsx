import { createBrowserRouter } from "react-router";

import RootLayout from "../layouts/RootLayout.jsx";

import ProtectedRoute from "../components/ProtectedRoute.jsx";

import HotelListPage from "../pages/HotelListPage.jsx";
import HotelDetailPage from "../pages/HotelDetailPage.jsx";
import HotelFormPage from "../pages/HotelFormPage.jsx";
import SignupPage from "../pages/SignupPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import ReservationListPage from "../pages/ReservationListPage.jsx";
import ReservationDetailPage from "../pages/ReservationDetailPage.jsx";
import ReservationCompletePage from "../pages/ReservationCompletePage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import MyHotelPage from "../pages/MyHotelPage.jsx";
import RoomFormPage from "../pages/RoomFormPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,

    children: [
      {
        index: true,
        element: <HotelListPage />,
      },

      {
        path: "signup",
        element: <SignupPage />,
      },

      {
        path: "login",
        element: <LoginPage />,
      },

      {
        path: "hotels/:hotelId",

        element: <HotelDetailPage />,
      },

      {
        path: "hotels/new",

        element: (
          <ProtectedRoute>
            <HotelFormPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "hotels/:hotelId/edit",

        element: (
          <ProtectedRoute>
            <HotelFormPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "reservations",

        element: (
          <ProtectedRoute>
            <ReservationListPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "reservations/complete",

        element: (
          <ProtectedRoute>
            <ReservationCompletePage />
          </ProtectedRoute>
        ),
      },

      {
        path: "reservations/:reservationId",

        element: (
          <ProtectedRoute>
            <ReservationDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "hotels/:hotelId/rooms/new",

        element: (
          <ProtectedRoute>
            <RoomFormPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "rooms/:roomId/edit",

        element: (
          <ProtectedRoute>
            <RoomFormPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "*",
        element: <NotFoundPage />,
      },
      {
        path: "my-hotels",

        element: (
          <ProtectedRoute>
            <MyHotelPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
