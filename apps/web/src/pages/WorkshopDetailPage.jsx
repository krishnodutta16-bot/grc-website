import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Users, Globe, BookOpen, Award, Download } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';

const WorkshopDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    fetchWorkshop();
  }, [id]);

  useEffect(() => {
    if (currentUser && workshop) {
      checkEnrollment();
    }
  }, [currentUser, workshop]);

  const fetchWorkshop = async () => {
    try {
      const data = await pb.collection('workshops').getOne(id, {
        expand: 'partner_id',
        $autoCancel: false
      });
      setWorkshop(data);
    } catch (error) {
      console.error('Error fetching workshop:', error);
      toast.error('Workshop not found');
      navigate('/workshops');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const enrollments = await pb.collection('enrollments').getFullList({
        filter: `user_id="${currentUser.id}" && workshop_id="${workshop.id}"`,
        $autoCancel: false
      });
      setIsEnrolled(enrollments.length > 0);
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to enroll');
      navigate('/login');
      return;
    }

    const spotsLeft = workshop.capacity - (workshop.enrolled_count || 0);
    if (spotsLeft <= 0) {
      toast.error('This workshop is full');
      return;
    }

    setEnrolling(true);

    try {
      await pb.collection('enrollments').create({
        user_id: currentUser.id,
        workshop_id: workshop.id,
        status: 'enrolled'
      }, { $autoCancel: false });

      await pb.collection('workshops').update(workshop.id, {
        enrolled_count: (workshop.enrolled_count || 0) + 1
      }, { $autoCancel: false });

      toast.success('Successfully enrolled in workshop');
      setIsEnrolled(true);
      fetchWorkshop();
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error('Failed to enroll. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Footer />
      </>
    );
  }

  if (!workshop) return null;

  const partner = workshop.expand?.partner_id;
  const partnerLogoUrl = partner?.logo ? pb.files.getUrl(partner, partner.logo) : null;
  const spotsLeft = workshop.capacity - (workshop.enrolled_count || 0);
  const isFull = spotsLeft <= 0;

  return (
    <>
      <Helmet>
        <title>{`${workshop.title} - Global Research Centre`}</title>
        <meta name="description" content={workshop.description} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="bg-primary text-primary-foreground py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-start justify-between gap-8">
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{letterSpacing: '-0.02em'}}>
                    {workshop.title}
                  </h1>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {workshop.difficulty_level && (
                      <Badge variant="secondary">{workshop.difficulty_level}</Badge>
                    )}
                    {workshop.language && (
                      <Badge variant="outline" className="gap-1 bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20">
                        <Globe className="h-3 w-3" />
                        {workshop.language}
                      </Badge>
                    )}
                  </div>
                </div>
                {partnerLogoUrl && (
                  <img 
                    src={partnerLogoUrl} 
                    alt={partner.name}
                    className="h-20 w-20 object-contain bg-white rounded-lg p-2"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>About this workshop</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-slate max-w-none">
                    <p className="text-muted-foreground leading-relaxed">{workshop.description}</p>
                  </CardContent>
                </Card>

                {workshop.instructor_name && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Instructor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-semibold text-lg mb-2">{workshop.instructor_name}</p>
                      {workshop.instructor_bio && (
                        <p className="text-muted-foreground leading-relaxed">{workshop.instructor_bio}</p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {workshop.syllabus && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Syllabus</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{workshop.syllabus}</p>
                    </CardContent>
                  </Card>
                )}

                {workshop.learning_outcomes && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Learning outcomes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{workshop.learning_outcomes}</p>
                    </CardContent>
                  </Card>
                )}

                {partner && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Partner university</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-4">
                        {partnerLogoUrl && (
                          <img 
                            src={partnerLogoUrl} 
                            alt={partner.name}
                            className="h-16 w-16 object-contain"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-lg mb-2">{partner.name}</p>
                          {partner.description && (
                            <p className="text-muted-foreground">{partner.description}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Workshop details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Date</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(workshop.date), 'MMMM dd, yyyy')}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Capacity</p>
                        <p className="text-sm text-muted-foreground">
                          {isFull ? 'Full' : `${spotsLeft} spots left`} ({workshop.enrolled_count || 0}/{workshop.capacity})
                        </p>
                      </div>
                    </div>

                    {workshop.language && (
                      <>
                        <Separator />
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Language</p>
                            <p className="text-sm text-muted-foreground">{workshop.language}</p>
                          </div>
                        </div>
                      </>
                    )}

                    <Separator />

                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Certificate</p>
                        <p className="text-sm text-muted-foreground">
                          Co-branded GRC + {partner?.name || 'Partner'} certificate upon completion
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {isEnrolled ? (
                  <Card className="bg-accent text-accent-foreground">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <BookOpen className="h-12 w-12 mx-auto mb-3" />
                        <p className="font-semibold mb-2">You're enrolled</p>
                        <p className="text-sm text-accent-foreground/80">
                          Check your dashboard for workshop materials and updates
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Button 
                    onClick={handleEnroll} 
                    disabled={enrolling || isFull}
                    className="w-full"
                    size="lg"
                  >
                    {enrolling ? 'Enrolling...' : isFull ? 'Workshop Full' : 'Enroll Now'}
                  </Button>
                )}

                {workshop.materials && workshop.materials.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Materials</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {workshop.materials.map((material, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="w-full justify-start"
                            asChild
                          >
                            <a 
                              href={pb.files.getUrl(workshop, material)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              {material}
                            </a>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default WorkshopDetailPage;