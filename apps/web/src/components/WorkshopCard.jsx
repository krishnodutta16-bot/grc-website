import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Globe } from 'lucide-react';
import { format } from 'date-fns';
import pb from '@/lib/pocketbaseClient';

const WorkshopCard = ({ workshop }) => {
  const partnerLogoUrl = workshop.expand?.partner_id?.logo 
    ? pb.files.getUrl(workshop.expand.partner_id, workshop.expand.partner_id.logo)
    : null;

  const spotsLeft = workshop.capacity - (workshop.enrolled_count || 0);
  const isFull = spotsLeft <= 0;

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-4 mb-2">
          <CardTitle className="text-xl leading-tight">{workshop.title}</CardTitle>
          {partnerLogoUrl && (
            <img 
              src={partnerLogoUrl} 
              alt={workshop.expand?.partner_id?.name}
              className="h-10 w-10 object-contain rounded"
            />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {workshop.difficulty_level && (
            <Badge variant="secondary">{workshop.difficulty_level}</Badge>
          )}
          {workshop.language && (
            <Badge variant="outline" className="gap-1">
              <Globe className="h-3 w-3" />
              {workshop.language}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {workshop.description}
        </p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(workshop.date), 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {isFull ? 'Full' : `${spotsLeft} spots left`} ({workshop.enrolled_count || 0}/{workshop.capacity})
            </span>
          </div>
        </div>

        {workshop.instructor_name && (
          <p className="text-sm mt-4">
            <span className="font-medium">Instructor:</span> {workshop.instructor_name}
          </p>
        )}
      </CardContent>

      <CardFooter className="mt-auto">
        <Button asChild className="w-full">
          <Link to={`/workshops/${workshop.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkshopCard;