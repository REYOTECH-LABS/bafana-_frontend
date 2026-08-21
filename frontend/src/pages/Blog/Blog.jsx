import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { SectionHeading } from '../../components/common/SectionHeading';
import { Image } from '../../components/common/Image';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/States';
import { useApi } from '../../hooks/useApi';
import { getPosts } from '../../services/resources';
import { cardHover, fadeUp, staggerContainer } from '../../animations/variants';

/**
 * Blog index.
 *
 * No static fallback: unlike lawyers or practice areas there is no meaningful
 * offline version of a blog, so an empty state is more honest than stale
 * placeholder articles.
 */
export const Blog = () => {
  const { data, loading, error, isEmpty, refetch } = useApi(() => getPosts(), [], {
    fallback: [],
  });

  return (
    <main>
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            pretitle="Insights"
            title="Legal insights and firm news"
            description="Practical commentary on the issues our clients are navigating."
          />

          {loading && <LoadingState count={3} label="Loading articles" />}

          {!loading && error && <ErrorState error={error} onRetry={refetch} />}

          {!loading && !error && isEmpty && (
            <EmptyState
              title="No articles published yet"
              description="We are preparing our first insights. Please check back soon."
            />
          )}

          {!loading && !error && !isEmpty && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer()}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {data.map(post => (
                <motion.article
                  key={post.id}
                  variants={fadeUp}
                  whileHover={cardHover}
                  className="h-full flex flex-col bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-900 transition-colors duration-300"
                >
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    height="h-52"
                    placeholderLabel={post.title}
                  />

                  <div className="p-8 flex-grow flex flex-col">
                    {post.publishedAt && (
                      <time
                        dateTime={post.publishedAt}
                        className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3"
                      >
                        {new Date(post.publishedAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </time>
                    )}

                    <h3 className="text-xl font-serif font-bold text-black mb-3">{post.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-6 flex-grow">{post.excerpt}</p>

                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-black font-semibold hover:gap-3 transition-all duration-300"
                    >
                      Read article
                      <FaArrowRight aria-hidden="true" className="text-sm" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Blog;
