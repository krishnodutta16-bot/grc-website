import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

const ResearchCard = ({ article }) => {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-200 border-l-4 border-l-amber-500">
      <CardHeader>
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className="border-amber-500/30 text-amber-700 dark:text-amber-400">
            {article.research_category}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            {format(new Date(article.publication_date), 'MMM dd, yyyy')}
          </div>
        </div>
        <CardTitle className="text-xl leading-tight line-clamp-2">
          {article.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="flex items-center text-sm font-medium text-foreground/80">
          <User className="h-4 w-4 mr-2 text-muted-foreground" />
          {article.author}
        </div>
        <p className="text-muted-foreground text-sm line-clamp-3">
          {article.abstract || article.content.substring(0, 150) + '...'}
        </p>
      </CardContent>
      <CardFooter className="mt-auto pt-4 bg-muted/30">
        <Button variant="secondary" className="w-full group" asChild>
          <Link to={`/research/${article.id}`}>
            <BookOpen className="h-4 w-4 mr-2" />
            View Research
            <ArrowRight className="h-4 w-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResearchCard;