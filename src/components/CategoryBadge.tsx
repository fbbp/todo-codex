import type { Category } from '../db';

interface Props {
  category: Category;
  selected?: boolean;
  onClick?: () => void;
}

function textColor(hex: string) {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const brightness = r * 0.299 + g * 0.587 + b * 0.114;
  return brightness < 140 ? 'text-white' : 'text-black';
}

export function CategoryBadge({ category, selected, onClick }: Props) {
  const colorClass = textColor(category.color);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`focus-ring px-2 py-1 rounded-full text-sm ${colorClass} ${selected ? 'opacity-100' : 'opacity-60'}`}
      style={{ backgroundColor: category.color }}
    >
      {category.name}
    </button>
  );
}
