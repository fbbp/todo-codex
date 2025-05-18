import type { Category } from '../db';

interface Props {
  category: Category;
  selected?: boolean;
  onClick?: () => void;
}

export function CategoryBadge({ category, selected, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-1 rounded-full text-white text-sm ${selected ? 'opacity-100' : 'opacity-60'}`}
      style={{ backgroundColor: category.color }}
    >
      {category.name}
    </button>
  );
}
