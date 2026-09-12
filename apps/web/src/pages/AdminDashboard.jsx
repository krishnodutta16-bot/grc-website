import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Award, Building2, Settings, Newspaper, FileText } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    workshops: 0,
    certificates: 0,
    partners: 0,
    news: 0,
    research: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [users, workshops, certificates, partners, news, research] = await Promise.all([
        pb.collection('users').getFullList({ $autoCancel: false }),
        pb.collection('workshops').getFullList({ $autoCancel: false }),
        pb.collection('certificates').getFullList({ $autoCancel: false }),
        pb.collection('partners').getFullList({ $autoCancel: false }),
        pb.collection('news_articles').getFullList({ $autoCancel: false }),
        pb.collection('research_articles').getFullList({ $autoCancel: false })
      ]);

      setStats({
        users: users.length,
        workshops: workshops.length,
        certificates: certificates.length,
        partners: partners.length,
        news: news.length,
        research: research.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const adminLinks = [
    { to: '/admin/partners', icon: Building2, label: 'Manage Partners', description: 'Add and edit partner universities' },
    { to: '/admin/workshops', icon: BookOpen, label: 'Manage Workshops', description: 'Create and manage workshops' },
    { to: '/admin/users', icon: Users, label: 'Manage Users', description: 'View and manage user accounts' },
    { to: '/admin/enrollments', icon: Settings, label: 'Manage Enrollments', description: 'Track and update enrollments' },
    { to: '/admin/certificates', icon: Award, label: 'Manage Certificates', description: 'View and manage certificates' },
    { to: '/admin/news', icon: Newspaper, label: 'Manage News', description: 'Publish news and announcements' },
    { to: '/admin/research', icon: FileText, label: 'Manage Research', description: 'Publish research articles' }
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Global Research Centre</title>
        <meta name="description" content="Manage GRC platform" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-muted/30">
          <div className="bg-primary text-primary-foreground py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-primary-foreground/90">Manage the GRC platform</p>
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 pt-4">
                  <CardTitle className="text-xs font-medium">Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="text-2xl font-bold">{stats.users}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 pt-4">
                  <CardTitle className="text-xs font-medium">Workshops</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="text-2xl font-bold">{stats.workshops}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 pt-4">
                  <CardTitle className="text-xs font-medium">Certificates</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="text-2xl font-bold">{stats.certificates}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 pt-4">
                  <CardTitle className="text-xs font-medium">Partners</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="text-2xl font-bold">{stats.partners}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 pt-4">
                  <CardTitle className="text-xs font-medium">News</CardTitle>
                  <Newspaper className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="text-2xl font-bold">{stats.news}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 pt-4">
                  <CardTitle className="text-xs font-medium">Research</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="text-2xl font-bold">{stats.research}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Card key={link.to} className="hover:shadow-lg transition-all duration-200">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>{link.label}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{link.description}</p>
                      <Button asChild className="w-full">
                        <Link to={link.to}>Manage</Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AdminDashboard;