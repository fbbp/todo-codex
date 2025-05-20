import type { Category } from '../db';
import { textColor } from '../lib/color';

interface Props {
  category: Category;
  selected?: boolean;
  onClick?: () => void;
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
