import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import pb from '@/lib/pocketbaseClient';

const PartnerCard = ({ partner, workshopCount = 0 }) => {
  const logoUrl = partner.logo 
    ? pb.files.getUrl(partner, partner.logo)
    : null;

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="text-center">
        {logoUrl && (
          <div className="mb-4 flex justify-center">
            <img 
              src={logoUrl} 
              alt={partner.name}
              className="h-24 w-24 object-contain"
            />
          </div>
        )}
        <CardTitle className="text-lg">{partner.name}</CardTitle>
      </CardHeader>

      <CardContent>
        {partner.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {partner.description}
          </p>
        )}
        
        <Badge variant="secondary">
          {workshopCount} {workshopCount === 1 ? 'Workshop' : 'Workshops'}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default PartnerCard;