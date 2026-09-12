import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import CertificateCard from '@/components/CertificateCard.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Award, User, Calendar, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';

const ResearcherDashboard = () => {
  const { currentUser, updateProfile } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    institution: currentUser?.institution || '',
    country: currentUser?.country || ''
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const fetchData = async () => {
    if (!currentUser) return;

    try {
      const [enrollmentsData, certificatesData] = await Promise.all([
        pb.collection('enrollments').getFullList({
          filter: `user_id="${currentUser.id}"`,
          expand: 'workshop_id,workshop_id.partner_id',
          sort: '-created',
          $autoCancel: false
        }),
        pb.collection('certificates').getFullList({
          filter: `user_id="${currentUser.id}"`,
          expand: 'workshop_id,partner_id',
          sort: '-created',
          $autoCancel: false
        })
      ]);

      setEnrollments(enrollmentsData);
      setCertificates(certificatesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const result = await updateProfile(currentUser.id, profileData);

    if (result.success) {
      toast.success('Profile updated successfully');
    } else {
      toast.error(result.error || 'Failed to update profile');
    }

    setUpdating(false);
  };

  const enrolledWorkshops = enrollments.filter(e => e.status === 'enrolled');
  const completedWorkshops = enrollments.filter(e => e.status === 'completed');

  return (
    <>
      <Helmet>
        <title>Dashboard - Global Research Centre</title>
        <meta name="description" content="Manage your workshops, certificates, and profile" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-muted/30">
          <div className="bg-primary text-primary-foreground py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome back, {currentUser?.name?.split(' ')[0]}
              </h1>
              <p className="text-primary-foreground/90">
                Manage your workshops and certificates
              </p>
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Enrolled</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{enrolledWorkshops.length}</div>
                  <p className="text-xs text-muted-foreground">Active workshops</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedWorkshops.length}</div>
                  <p className="text-xs text-muted-foreground">Workshops finished</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Certificates</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{certificates.length}</div>
                  <p className="text-xs text-muted-foreground">Earned certificates</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="enrolled" className="space-y-6">
              <TabsList>
                <TabsTrigger value="enrolled">Enrolled Workshops</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="certificates">Certificates</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>

              <TabsContent value="enrolled" className="space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-32 w-full" />
                    ))}
                  </div>
                ) : enrolledWorkshops.length > 0 ? (
                  <div className="space-y-4">
                    {enrolledWorkshops.map((enrollment) => {
                      const workshop = enrollment.expand?.workshop_id;
                      const partner = workshop?.expand?.partner_id;
                      const partnerLogo = partner?.logo ? pb.files.getUrl(partner, partner.logo) : null;

                      return (
                        <Card key={enrollment.id}>
                          <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <CardTitle className="mb-2">{workshop?.title}</CardTitle>
                                <CardDescription className="line-clamp-2">
                                  {workshop?.description}
                                </CardDescription>
                              </div>
                              {partnerLogo && (
                                <img 
                                  src={partnerLogo} 
                                  alt={partner.name}
                                  className="h-12 w-12 object-contain"
                                />
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {workshop?.date && format(new Date(workshop.date), 'MMM dd, yyyy')}
                                </div>
                                <Badge variant="secondary">Enrolled</Badge>
                              </div>
                              <Button asChild>
                                <Link to={`/workshops/${workshop?.id}`}>View Details</Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center py-12">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No enrolled workshops</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Browse available workshops to get started
                      </p>
                      <Button asChild>
                        <Link to="/workshops">Browse Workshops</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-32 w-full" />
                    ))}
                  </div>
                ) : completedWorkshops.length > 0 ? (
                  <div className="space-y-4">
                    {completedWorkshops.map((enrollment) => {
                      const workshop = enrollment.expand?.workshop_id;
                      const partner = workshop?.expand?.partner_id;
                      const partnerLogo = partner?.logo ? pb.files.getUrl(partner, partner.logo) : null;

                      return (
                        <Card key={enrollment.id}>
                          <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <CardTitle className="mb-2">{workshop?.title}</CardTitle>
                                <CardDescription>
                                  Completed on {enrollment.completed_date && format(new Date(enrollment.completed_date), 'MMM dd, yyyy')}
                                </CardDescription>
                              </div>
                              {partnerLogo && (
                                <img 
                                  src={partnerLogo} 
                                  alt={partner.name}
                                  className="h-12 w-12 object-contain"
                                />
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <Badge variant="secondary" className="gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Completed
                            </Badge>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center py-12">
                      <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No completed workshops yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Complete your enrolled workshops to see them here
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="certificates" className="space-y-4">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-64 w-full" />
                    ))}
                  </div>
                ) : certificates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((certificate) => (
                      <CertificateCard key={certificate.id} certificate={certificate} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center py-12">
                      <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No certificates yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Complete workshops to earn certificates
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile settings</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          required
                          className="text-foreground"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="institution">Institution</Label>
                        <Input
                          id="institution"
                          type="text"
                          value={profileData.institution}
                          onChange={(e) => setProfileData({ ...profileData, institution: e.target.value })}
                          className="text-foreground"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          type="text"
                          value={profileData.country}
                          onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                          className="text-foreground"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={currentUser?.email}
                          disabled
                          className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                      </div>

                      <Button type="submit" disabled={updating}>
                        {updating ? 'Updating...' : 'Update Profile'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ResearcherDashboard;