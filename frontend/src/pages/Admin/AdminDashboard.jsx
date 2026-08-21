import { Link } from 'react-router-dom';
import { FaUserTie, FaBalanceScale, FaCalendarCheck, FaEnvelopeOpenText, FaIdBadge, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import { getDashboardSummary, adminGetPracticeAreas } from '../../services/adminResources';
import {
  PageHeader,
  SectionCard,
  StatCard,
  StatusBadge,
  LoadingState,
  ErrorState,
  EmptyState,
} from '../../components/Admin/ui/primitives';
import { DonutChart, RankedBars } from '../../components/Admin/ui/charts';

/**
 * Administration dashboard.
 *
 * Every figure comes from GET /dashboard or GET /practice-area. Nothing is
 * fabricated.
 *
 * The reference screenshot shows total cases, clients and revenue. **This
 * backend has no case, client or billing module**, so those panels are absent
 * rather than filled with invented numbers — a dashboard that lies is worse
 * than one that is smaller than the mockup.
 *
 * What the API does supply, and what is therefore shown: lawyers, practice
 * areas, appointments by status, contact enquiries, and visitors on the
 * premises.
 */

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

export const AdminDashboard = () => {
  const { administrator } = useAuth();

  const summary = useApi(() => getDashboardSummary(), []);
  // Practice-area totals are not part of the dashboard aggregate, so they are
  // read separately rather than approximated.
  const practiceAreas = useApi(() => adminGetPracticeAreas(), [], { fallback: [] });

  const data = summary.data;

  if (summary.loading) {
    return (
      <>
        <PageHeader title="Dashboard" />
        <LoadingState rows={6} label="Loading dashboard" />
      </>
    );
  }

  if (summary.error) {
    return (
      <>
        <PageHeader title="Dashboard" />
        <SectionCard bodyClassName="p-0">
          <ErrorState error={summary.error} onRetry={summary.refetch} />
        </SectionCard>
      </>
    );
  }

  const appointments = data?.appointments ?? {};
  const lawyers = data?.lawyers ?? {};
  const visitors = data?.visitors ?? {};
  const enquiries = data?.enquiries ?? {};

  // "Other" covers completed, cancelled and no-show, which the summary rolls
  // into the total without breaking out. Never allowed below zero, so a
  // mismatch cannot render a negative slice.
  const otherAppointments = Math.max(
    0,
    (appointments.total ?? 0) - (appointments.pending ?? 0) - (appointments.confirmed ?? 0)
  );

  const areaList = Array.isArray(practiceAreas.data) ? practiceAreas.data : [];
  const activeAreas = areaList.filter((area) => area.isActive !== false);

  const areasByLawyerCount = [...areaList]
    .map((area) => ({
      label: area.name ?? area.title ?? 'Untitled',
      value: Array.isArray(area.lawyers) ? area.lawyers.length : 0,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const recentEnquiries = Array.isArray(enquiries.recent) ? enquiries.recent : [];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Signed in as ${administrator?.fullName ?? 'administrator'}. Firm-wide activity from the live database.`}
      />

      {/* ------------------------------------------------------------ metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard
          label="Lawyers"
          value={lawyers.total ?? 0}
          hint={`${lawyers.available ?? 0} available`}
          icon={FaUserTie}
        />
        <StatCard
          label="Practice areas"
          value={areaList.length}
          hint={`${activeAreas.length} active`}
          icon={FaBalanceScale}
        />
        <StatCard
          label="Appointments"
          value={appointments.total ?? 0}
          hint={`${appointments.pending ?? 0} pending`}
          icon={FaCalendarCheck}
        />
        <StatCard
          label="Enquiries"
          value={enquiries.total ?? 0}
          hint={`${enquiries.unresolved ?? 0} unresolved`}
          icon={FaEnvelopeOpenText}
        />
        <StatCard
          label="Visitors on site"
          value={visitors.onPremises ?? 0}
          hint={`${visitors.total ?? 0} logged in total`}
          icon={FaIdBadge}
        />
      </div>

      {/* ------------------------------------------------- charts and ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SectionCard title="Appointments by status">
          {(appointments.total ?? 0) === 0 ? (
            <EmptyState
              title="No appointments yet"
              description="Bookings made through the public site will appear here."
            />
          ) : (
            <DonutChart
              centerLabel="Appointments"
              total={appointments.total}
              segments={[
                { label: 'Confirmed', value: appointments.confirmed ?? 0 },
                { label: 'Pending', value: appointments.pending ?? 0 },
                { label: 'Other', value: otherAppointments },
              ]}
            />
          )}
        </SectionCard>

        <SectionCard
          title="Practice areas by lawyers assigned"
          action={
            <Link
              to="/admin/practice-areas"
              className="text-xs font-semibold text-portal-muted hover:text-portal-ink inline-flex items-center gap-1.5"
            >
              View all <FaArrowRight aria-hidden="true" className="text-[0.6rem]" />
            </Link>
          }
        >
          {practiceAreas.loading ? (
            <LoadingState rows={5} label="Loading practice areas" />
          ) : areasByLawyerCount.length === 0 ? (
            <EmptyState
              title="No practice areas yet"
              description="Add a practice area to see it here and on the public site."
            />
          ) : (
            <RankedBars items={areasByLawyerCount} valueLabel="lawyers" />
          )}
        </SectionCard>
      </div>

      {/* --------------------------------------------------- recent enquiries */}
      <SectionCard
        title="Recent enquiries"
        bodyClassName="p-0"
        action={
          <Link
            to="/admin/enquiries"
            className="text-xs font-semibold text-portal-muted hover:text-portal-ink inline-flex items-center gap-1.5"
          >
            View all <FaArrowRight aria-hidden="true" className="text-[0.6rem]" />
          </Link>
        }
      >
        {recentEnquiries.length === 0 ? (
          <EmptyState
            title="No enquiries yet"
            description="Messages sent through the public contact form will appear here."
          />
        ) : (
          <ul className="divide-y divide-portal-border">
            {recentEnquiries.map((enquiry) => (
              <li
                key={enquiry.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-4 hover:bg-portal-raised transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-portal-ink truncate">{enquiry.subject || 'No subject'}</p>
                  <p className="text-sm text-portal-muted truncate">{enquiry.name}</p>
                </div>
                <span className="text-xs text-portal-subtle tabular-nums">
                  {formatDate(enquiry.createdAt)}
                </span>
                <StatusBadge status={enquiry.status} />
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </>
  );
};

export default AdminDashboard;
