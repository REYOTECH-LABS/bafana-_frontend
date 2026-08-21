import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { AppRoutes } from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

export const App = () => {
  return (
    // reducedMotion="user" makes every animation in the app honour the OS
    // "reduce motion" setting: Framer drops transform and layout animation and
    // keeps opacity, so content still resolves without movement. Setting it
    // once here means no individual component has to remember to handle it.
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        {/* Wraps everything so the guard and the login page share one session.
            On a public page it does no work: with no stored token it settles
            immediately without calling the API. */}
        <AuthProvider>
          {/* Toasts are mounted inside the router so a confirmation can survive
              a navigation, and inside auth so a sign-out can announce itself. */}
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </MotionConfig>
  );
};

export default App;
