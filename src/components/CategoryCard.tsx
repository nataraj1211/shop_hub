import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  icon: LucideIcon;
  category: string;
  gradient: string;
}

export const CategoryCard = ({ title, icon: Icon, category, gradient }: CategoryCardProps) => {
  return (
    <Link to={`/products?category=${category}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
        <CardContent className={`p-8 ${gradient}`}>
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-white/90 rounded-full group-hover:scale-110 transition-transform duration-300">
              <Icon className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
