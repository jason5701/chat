import { useEffect } from 'react';
import { HTMLProps } from 'react';
import { useState } from 'react';
import { useRef } from 'react';

type SpriteRendererProps = {
  src: string;
  size: number;
  runOnHover?: boolean;
  delay?: number;
};

const SpriteRenderer = ({
  src,
  size,
  runOnHover = false,
  delay = 100,
  ...others
}: HTMLProps<HTMLDivElement> & SpriteRendererProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [loaded, setLoaded] = useState(false);
  const intervalId = useRef<any>(null);

  useEffect(() => {
    setLoaded(false);

    const img = new Image();
    img.src = src;

    img.addEventListener(
      'load',
      () => {
        setLoaded(true);

        let stepCount = Math.ceil(img.width / img.height);

        let count = 0;

        if (runOnHover) {
          containerRef.current?.addEventListener('mouseenter', () => {
            intervalId.current = setInterval(() => {
              if (!containerRef.current) clearInterval(intervalId.current);

              containerRef.current &&
                (containerRef.current.style.backgroundPosition = `${Math.round(
                  -((count % stepCount) + 1) * size
                )}px 50%`);
              count++;
            }, delay);
          });

          containerRef.current?.addEventListener('mouseleave', () => {
            if (intervalId.current) clearInterval(intervalId.current);

            count = 0;

            containerRef.current &&
              (containerRef.current.style.backgroundPosition = '0px 50%');
          });
        } else {
          intervalId.current = setInterval(() => {
            if (!containerRef.current) clearInterval(intervalId.current);

            containerRef.current &&
              (containerRef.current.style.backgroundPosition = `${Math.round(
                -((count % stepCount) + 1) * size
              )}px 50%`);

            count++;
          }, delay);
        }
      },
      { once: true }
    );
    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: size,
        height: size,
        opacity: loaded ? 1 : 0,
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
      }}
    ></div>
  );
};

export default SpriteRenderer;
