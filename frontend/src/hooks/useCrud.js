import { useCallback, useMemo, useState } from 'react';
import { useApi } from './useApi';
import { useToast } from '../context/ToastContext';

/**
 * The lifecycle every management page shares.
 *
 * Twelve pages each need: fetch a list, filter it, open a form for a new or
 * existing record, submit, confirm a delete, refresh, and report the outcome.
 * Written per page that is twelve chances for the states to drift apart, so it
 * lives here once.
 *
 *   const crud = useCrud({
 *     list: adminGetLawyers,
 *     create: adminCreateLawyer,
 *     update: adminUpdateLawyer,
 *     remove: adminDeleteLawyer,
 *     label: 'Lawyer',
 *     searchFields: ['fullName', 'email'],
 *   });
 *
 * Operations the API does not offer are simply left out of the config, and the
 * corresponding handler stays undefined — so a page cannot offer an action the
 * backend has no route for.
 */
export const useCrud = ({
  list,
  create,
  update,
  remove,
  label = 'Record',
  searchFields = [],
  deps = [],
}) => {
  const { notify } = useToast();
  const { data, loading, error, refetch } = useApi(() => list(), deps, { fallback: [] });

  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {…} = edit
  const [deleting, setDeleting] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const rows = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  /**
   * Client-side filtering.
   *
   * Deliberate: these collections are small — a firm has tens of lawyers, not
   * thousands — and filtering in memory keeps typing instant with no request
   * per keystroke. A collection that outgrows this wants a server-side query
   * parameter instead.
   */
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term || searchFields.length === 0) return rows;

    return rows.filter((row) =>
      searchFields.some((field) => {
        const value = field.split('.').reduce((acc, key) => acc?.[key], row);
        return String(value ?? '').toLowerCase().includes(term);
      })
    );
  }, [rows, search, searchFields]);

  const openCreate = useCallback(() => {
    setFormError(null);
    setEditing({});
  }, []);

  const openEdit = useCallback((row) => {
    setFormError(null);
    setEditing(row);
  }, []);

  const closeForm = useCallback(() => {
    setEditing(null);
    setFormError(null);
  }, []);

  const idOf = (row) => row?.id ?? row?._id;

  const submit = useCallback(
    async (payload) => {
      setSubmitting(true);
      setFormError(null);

      try {
        const existingId = idOf(editing);

        if (existingId) {
          await update(existingId, payload);
          notify(`${label} updated.`);
        } else {
          await create(payload);
          notify(`${label} created.`);
        }

        setEditing(null);
        await refetch();
        return true;
      } catch (submitError) {
        // Kept in state rather than thrown: the dialog stays open with the
        // administrator's input intact so they can correct and resubmit.
        setFormError(submitError);
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [editing, update, create, refetch, notify, label]
  );

  const confirmDelete = useCallback(async () => {
    if (!deleting) return;

    setSubmitting(true);
    try {
      await remove(idOf(deleting));
      notify(`${label} deleted.`);
      setDeleting(null);
      await refetch();
    } catch (deleteError) {
      setDeleting(null);
      // Surfaced through the list's own error slot rather than a toast, so the
      // reason stays on screen.
      setFormError(deleteError);
    } finally {
      setSubmitting(false);
    }
  }, [deleting, remove, refetch, notify, label]);

  /** Wraps a one-shot action such as confirm, resolve or toggle. */
  const runAction = useCallback(
    async (action, successMessage) => {
      try {
        await action();
        notify(successMessage);
        await refetch();
        return true;
      } catch (actionError) {
        setFormError(actionError);
        return false;
      }
    },
    [refetch, notify]
  );

  return {
    rows,
    filtered,
    loading,
    error,
    refetch,
    search,
    setSearch,
    editing,
    isCreating: editing !== null && !idOf(editing),
    openCreate: create ? openCreate : undefined,
    openEdit: update ? openEdit : undefined,
    closeForm,
    submit,
    submitting,
    formError,
    setFormError,
    deleting,
    requestDelete: remove ? setDeleting : undefined,
    cancelDelete: () => setDeleting(null),
    confirmDelete,
    runAction,
  };
};

export default useCrud;
