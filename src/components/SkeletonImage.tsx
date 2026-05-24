import { useState } from 'react';

const SkeletonImage = ({ src, alt, className, style }: { src: string, alt: string, className?: string, style?: React.CSSProperties }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', ...style }} className={className}>
      {!loaded && (
        <div
          className="skeleton"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: 'inherit',
            zIndex: 1
          }}
        />
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.5s ease',
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

export default SkeletonImage;
