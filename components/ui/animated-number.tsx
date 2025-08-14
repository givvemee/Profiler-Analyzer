'use client';

import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

export default function AnimatedNumber({
  value,
  className = '',
  duration = 2,
  formatValue = (val: number) => val.toFixed(0),
}: {
  value: number;
  className?: string;
  duration?: number;
  formatValue?: (value: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 100,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(
    () =>
      springValue.on('change', (latest) => {
        if (ref.current) {
          ref.current.textContent = formatValue(latest);
        }
      }),
    [springValue, formatValue]
  );

  return <span ref={ref} className={className} />;
}