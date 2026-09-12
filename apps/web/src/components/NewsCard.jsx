import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const NewsCard = ({ article }) => {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <div className="flex items-center justify-between mb-3">
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
            {article.category}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            {format(new Date(article.published_date), 'MMM dd, yyyy')}
          </div>
        </div>
        <CardTitle className="text-xl leading-tight line-clamp-2">
          {article.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground text-sm line-clamp-3">
          {article.excerpt || article.content.substring(0, 150) + '...'}
        </p>
      </CardContent>
      <CardFooter className="mt-auto pt-4 border-t">
        <Button variant="ghost" className="w-full justify-between group" asChild>
          <Link to={`/news/${article.id}`}>
            Read More
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;