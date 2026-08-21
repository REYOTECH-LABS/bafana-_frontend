import { useState } from 'react';
import { FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { Button } from '../common/Button';
import { Field } from '../common/Field';
import { ErrorState } from '../common/States';
import { useApi } from '../../hooks/useApi';
import { createAppointment, getLawyers, getPracticeAreas } from '../../services/resources';
import { toFieldErrors } from '../../services/api';

const EMPTY = {
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  lawyerId: '',
  practiceAreaId: '',
  appointmentDate: '',
  appointmentTime: '',
  appointmentType: 'in-person',
  subject: '',
  description: '',
};

/** Today in YYYY-MM-DD, local time — used as the date input's `min`. */
const todayISO = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().split('T')[0];
};

/**
 * Mirrors the backend contract in appointment.schema.js: clientName,
 * clientEmail, clientPhone, lawyerId, practiceAreaId, appointmentDate
 * (YYYY-MM-DD), appointmentTime (HH:mm) and subject are required.
 *
 * The past-date rule matches the service-layer guard ("Cannot book appointment
 * in the past") so the user finds out before submitting rather than after.
 */
const validate = (values) => {
  const errors = {};
  if (!values.clientName.trim()) errors.clientName = 'Please enter your name';
  if (!values.clientEmail.trim()) errors.clientEmail = 'Please enter your email';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.clientEmail)) {
    errors.clientEmail = 'Enter a valid email address';
  }
  if (!values.clientPhone.trim()) errors.clientPhone = 'Please enter your phone number';
  if (!values.lawyerId) errors.lawyerId = 'Please choose a lawyer';
  if (!values.practiceAreaId) errors.practiceAreaId = 'Please choose a practice area';
  if (!values.appointmentDate) errors.appointmentDate = 'Please choose a date';
  else if (values.appointmentDate < todayISO()) {
    errors.appointmentDate = 'Please choose a date in the future';
  }
  if (!values.appointmentTime) errors.appointmentTime = 'Please choose a time';
  if (!values.subject.trim()) errors.subject = 'Please tell us what this is about';
  return errors;
};

export const AppointmentForm = () => {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [submitError, setSubmitError] = useState(null);

  // The two selects are populated from the API. No static fallback here: unlike
  // marketing copy, a booking cannot be made against stale ids — a lawyer who
  // no longer exists would fail server-side anyway, so it is better to surface
  // that the form cannot load than to offer choices that will not work.
  const lawyers = useApi(() => getLawyers({ limit: 100 }), [], { fallback: [] });
  const practiceAreas = useApi(() => getPracticeAreas(), [], { fallback: [] });

  const optionsFailed = lawyers.error || practiceAreas.error;
  const optionsLoading = lawyers.loading || practiceAreas.loading;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues(current => ({ ...current, [name]: value }));
    setErrors(current => (current[name] ? { ...current, [name]: undefined } : current));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setStatus('submitting');
    setSubmitError(null);

    try {
      await createAppointment(values);
      setStatus('success');
      setValues(EMPTY);
    } catch (error) {
      setStatus('error');
      const fieldErrors = toFieldErrors(error.errors);
      if (Object.keys(fieldErrors).length > 0) setErrors(fieldErrors);
      // Covers the conflict-detection message from appointment.service.js as
      // well as validation failures.
      setSubmitError(error.message);
    }
  };

  if (optionsFailed) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-10">
        <ErrorState
          error={lawyers.error || practiceAreas.error}
          onRetry={() => {
            lawyers.refetch();
            practiceAreas.refetch();
          }}
        />
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div
        className="bg-white rounded-xl border border-gray-200 p-10 text-center"
        role="status"
        aria-live="polite"
      >
        <FaCheckCircle aria-hidden="true" className="text-3xl text-black mb-5 mx-auto" />
        <h3 className="text-2xl font-serif font-bold text-black mb-3">Consultation requested</h3>
        <p className="text-gray-600 mb-8">
          We have received your request and will confirm your appointment by email shortly.
        </p>
        <Button variant="secondary" size="md" onClick={() => setStatus('idle')}>
          Book another consultation
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white rounded-xl border border-gray-200 p-8 md:p-10"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <Field
          label="Full name"
          name="clientName"
          value={values.clientName}
          onChange={handleChange}
          error={errors.clientName}
          autoComplete="name"
          required
        />
        <Field
          label="Email"
          name="clientEmail"
          type="email"
          value={values.clientEmail}
          onChange={handleChange}
          error={errors.clientEmail}
          autoComplete="email"
          required
        />
      </div>

      <Field
        label="Phone"
        name="clientPhone"
        type="tel"
        value={values.clientPhone}
        onChange={handleChange}
        error={errors.clientPhone}
        autoComplete="tel"
        className="mb-6"
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <Field
          label="Practice area"
          name="practiceAreaId"
          as="select"
          value={values.practiceAreaId}
          onChange={handleChange}
          error={errors.practiceAreaId}
          disabled={optionsLoading}
          required
        >
          <option value="">{optionsLoading ? 'Loading…' : 'Select a practice area'}</option>
          {practiceAreas.data.map(area => (
            <option key={area.id} value={area.id}>
              {area.title}
            </option>
          ))}
        </Field>

        <Field
          label="Lawyer"
          name="lawyerId"
          as="select"
          value={values.lawyerId}
          onChange={handleChange}
          error={errors.lawyerId}
          disabled={optionsLoading}
          required
        >
          <option value="">{optionsLoading ? 'Loading…' : 'Select a lawyer'}</option>
          {lawyers.data.map(lawyer => (
            <option key={lawyer.id} value={lawyer.id}>
              {lawyer.name}
              {lawyer.specialization ? ` — ${lawyer.specialization}` : ''}
            </option>
          ))}
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <Field
          label="Date"
          name="appointmentDate"
          type="date"
          min={todayISO()}
          value={values.appointmentDate}
          onChange={handleChange}
          error={errors.appointmentDate}
          required
        />
        <Field
          label="Time"
          name="appointmentTime"
          type="time"
          value={values.appointmentTime}
          onChange={handleChange}
          error={errors.appointmentTime}
          required
        />
        <Field
          label="Format"
          name="appointmentType"
          as="select"
          value={values.appointmentType}
          onChange={handleChange}
          error={errors.appointmentType}
        >
          <option value="in-person">In person</option>
          <option value="virtual">Virtual</option>
          <option value="phone">Phone</option>
        </Field>
      </div>

      <Field
        label="Subject"
        name="subject"
        value={values.subject}
        onChange={handleChange}
        error={errors.subject}
        placeholder="What would you like to discuss?"
        className="mb-6"
        required
      />

      <Field
        label="Additional details"
        name="description"
        as="textarea"
        rows={5}
        value={values.description}
        onChange={handleChange}
        error={errors.description}
        placeholder="Anything else we should know before the consultation? (optional)"
        className="mb-8"
      />

      {submitError && (
        <p role="alert" className="mb-6 text-sm text-red-600">
          {submitError}
        </p>
      )}

      <Button
        variant="primary"
        size="md"
        type="submit"
        disabled={status === 'submitting' || optionsLoading}
      >
        {status === 'submitting' ? 'Submitting…' : 'Request consultation'}
        {status !== 'submitting' && <FaArrowRight className="text-sm" />}
      </Button>
    </form>
  );
};

export default AppointmentForm;
