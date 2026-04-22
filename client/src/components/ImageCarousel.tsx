import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';

function ImageSlide({
  path,
  isActive,
  isTransitioning,
}: {
  path: string;
  isActive: boolean;
  isTransitioning: boolean;
}) {
  const styles: CSSProperties = {
    position: 'absolute',
    // filter: 'contrast(1) brightness(1.5) saturate(0.75)',
    left: 0,
    top: 0,
    right: 0,
    width: '100%',
    objectFit: 'cover',
    transition: 'opacity 0.5s ease-in-out',
    opacity: 0,
  };

  if (isActive) {
    styles.opacity = 1;
  } else {
    styles.opacity = 0;
  }

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <img src={path} style={styles} />
    </div>
  );
}

export default function ImageCarousel() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const images = ['/image-1.png', '/image-2.png', '/image-3.png', '/image-4.png'];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentImageIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % images.length;

          return newIndex;
        });
      }, 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length, currentImageIndex]);

  const styles: CSSProperties = {
    position: 'relative',
  };

  return (
    <div style={styles}>
      {images.map((path, index) => (
        <ImageSlide
          key={index}
          path={path}
          isActive={index === currentImageIndex}
          isTransitioning={isTransitioning && index === currentImageIndex}
        />
      ))}
    </div>
  );
}
