import { useState } from 'react';
import { useCrud } from '../../hooks/useCrud';
import {
  adminGetVisitors,
  adminCheckOutVisitor,
  adminDeleteVisitor,
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
  ConfirmDialog,
  StatCard,
} from '../../components/Admin/ui/primitives';
import { DataTable } from '../../components/Admin/ui/DataTable';
import { FormError } from '../../components/Admin/ui/FormField';

/**
 * Reception visitor log.
 *
 * Visitors sign themselves in from the QR code at reception, so records are
 * not created here. What reception needs from this page is to see who is
 * currently in the building and to check people out — which is what it offers.
 *
 * A missing `checkOutTime` is what "on premises" means; the backend uses the
 * same rule for the dashboard figure.
 */

const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString(undefined, {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

export const AdminVisitors = () => {
  const [presence, setPresence] = useState('all');

  const crud = useCrud({
    list: adminGetVisitors,
    remove: adminDeleteVisitor,
    label: 'Visitor',
    searchFields: ['fullName', 'name', 'email', 'phone', 'purpose', 'personToVisit'],
  });

  const isOnSite = (row) => !row.checkOutTime;

  const visible = crud.filtered.filter((row) => {
    if (presence === 'on-site') return isOnSite(row);
    if (presence === 'departed') return !isOnSite(row);
    return true;
  });

  const onSiteCount = crud.rows.filter(isOnSite).length;

  const columns = [
    {
      key: 'fullName',
      header: 'Visitor',
      sortable: true,
      primary: true,
      sortValue: (row) => row.fullName ?? row.name ?? '',
      render: (row) => (
        <div className="min-w-0">
          <p className="font-medium text-portal-ink">{row.fullName ?? row.name ?? '—'}</p>
          {row.email && <p className="text-sm text-portal-muted truncate">{row.email}</p>}
        </div>
      ),
    },
    { key: 'purpose', header: 'Purpose', render: (row) => <span className="truncate">{row.purpose || '—'}</span> },
    {
      key: 'personToVisit',
      header: 'Visiting',
      hideOnMobile: true,
      render: (row) => row.personToVisit || '—',
    },
    {
      key: 'checkInTime',
      header: 'Checked in',
      sortable: true,
      sortValue: (row) => new Date(row.checkInTime ?? row.createdAt ?? 0).getTime(),
      render: (row) => (
        <span className="whitespace-nowrap tabular-nums text-portal-muted">
          {formatDateTime(row.checkInTime ?? row.createdAt)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) =>
        isOnSite(row) ? (
          <StatusBadge tone="success" label="On premises" />
        ) : (
          <StatusBadge tone="neutral" label={`Left ${formatDateTime(row.checkOutTime)}`} />
        ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Visitors"
        description="Reception sign-in log. Visitors register themselves from the QR code at the front desk."
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="On premises now" value={onSiteCount} />
        <StatCard label="Total logged" value={crud.rows.length} />
        <StatCard label="Departed" value={crud.rows.length - onSiteCount} />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <SearchInput value={crud.search} onChange={crud.setSearch} placeholder="Search visitor, purpose or host" />
        <FilterSelect
          value={presence}
          onChange={setPresence}
          label="Filter by presence"
          options={[
            { value: 'all', label: 'All visitors' },
            { value: 'on-site', label: 'On premises' },
            { value: 'departed', label: 'Departed' },
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
          caption="Visitor log"
          columns={columns}
          rows={visible}
          loading={crud.loading}
          error={crud.error}
          onRetry={crud.refetch}
          pageSize={20}
          initialSort={{ key: 'checkInTime', direction: 'desc' }}
          emptyTitle={crud.rows.length ? 'No matching visitors' : 'No visitors logged yet'}
          emptyDescription={
            crud.rows.length
              ? 'Adjust the search or filter to see more.'
              : 'Sign-ins from the reception QR code will appear here.'
          }
          actions={(row) => (
            <>
              <PermissionGate permission={PERMISSIONS.VISITOR_UPDATE}>
                {isOnSite(row) && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      crud.runAction(() => adminCheckOutVisitor(row.id ?? row._id), 'Visitor checked out.')
                    }
                  >
                    Check out
                  </Button>
                )}
              </PermissionGate>

              <PermissionGate permission={PERMISSIONS.VISITOR_DELETE}>
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
          )}
        />
      </SectionCard>

      <ConfirmDialog
        open={crud.deleting !== null}
        onCancel={crud.cancelDelete}
        onConfirm={crud.confirmDelete}
        loading={crud.submitting}
        title="Delete visitor record"
        message="Permanently delete this sign-in record? Visitor logs are often kept for security purposes."
      />
    </>
  );
};

export default AdminVisitors;
