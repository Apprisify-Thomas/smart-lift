import type { CSSProperties } from 'react';

export default function ImageCarousel({ activeFloor }: { activeFloor: number }) {
  const styles: CSSProperties = {
    position: 'relative',
  };

  function ImageSlide({ floor, path }: { floor: number; path: string }) {
    const styles: CSSProperties = {
      position: 'absolute',
      width: '100%',
      filter: 'contrast(1) brightness(1.5) saturate(0.75)',
      opacity: 0,
    };

    if (floor === activeFloor) {
      styles.animation = 'fadein 0.5s forwards';
    } else if (floor === activeFloor - 1) {
      styles.animation = 'fadeout 0.5s forwards';
    }

    return (
      <div
        style={{
          transform: 'rotateY(-3deg)',
          position: 'relative',
          left: 0,
          top: 0,
          right: 0,
          width: 600,
        }}
      >
        <img src={path} style={styles} />
      </div>
    );
  }

  return (
    <div style={styles}>
      <ImageSlide floor={1} path="/image-1.png" />
      <ImageSlide floor={2} path="/image-2.png" />
      <ImageSlide floor={3} path="/image-3.png" />
      <ImageSlide floor={4} path="/image-4.png" />
      <ImageSlide floor={5} path="/image-3.png" />
    </div>
  );
}
