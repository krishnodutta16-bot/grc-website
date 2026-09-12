import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, ArrowLeft, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { generateCertificateHTML } from '@/components/CertificateGenerator.jsx';
import pb from '@/lib/pocketbaseClient';

const AdminCertificateManagement = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const data = await pb.collection('certificates').getFullList({
        expand: 'user_id,workshop_id,partner_id',
        sort: '-created',
        $autoCancel: false
      });
      setCertificates(data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleViewCertificate = (certificate) => {
    const html = generateCertificateHTML(certificate);
    const newWindow = window.open('', '_blank');
    newWindow.document.write(html);
    newWindow.document.close();
  };

  return (
    <>
      <Helmet>
        <title>Manage Certificates - Admin - GRC</title>
        <meta name="description" content="Manage issued certificates" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-muted/30">
          <div className="bg-primary text-primary-foreground py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <Button variant="ghost" asChild className="mb-4 text-primary-foreground hover:text-primary-foreground/80">
                <Link to="/admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Certificates</h1>
              <p className="text-primary-foreground/90">View and manage issued certificates</p>
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : certificates.length > 0 ? (
              <div className="space-y-4">
                {certificates.map((certificate) => {
                  const user = certificate.expand?.user_id;
                  const workshop = certificate.expand?.workshop_id;
                  const partner = certificate.expand?.partner_id;

                  return (
                    <Card key={certificate.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="mb-2">{workshop?.title}</CardTitle>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <p>Recipient: {user?.name} ({user?.email})</p>
                              <p>Partner: {partner?.name}</p>
                              <p>Issued: {format(new Date(certificate.created), 'MMM dd, yyyy')}</p>
                              <p>
                                Code: <code className="bg-muted px-2 py-1 rounded text-xs">{certificate.certificate_code}</code>
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant="secondary">
                              Verified {certificate.verified_count || 0} times
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button onClick={() => handleViewCertificate(certificate)} size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View Certificate
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No certificates issued yet</h3>
                  <p className="text-sm text-muted-foreground">Certificates will appear here when enrollments are completed</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AdminCertificateManagement;