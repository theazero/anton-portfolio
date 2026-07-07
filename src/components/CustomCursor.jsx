import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const visible = useRef(false);

  useEffect(() => {
    const onMove = (e) => {
      if (!visible.current) {
        visible.current = true;
        dotRef.current.style.opacity = '1';
      }
      dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    const onLeave = () => {
      visible.current = false;
      dotRef.current.style.opacity = '0';
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <div ref={dotRef} className="cursor-dot" />;
}
