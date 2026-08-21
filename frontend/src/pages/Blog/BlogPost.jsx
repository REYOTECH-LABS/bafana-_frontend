import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { Image } from '../../components/common/Image';
import { LoadingState, ErrorState } from '../../components/common/States';
import { Reveal } from '../../animations/Reveal';
import { useApi } from '../../hooks/useApi';
import { getPostBySlug } from '../../services/resources';

/**
 * Single article, addressed by slug.
 *
 * The backend returns 404 for a draft rather than 403, so an unpublished post
 * is indistinguishable from one that never existed — the error state handles
 * both identically without leaking the editorial pipeline.
 */
export const BlogPost = () => {
  const { slug } = useParams();

  const { data: post, loading, error, refetch } = useApi(
    () => getPostBySlug(slug),
    [slug]
  );

  return (
    <main>
      <article className="section-padding">
        <div className="container-custom max-w-3xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black font-semibold mb-10 transition-colors"
          >
            <FaArrowLeft aria-hidden="true" className="text-sm" />
            Back to insights
          </Link>

          {loading && <LoadingState count={1} columns="" label="Loading article" />}

          {!loading && error && (
            <ErrorState
              error={
                error.status === 404
                  ? { ...error, message: 'That article could not be found. It may have been moved or unpublished.' }
                  : error
              }
              onRetry={error.status === 404 ? undefined : refetch}
            />
          )}

          {!loading && !error && post && (
            <Reveal>
              {post.publishedAt && (
                <time
                  dateTime={post.publishedAt}
                  className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-600 mb-5"
                >
                  {new Date(post.publishedAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              )}

              <h1 className="text-4xl md:text-5xl font-serif font-bold text-black mb-6 leading-[1.1] tracking-tight">
                {post.title}
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed mb-10">{post.excerpt}</p>

              {post.coverImageUrl && (
                <div className="mb-10">
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    height="h-[20rem] md:h-[26rem]"
                    placeholderLabel={post.title}
                  />
                </div>
              )}

              {/* Body is stored as plain text. Rendering paragraph-by-paragraph
                  rather than with dangerouslySetInnerHTML keeps admin-authored
                  content from being able to inject markup into the page. */}
              <div className="space-y-5">
                {post.body
                  .split(/\n{2,}/)
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p key={index} className="text-lg text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
              </div>

              {post.tags?.length > 0 && (
                <ul className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-3">
                  {post.tags.map(tag => (
                    <li
                      key={tag}
                      className="px-4 py-1.5 rounded-full border border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-600"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          )}
        </div>
      </article>
    </main>
  );
};

export default BlogPost;
