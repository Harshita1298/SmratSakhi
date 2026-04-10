// frontend/src/components/StarRating.jsx
import { useState } from 'react';

export default function StarRating({ value = 0, onChange, size = 28, readOnly = false }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => !readOnly && onChange?.(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          style={{
            fontSize: size,
            cursor: readOnly ? 'default' : 'pointer',
            color: star <= display ? '#f59e0b' : '#d1d5db',
            transition: 'color 0.15s, transform 0.15s',
            transform: !readOnly && star <= hovered ? 'scale(1.2)' : 'scale(1)',
            display: 'inline-block',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
