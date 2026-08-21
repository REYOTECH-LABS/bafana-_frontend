import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { useToast } from '../../context/ToastContext';
import { adminGetSettings, adminUpdateSettings } from '../../services/adminResources';
import { PERMISSIONS } from '../../lib/permissions';
import { usePermission } from '../../components/Admin/PermissionGate';
import {
  PageHeader,
  SectionCard,
  Button,
  LoadingState,
  ErrorState,
} from '../../components/Admin/ui/primitives';
import { FormField, FormError } from '../../components/Admin/ui/FormField';

/**
 * Firm settings.
 *
 * A singleton record: GET returns the one document, PUT replaces fields on it.
 * The backend creates it on first read, so there is no "create" path.
 *
 * `phone` is an array on the model and `officeHours` an object of two strings,
 * so both are flattened for editing and rebuilt on submit — sending the raw
 * form shapes would fail validation.
 */

const emptySettings = {
  officeName: '',
  officeAddress: '',
  email: '',
  phone: '',
  weekday: '',
  weekend: '',
};

export const AdminSettings = () => {
  const { notify } = useToast();
  const canUpdate = usePermission(PERMISSIONS.SETTINGS_UPDATE);

  const { data, loading, error, refetch } = useApi(() => adminGetSettings(), []);

  const [form, setForm] = useState(emptySettings);
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Populated once the record arrives rather than initialised from it, because
  // the first render happens before the request resolves.
  useEffect(() => {
    if (!data) return;

    setForm({
      officeName: data.officeName ?? '',
      officeAddress: data.officeAddress ?? '',
      email: data.email ?? '',
      phone: Array.isArray(data.phone) ? data.phone.join(', ') : (data.phone ?? ''),
      weekday: data.officeHours?.weekday ?? '',
      weekend: data.officeHours?.weekend ?? '',
    });
  }, [data]);

  const update = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSaveError(null);

    try {
      await adminUpdateSettings({
        officeName: form.officeName,
        officeAddress: form.officeAddress,
        email: form.email,
        // The model stores phone as an array, however many numbers are given.
        phone: form.phone
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean),
        officeHours: { weekday: form.weekday, weekend: form.weekend },
      });

      notify('Settings saved.');
      await refetch();
    } catch (updateError) {
      setSaveError(updateError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Settings"
        description="Firm details used across the system. Super administrator access only."
      />

      <SectionCard title="Office details" className="max-w-3xl">
        {loading ? (
          <LoadingState rows={5} label="Loading settings" />
        ) : error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <FormError error={saveError} />

            {!canUpdate && (
              <p className="mb-5 rounded-lg bg-state-infoBg border border-portal-border px-4 py-3 text-sm text-state-infoFg">
                You can view these settings but not change them. A super administrator can grant
                the settings update permission.
              </p>
            )}

            <fieldset disabled={!canUpdate || submitting} className="space-y-4">
              <FormField
                label="Office name"
                name="officeName"
                value={form.officeName}
                onChange={update('officeName')}
              />
              <FormField
                as="textarea"
                rows={2}
                label="Office address"
                name="officeAddress"
                value={form.officeAddress}
                onChange={update('officeAddress')}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                />
                <FormField
                  label="Phone numbers"
                  name="phone"
                  value={form.phone}
                  onChange={update('phone')}
                  hint="Comma separated for more than one."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Weekday hours"
                  name="weekday"
                  value={form.weekday}
                  onChange={update('weekday')}
                  hint="For example, 8:30 AM – 5:00 PM"
                />
                <FormField
                  label="Weekend hours"
                  name="weekend"
                  value={form.weekend}
                  onChange={update('weekend')}
                />
              </div>
            </fieldset>

            {canUpdate && (
              <div className="flex justify-end mt-6">
                <Button type="submit" loading={submitting}>
                  Save settings
                </Button>
              </div>
            )}
          </form>
        )}
      </SectionCard>
    </>
  );
};

export default AdminSettings;
