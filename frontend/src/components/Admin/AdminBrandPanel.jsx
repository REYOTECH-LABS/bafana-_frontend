import { FaBalanceScale } from 'react-icons/fa';
import loginBackground from '../../../images/login_background.png';

/**
 * The login page's left-hand panel: photograph, branding and a short message.
 *
 * The wordmark is typeset rather than using images/bafana_logo.jpeg, which has
 * a flat white background and would show as a white rectangle on this dark
 * treatment — the same reason the site footer sets the name in type.
 *
 * Hidden below `lg`, where the form takes the full width and the photograph
 * becomes the page background instead.
 */
export const AdminBrandPanel = () => {
  return (
    <div className="relative hidden lg:flex lg:w-[45%] xl:w-1/2 flex-col justify-between p-12 overflow-hidden">
      <img
        src={loginBackground}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Two layers: a flat wash to knock the photograph back, and a vertical
          gradient so the text at top and bottom sits on near-solid colour. */}
      <div aria-hidden="true" className="absolute inset-0 bg-admin-bg/70" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-admin-bg via-admin-bg/40 to-admin-bg"
      />

      <div className="relative flex items-center gap-3">
        <span className="w-11 h-11 rounded-full border border-gold-500/40 flex items-center justify-center">
          <FaBalanceScale aria-hidden="true" className="text-gold-500 text-lg" />
        </span>
        <span className="font-serif text-xl font-bold tracking-wide text-white">
          BAFANA<span className="text-gold-500">@</span>LAW
          <span className="block text-[0.6rem] font-sans font-medium tracking-[0.3em] text-admin-muted mt-0.5">
            ATTORNEYS · CONSULTANTS
          </span>
        </span>
      </div>

      <div className="relative">
        {/* The gold rule echoes the reference's accent bar beside the heading. */}
        <div className="border-l-2 border-gold-500 pl-5 mb-5">
          <h2 className="font-serif text-4xl font-bold text-white leading-tight">
            Welcome back
          </h2>
        </div>
        <p className="text-admin-muted leading-relaxed max-w-sm text-base">
          The practice is running. Sign in to manage appointments, lawyer
          profiles, practice areas and client enquiries.
        </p>
      </div>

      <p className="relative text-xs text-admin-muted/70 leading-relaxed">
        © {new Date().getFullYear()} Bafana@Law Attorneys &amp; Consultants.
        <br />
        Internal system — authorised personnel only.
      </p>
    </div>
  );
};

export default AdminBrandPanel;
