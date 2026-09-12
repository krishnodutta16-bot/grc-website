import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Settings, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { generateCertificate } from '@/components/CertificateGenerator.jsx';
import pb from '@/lib/pocketbaseClient';

const AdminEnrollmentManagement = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const data = await pb.collection('enrollments').getFullList({
        expand: 'user_id,workshop_id,workshop_id.partner_id',
        sort: '-created',
        $autoCancel: false
      });
      setEnrollments(data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      toast.error('Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (enrollment) => {
    if (!window.confirm('Mark this enrollment as completed and generate certificate?')) return;

    try {
      await pb.collection('enrollments').update(enrollment.id, {
        status: 'completed',
        completed_date: new Date().toISOString().split('T')[0]
      }, { $autoCancel: false });

      const result = await generateCertificate(enrollment);

      if (result.success) {
        toast.success('Enrollment marked as completed and certificate generated');
        fetchEnrollments();
      } else {
        toast.error('Failed to generate certificate: ' + result.error);
      }
    } catch (error) {
      console.error('Error completing enrollment:', error);
      toast.error('Failed to complete enrollment');
    }
  };

  return (
    <>
      <Helmet>
        <title>Manage Enrollments - Admin - GRC</title>
        <meta name="description" content="Manage workshop enrollments" />
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
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Enrollments</h1>
              <p className="text-primary-foreground/90">Track and update workshop enrollments</p>
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : enrollments.length > 0 ? (
              <div className="space-y-4">
                {enrollments.map((enrollment) => {
                  const user = enrollment.expand?.user_id;
                  const workshop = enrollment.expand?.workshop_id;
                  const partner = workshop?.expand?.partner_id;

                  return (
                    <Card key={enrollment.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="mb-2">{workshop?.title}</CardTitle>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <p>Student: {user?.name} ({user?.email})</p>
                              <p>Partner: {partner?.name}</p>
                              <p>Enrolled: {format(new Date(enrollment.created), 'MMM dd, yyyy')}</p>
                              {enrollment.completed_date && (
                                <p>Completed: {format(new Date(enrollment.completed_date), 'MMM dd, yyyy')}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {enrollment.status === 'completed' ? (
                              <Badge variant="secondary" className="gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Completed
                              </Badge>
                            ) : (
                              <Badge>Enrolled</Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      {enrollment.status === 'enrolled' && (
                        <CardContent>
                          <Button onClick={() => handleMarkCompleted(enrollment)} size="sm">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Mark as Completed
                          </Button>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No enrollments yet</h3>
                  <p className="text-sm text-muted-foreground">Enrollments will appear here</p>
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

export default AdminEnrollmentManagement;