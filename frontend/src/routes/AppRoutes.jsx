import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { RequireAuth } from '../components/Admin/RequireAuth';
import { AdminLayout } from '../components/Admin/AdminLayout';
import { ADMIN_LOGIN_PATH } from './adminPaths';

import { AdminLogin } from '../pages/Admin/AdminLogin';
import { AdminDashboard } from '../pages/Admin/AdminDashboard';
import { AdminLawyers } from '../pages/Admin/AdminLawyers';
import { AdminPracticeAreas } from '../pages/Admin/AdminPracticeAreas';
import { AdminAppointments } from '../pages/Admin/AdminAppointments';
import { AdminEnquiries } from '../pages/Admin/AdminEnquiries';
import { AdminVisitors } from '../pages/Admin/AdminVisitors';
import { AdminTestimonials } from '../pages/Admin/AdminTestimonials';
import { AdminPosts } from '../pages/Admin/AdminPosts';
import { AdminAnnouncements } from '../pages/Admin/AdminAnnouncements';
import { AdminContent } from '../pages/Admin/AdminContent';
import { AdminAdministrators } from '../pages/Admin/AdminAdministrators';
import { AdminSettings } from '../pages/Admin/AdminSettings';
import { AdminProfile } from '../pages/Admin/AdminProfile';

import { Home } from '../pages/Home/Home';
import { About } from '../pages/About/About';
import { PracticeAreasPage } from '../pages/PracticeAreas/PracticeAreas';
import { Lawyers } from '../pages/Lawyers/Lawyers';
import { Testimonials } from '../pages/Testimonials/Testimonials';
import { Blog } from '../pages/Blog/Blog';
import { BlogPost } from '../pages/Blog/BlogPost';
import { Contact } from '../pages/Contact/Contact';
import { Appointment } from '../pages/Appointment/Appointment';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="practice-areas" element={<PracticeAreasPage />} />
        <Route path="lawyers" element={<Lawyers />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="blog" element={<Blog />} />
        {/* Slug, not id — matches the public read route on the API and gives
            readable, shareable URLs. */}
        <Route path="blog/:slug" element={<BlogPost />} />
        <Route path="contact" element={<Contact />} />
        <Route path="book-appointment" element={<Appointment />} />
      </Route>

      {/* Administrator portal.

          Deliberately outside MainLayout: the public navbar, footer and page
          transition must not appear here, and nothing on the public site links
          to these paths. The URL is not a secret and is not treated as one —
          every administrator endpoint enforces authentication and permissions
          server-side, so reaching a page without rights returns 403 from the
          API rather than data. */}
      <Route path={ADMIN_LOGIN_PATH} element={<AdminLogin />} />

      <Route element={<RequireAuth />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="lawyers" element={<AdminLawyers />} />
          <Route path="practice-areas" element={<AdminPracticeAreas />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="visitors" element={<AdminVisitors />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="administrators" element={<AdminAdministrators />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="profile" element={<AdminProfile />} />
          {/* An unknown /admin path lands on the dashboard rather than the
              public site, which would drop the administrator out of the portal. */}
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
