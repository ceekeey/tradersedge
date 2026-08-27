import { Routes, Route } from 'react-router-dom';
import { SignIn, SignUp, NotFound, Landing, DashboardHome, Trade, Journal, Notes, Rules, Sanctuary, Profile, TradeDetails, ForgotPassword, ResetPassword } from "./../pages/"

import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<DashboardHome />} />
                    <Route path="/dashboard/trade" element={<Trade />} />
                    <Route path="/dashboard/journal" element={<Journal />} />
                    <Route path="/dashboard/notes" element={<Notes />} />
                    <Route path="/dashboard/rules" element={<Rules />} />
                    <Route path="/dashboard/sanctuary" element={<Sanctuary />} />
                    <Route path="/dashboard/profile" element={<Profile />} />

                    <Route path="/journal/:id" element={<TradeDetails />} />
                </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
