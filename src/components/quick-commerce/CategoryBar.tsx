import { Category } from './types';

interface CategoryBarProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
}

export const CategoryBar = ({ categories, selectedCategory, setSelectedCategory }: CategoryBarProps) => (
  <div className="px-4 py-4">
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => setSelectedCategory('all')}
        className={`flex flex-col items-center px-4 py-3 rounded-2xl min-w-[76px] transition-all duration-200 ${
          selectedCategory === 'all'
            ? 'gradient-primary text-primary-foreground shadow-button scale-105'
            : 'bg-card shadow-card hover:shadow-card-hover'
        }`}
      >
        <span className="text-2xl mb-1">✨</span>
        <span className="text-xs font-bold">All</span>
      </button>
      
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setSelectedCategory(String(cat.id))}
          className={`flex flex-col items-center px-4 py-3 rounded-2xl min-w-[76px] transition-all duration-200 ${
            selectedCategory === String(cat.id)
              ? 'gradient-primary text-primary-foreground shadow-button scale-105'
              : 'bg-card shadow-card hover:shadow-card-hover'
          }`}
        >
          <span className="text-2xl mb-1">{cat.icon}</span>
          <span className="text-xs font-bold">{cat.name}</span>
        </button>
      ))}
    </div>
  </div>
);
