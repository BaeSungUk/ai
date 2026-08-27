import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import { SignupPage, LoginPage } from "./pages/AuthPages.jsx";
import HotelsPage from "./pages/HotelsPage.jsx";
import HotelDetailPage from "./pages/HotelDetailPage.jsx";
import {
  ReservationsPage,
  ReservationDetailPage,
  CompletePage,
} from "./pages/ReservationsPages.jsx";
function Guard({ children }) {
  return useAuth().isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="hotels" element={<HotelsPage />} />
            <Route path="hotels/:id" element={<HotelDetailPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route
              path="reservations"
              element={
                <Guard>
                  <ReservationsPage />
                </Guard>
              }
            />
            <Route
              path="reservations/complete"
              element={
                <Guard>
                  <CompletePage />
                </Guard>
              }
            />
            <Route
              path="reservations/:id"
              element={
                <Guard>
                  <ReservationDetailPage />
                </Guard>
              }
            />
            <Route
              path="*"
              element={
                <section className="section">
                  <h1>페이지를 찾을 수 없습니다.</h1>
                </section>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
