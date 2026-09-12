import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Download, Eye } from 'lucide-react';
import { format } from 'date-fns';
import pb from '@/lib/pocketbaseClient';

const CertificateCard = ({ certificate }) => {
  const pdfUrl = certificate.pdf_file 
    ? pb.files.getUrl(certificate, certificate.pdf_file)
    : null;

  const partnerLogo = certificate.expand?.partner_id?.logo
    ? pb.files.getUrl(certificate.expand.partner_id, certificate.expand.partner_id.logo)
    : null;

  const handleDownload = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-accent" />
            <CardTitle className="text-lg">Certificate</CardTitle>
          </div>
          {partnerLogo && (
            <img 
              src={partnerLogo} 
              alt={certificate.expand?.partner_id?.name}
              className="h-8 w-8 object-contain"
            />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div>
          <p className="font-semibold">{certificate.expand?.workshop_id?.title}</p>
          <p className="text-sm text-muted-foreground">
            {certificate.expand?.partner_id?.name}
          </p>
        </div>

        <div className="text-sm space-y-1">
          <p>
            <span className="font-medium">Code:</span>{' '}
            <code className="bg-muted px-2 py-1 rounded text-xs">
              {certificate.certificate_code}
            </code>
          </p>
          <p>
            <span className="font-medium">Issued:</span>{' '}
            {format(new Date(certificate.created), 'MMM dd, yyyy')}
          </p>
          {certificate.verified_count > 0 && (
            <Badge variant="secondary" className="mt-2">
              Verified {certificate.verified_count} times
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        {pdfUrl ? (
          <Button onClick={handleDownload} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        ) : (
          <Button variant="outline" className="flex-1" disabled>
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CertificateCard;