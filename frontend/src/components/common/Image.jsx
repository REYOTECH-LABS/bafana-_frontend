import { useState } from 'react';
import { ImagePlaceholder } from './ImagePlaceholder';

/**
 * Reusable Image Component
 * Falls back to ImagePlaceholder if image fails to load or src is not provided
 */
export const Image = ({
  src,
  alt,
  width = 'w-full',
  height = 'h-64',
  objectFit = 'object-cover',
  className = '',
  placeholderLabel = 'Image',
  onLoad,
  onError,
}) => {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleLoad = (e) => {
    setLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setHasError(true);
    onError?.(e);
  };

  // No source provided or error occurred - show placeholder
  if (!src || hasError) {
    return (
      <ImagePlaceholder
        label={placeholderLabel}
        width={width}
        height={height}
      />
    );
  }

  return (
    <div className={`${width} ${height} overflow-hidden rounded-lg`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full ${objectFit} transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default Image;
