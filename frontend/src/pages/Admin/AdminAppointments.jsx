import { useState } from 'react';
import { useCrud } from '../../hooks/useCrud';
import {
  adminGetAppointments,
  adminDeleteAppointment,
  adminConfirmAppointment,
  adminCompleteAppointment,
  adminCancelAppointment,
} from '../../services/adminResources';
import { PERMISSIONS } from '../../lib/permissions';
import { PermissionGate } from '../../components/Admin/PermissionGate';
import {
  PageHeader,
  SectionCard,
  Button,
  StatusBadge,
  SearchInput,
  FilterSelect,
  Modal,
  ConfirmDialog,
  StatCard,
} from '../../components/Admin/ui/primitives';
import { DataTable } from '../../components/Admin/ui/DataTable';
import { FormError } from '../../components/Admin/ui/FormField';

/**
 * Appointment operations.
 *
 * Bookings arrive from the public site's appointment form. Administrators do
 * not create them here — there is no operational reason to, and the public
 * form is the only path the backend expects — so this page moves them through
 * their status lifecycle instead.
 *
 * The API exposes confirm, complete and cancel as distinct transitions rather
 * than a free-form status field, so those are the actions offered.
 */

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

export const AdminAppointments = () => {
  const [status, setStatus] = useState('all');
  const [viewing, setViewing] = useState(null);

  const crud = useCrud({
    list: adminGetAppointments,
    remove: adminDeleteAppointment,
    label: 'Appointment',
    searchFields: ['clientName', 'clientEmail', 'subject'],
  });

  const visible = crud.filtered.filter((row) => status === 'all' || row.status === status);

  const countOf = (value) => crud.rows.filter((row) => row.status === value).length;

  const columns = [
    {
      key: 'clientName',
      header: 'Client',
      sortable: true,
      primary: true,
      render: (row) => (
        <div className="min-w-0">
          <p className="font-medium text-portal-ink">{row.clientName}</p>
          <p className="text-sm text-portal-muted truncate">{row.clientEmail}</p>
        </div>
      ),
    },
    { key: 'subject', header: 'Subject', render: (row) => <span className="truncate">{row.subject || '—'}</span> },
    {
      key: 'appointmentDate',
      header: 'Date',
      sortable: true,
      sortValue: (row) => new Date(row.appointmentDate ?? 0).getTime(),
      render: (row) => (
        <span className="whitespace-nowrap tabular-nums">
          {formatDate(row.appointmentDate)}
          {row.appointmentTime ? ` · ${row.appointmentTime}` : ''}
        </span>
      ),
    },
    { key: 'status', header: 'Status', sortable: true, render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <>
      <PageHeader
        title="Appointments"
        description="Consultation requests submitted through the public website."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total" value={crud.rows.length} />
        <StatCard label="Pending" value={countOf('pending')} hint="Awaiting confirmation" />
        <StatCard label="Confirmed" value={countOf('confirmed')} />
        <StatCard label="Completed" value={countOf('completed')} />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <SearchInput value={crud.search} onChange={crud.setSearch} placeholder="Search client, email or subject" />
        <FilterSelect
          value={status}
          onChange={setStatus}
          label="Filter by status"
          options={[
            { value: 'all', label: 'All statuses' },
            { value: 'pending', label: 'Pending' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
            { value: 'no-show', label: 'No show' },
          ]}
        />
        <p className="text-sm text-portal-muted ml-auto" aria-live="polite">
          {visible.length} of {crud.rows.length}
        </p>
      </div>

      {crud.formError && (
        <div className="mb-6">
          <FormError error={crud.formError} />
        </div>
      )}

      <SectionCard bodyClassName="p-0">
        <DataTable
          caption="Appointments"
          columns={columns}
          rows={visible}
          loading={crud.loading}
          error={crud.error}
          onRetry={crud.refetch}
          pageSize={15}
          initialSort={{ key: 'appointmentDate', direction: 'desc' }}
          emptyTitle={crud.rows.length ? 'No matching appointments' : 'No appointments yet'}
          emptyDescription={
            crud.rows.length
              ? 'Adjust the search or filter to see more.'
              : 'Bookings made on the public site will appear here.'
          }
          actions={(row) => {
            const id = row.id ?? row._id;

            return (
              <>
                <Button variant="secondary" size="sm" onClick={() => setViewing(row)}>
                  View
                </Button>

                <PermissionGate permission={PERMISSIONS.APPOINTMENT_UPDATE}>
                  {row.status === 'pending' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => crud.runAction(() => adminConfirmAppointment(id), 'Appointment confirmed.')}
                    >
                      Confirm
                    </Button>
                  )}
                  {row.status === 'confirmed' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => crud.runAction(() => adminCompleteAppointment(id), 'Appointment completed.')}
                    >
                      Complete
                    </Button>
                  )}
                  {['pending', 'confirmed'].includes(row.status) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => crud.runAction(() => adminCancelAppointment(id), 'Appointment cancelled.')}
                    >
                      Cancel
                    </Button>
                  )}
                </PermissionGate>

                <PermissionGate permission={PERMISSIONS.APPOINTMENT_DELETE}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-state-dangerFg hover:bg-state-dangerBg"
                    onClick={() => crud.requestDelete(row)}
                  >
                    Delete
                  </Button>
                </PermissionGate>
              </>
            );
          }}
        />
      </SectionCard>

      <Modal open={viewing !== null} onClose={() => setViewing(null)} title="Appointment detail">
        {viewing && (
          <dl className="space-y-4 text-sm">
            {[
              ['Client', viewing.clientName],
              ['Email', viewing.clientEmail],
              ['Phone', viewing.clientPhone],
              ['Subject', viewing.subject],
              ['Date', `${formatDate(viewing.appointmentDate)}${viewing.appointmentTime ? ` at ${viewing.appointmentTime}` : ''}`],
              ['Duration', viewing.duration ? `${viewing.duration} minutes` : null],
              ['Type', viewing.appointmentType],
              ['Location', viewing.location],
              ['Description', viewing.description],
            ]
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <div key={label} className="flex flex-col sm:flex-row sm:gap-6">
                  <dt className="w-32 flex-shrink-0 text-xs uppercase tracking-wider text-portal-subtle pt-0.5">
                    {label}
                  </dt>
                  <dd className="text-portal-ink">{value}</dd>
                </div>
              ))}

            <div className="flex flex-col sm:flex-row sm:gap-6">
              <dt className="w-32 flex-shrink-0 text-xs uppercase tracking-wider text-portal-subtle pt-0.5">
                Status
              </dt>
              <dd>
                <StatusBadge status={viewing.status} />
              </dd>
            </div>
          </dl>
        )}
      </Modal>

      <ConfirmDialog
        open={crud.deleting !== null}
        onCancel={crud.cancelDelete}
        onConfirm={crud.confirmDelete}
        loading={crud.submitting}
        title="Delete appointment"
        message={`Permanently delete the appointment for ${crud.deleting?.clientName ?? 'this client'}? Cancelling instead keeps the record for reference.`}
      />
    </>
  );
};

export default AdminAppointments;
