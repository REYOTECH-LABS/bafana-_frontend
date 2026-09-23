import { useState } from 'react';
import { FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { Button } from '../common/Button';
import { Field } from '../common/Field';
import { createEnquiry } from '../../services/resources';
import { toFieldErrors } from '../../services/api';

const EMPTY = { name: '', email: '', phone: '', subject: '', message: '' };

/**
 * Client-side validation mirrors the backend Zod contract
 * (contact.schema.js: name, email, phone, subject, message all required) so the
 * two agree. The server remains the authority — this only saves a round trip.
 */
const validate = (values) => {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Please enter your name';
  if (!values.email.trim()) errors.email = 'Please enter your email';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter a valid email address';
  if (!values.phone.trim()) errors.phone = 'Please enter your phone number';
  if (!values.subject.trim()) errors.subject = 'Please enter a subject';
  if (!values.message.trim()) errors.message = 'Please enter your message';
  return errors;
};

export const ContactForm = () => {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues(current => ({ ...current, [name]: value }));
    // Clear the field's error as soon as the user starts correcting it —
    // leaving it visible while they type reads as the form arguing with them.
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
      await createEnquiry(values);
      setStatus('success');
      setValues(EMPTY);
    } catch (error) {
      setStatus('error');
      // A 400 carries a per-field list; map it back onto the inputs so the
      // user sees which field the server objected to.
      const fieldErrors = toFieldErrors(error.errors);
      if (Object.keys(fieldErrors).length > 0) setErrors(fieldErrors);
      setSubmitError(error.message);
    }
  };

  if (status === 'success') {
    return (
      <div
        className="bg-white border border-ivory-200 border-t-2 border-t-gold-500 p-10 text-center"
        role="status"
        aria-live="polite"
      >
        <FaCheckCircle aria-hidden="true" className="text-3xl text-gold-600 mb-5 mx-auto" />
        <h3 className="text-2xl font-serif font-bold text-charcoal mb-3">Message received</h3>
        <p className="text-gray-600 mb-8">
          Thank you for getting in touch. A member of our team will respond shortly.
        </p>
        <Button variant="secondary" size="md" onClick={() => setStatus('idle')}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white border border-ivory-200 border-t-2 border-t-gold-500 p-6 sm:p-8 md:p-10 shadow-[0_30px_60px_-35px_rgba(20,20,20,0.25)]"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <Field
          label="Full name"
          name="name"
          value={values.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Your name"
          autoComplete="name"
          required
        />
        <Field
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <Field
          label="Phone"
          name="phone"
          type="tel"
          value={values.phone}
          onChange={handleChange}
          error={errors.phone}
          placeholder="+233 …"
          autoComplete="tel"
          required
        />
        <Field
          label="Subject"
          name="subject"
          value={values.subject}
          onChange={handleChange}
          error={errors.subject}
          placeholder="What is this about?"
          required
        />
      </div>

      <Field
        label="Message"
        name="message"
        as="textarea"
        rows={6}
        value={values.message}
        onChange={handleChange}
        error={errors.message}
        placeholder="Tell us how we can help."
        className="mb-8"
        required
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
        disabled={status === 'submitting'}
        className="w-full sm:w-auto disabled:opacity-60 disabled:cursor-wait"
      >
        {status === 'submitting' ? 'Sending…' : 'Send message'}
        {status !== 'submitting' && <FaArrowRight className="text-sm" />}
      </Button>
    </form>
  );
};

export default ContactForm;
