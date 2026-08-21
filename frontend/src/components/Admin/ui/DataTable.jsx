import { useId, useMemo, useState } from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { LoadingState, EmptyState, ErrorState, Button } from './primitives';

/**
 * The portal's list view.
 *
 * One component rather than a table per page, because every list needs the same
 * five things — sorting, the three data states, pagination, row actions and a
 * mobile layout — and reimplementing them per page is how they drift apart.
 *
 * Columns are declared, not rendered by the caller:
 *
 *   { key, header, render?, sortable?, align?, primary?, hideOnMobile? }
 *
 * `render(row)` returns a node; without it the raw `row[key]` is shown.
 *
 * Below `md` the table becomes a stack of cards. A table squeezed onto a
 * 390px screen is unreadable, and horizontal scrolling hides the columns that
 * matter. `primary` marks the field that becomes each card's heading;
 * `hideOnMobile` drops detail that is not worth the vertical space there.
 */
export const DataTable = ({
  columns,
  rows,
  loading,
  error,
  onRetry,
  emptyTitle = 'Nothing to show',
  emptyDescription,
  emptyAction,
  rowKey = (row) => row.id ?? row._id,
  actions,
  initialSort,
  pageSize = 0,
  caption,
}) => {
  const captionId = useId();
  const [sort, setSort] = useState(initialSort ?? null);
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    if (!sort || !Array.isArray(rows)) return rows ?? [];

    const column = columns.find((c) => c.key === sort.key);
    if (!column) return rows;

    // Copied before sorting: Array.prototype.sort mutates, and mutating the
    // array held in state would make React miss the change.
    return [...rows].sort((a, b) => {
      const av = column.sortValue ? column.sortValue(a) : a[sort.key];
      const bv = column.sortValue ? column.sortValue(b) : b[sort.key];

      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;

      const result =
        typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv), undefined, { numeric: true });

      return sort.direction === 'asc' ? result : -result;
    });
  }, [rows, sort, columns]);

  const pageCount = pageSize > 0 ? Math.ceil(sorted.length / pageSize) : 1;
  const safePage = Math.min(page, Math.max(0, pageCount - 1));
  const visible = pageSize > 0 ? sorted.slice(safePage * pageSize, safePage * pageSize + pageSize) : sorted;

  const toggleSort = (key) => {
    setPage(0);
    setSort((current) =>
      current?.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    );
  };

  if (loading) return <LoadingState rows={pageSize || 5} label="Loading records" />;
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (!sorted.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />;
  }

  const alignClass = (align) => (align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left');

  return (
    <div>
      {/* ------------------------------------------------ desktop and tablet */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          {caption && <caption id={captionId} className="sr-only">{caption}</caption>}
          <thead>
            <tr className="border-b border-portal-border">
              {columns.map((column) => {
                const isSorted = sort?.key === column.key;
                const SortIcon = !isSorted ? FaSort : sort.direction === 'asc' ? FaSortUp : FaSortDown;

                return (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={isSorted ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                    className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider text-portal-subtle ${alignClass(column.align)}`}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(column.key)}
                        className="inline-flex items-center gap-1.5 hover:text-portal-ink transition-colors uppercase tracking-wider"
                      >
                        {column.header}
                        <SortIcon aria-hidden="true" className={isSorted ? 'text-portal-ink' : 'text-portal-subtle'} />
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
              {actions && (
                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-portal-subtle">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr
                key={rowKey(row)}
                className="border-b border-portal-border last:border-0 hover:bg-portal-raised transition-colors"
              >
                {columns.map((column) => (
                  <td key={column.key} className={`px-6 py-4 text-portal-ink ${alignClass(column.align)}`}>
                    {column.render ? column.render(row) : (row[column.key] ?? '—')}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">{actions(row)}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ------------------------------------------------------------ mobile */}
      <ul className="md:hidden divide-y divide-portal-border">
        {visible.map((row) => {
          const primary = columns.find((c) => c.primary) ?? columns[0];
          const details = columns.filter((c) => c !== primary && !c.hideOnMobile);

          return (
            <li key={rowKey(row)} className="p-5">
              <div className="font-semibold text-portal-ink mb-3">
                {primary.render ? primary.render(row) : (row[primary.key] ?? '—')}
              </div>

              <dl className="space-y-2">
                {details.map((column) => (
                  <div key={column.key} className="flex items-start justify-between gap-4">
                    <dt className="text-xs uppercase tracking-wider text-portal-subtle flex-shrink-0 pt-0.5">
                      {column.header}
                    </dt>
                    <dd className="text-sm text-portal-ink text-right min-w-0">
                      {column.render ? column.render(row) : (row[column.key] ?? '—')}
                    </dd>
                  </div>
                ))}
              </dl>

              {actions && (
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-portal-border">
                  {actions(row)}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* -------------------------------------------------------- pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-portal-border">
          <p className="text-xs text-portal-muted" aria-live="polite">
            Page {safePage + 1} of {pageCount} · {sorted.length} records
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={safePage >= pageCount - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
