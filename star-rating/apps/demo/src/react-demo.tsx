import { StarRating } from '@libraries/react-star-rating';
import { createRoot } from 'react-dom/client';
import { useState } from 'react';

function ReactDemo() {
  const [value, setValue] = useState(4.6);
  return (
    <div>
      <StarRating
        value={value}
        max={5}
        size={28}
        onChange={setValue}
        aria-label="React demo rating"
      />
      <p className="meta" style={{ marginTop: '0.5rem', color: '#555' }}>
        Value: {value}
      </p>
    </div>
  );
}

export function mountReact(): void {
  const el = document.getElementById('react-root');
  if (!el) return;
  createRoot(el).render(<ReactDemo />);
}
