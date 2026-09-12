import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import WorkshopCard from '@/components/WorkshopCard.jsx';
import NewsCard from '@/components/NewsCard.jsx';
import ResearchCard from '@/components/ResearchCard.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Award, Users, Globe, BookOpen, Newspaper, FileText } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
const HomePage = () => {
  const [featuredWorkshops, setFeaturedWorkshops] = useState([]);
  const [partners, setPartners] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [featuredResearch, setFeaturedResearch] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const [workshopsData, partnersData, newsData, researchData] = await Promise.all([pb.collection('workshops').getList(1, 3, {
        expand: 'partner_id',
        sort: '-created',
        $autoCancel: false
      }), pb.collection('partners').getFullList({
        $autoCancel: false
      }), pb.collection('news_articles').getList(1, 3, {
        sort: '-published_date',
        $autoCancel: false
      }), pb.collection('research_articles').getList(1, 3, {
        filter: 'featured=true',
        sort: '-publication_date',
        $autoCancel: false
      })]);
      setFeaturedWorkshops(workshopsData.items);
      setPartners(partnersData);
      setLatestNews(newsData.items);
      setFeaturedResearch(researchData.items);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  const features = [{
    icon: Award,
    title: 'Co-branded certificates',
    description: 'Earn certificates recognized by GRC and leading universities worldwide'
  }, {
    icon: Users,
    title: 'Expert instructors',
    description: 'Learn from renowned researchers and academics in their fields'
  }, {
    icon: Globe,
    title: 'Global network',
    description: 'Connect with researchers from institutions across the world'
  }, {
    icon: BookOpen,
    title: 'Flexible learning',
    description: 'Access workshops and materials at your own pace'
  }];
  return <>
      <Helmet>
        <title>Global Research Centre - Empowering Researchers Worldwide</title>
        <meta name="description" content="Professional development workshops from leading universities. Earn co-branded certificates and advance your research career." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <section className="relative min-h-[600px] flex items-center justify-center text-white" style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://images.unsplash.com/photo-1613375058973-ad78f6512f38)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-balance" style={{
              letterSpacing: '-0.02em'
            }}>
                Global Research Centre
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90 text-balance">
                Empowering researchers worldwide through collaborative learning and professional development
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg">
                  <Link to="/workshops">
                    Explore Workshops
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </section>

          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why choose GRC</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Professional development opportunities designed for researchers, by researchers
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {features.map((feature, index) => {
                const Icon = feature.icon;
                return <Card key={index} className="hover:shadow-lg transition-all duration-200 border-none shadow-sm">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-primary/10 rounded-xl flex-shrink-0">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>;
              })}
              </div>
            </div>
          </section>

          {partners.length > 0 && <section className="py-20 bg-secondary text-secondary-foreground">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">In collaboration with leading universities</h2>
                  <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto">
                    Partnering with renowned institutions to deliver world-class professional development
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
                  {partners.slice(0, 6).map(partner => {
                const logoUrl = partner.logo ? pb.files.getUrl(partner, partner.logo) : null;
                return <div key={partner.id} className="flex items-center justify-center">
                        {logoUrl ? <img src={logoUrl} alt={partner.name} className="h-16 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity mix-blend-multiply" /> : <div className="text-center">
                            <p className="font-semibold text-sm">{partner.name}</p>
                          </div>}
                      </div>;
              })}
                </div>

                {partners.length > 6 && <div className="text-center mt-10">
                    <Button asChild variant="outline" className="bg-secondary-foreground/5 border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/10">
                      <Link to="/partners">View All Partners</Link>
                    </Button>
                  </div>}
              </div>
            </section>}

          <section className="py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Workshops</h2>
                  <p className="text-lg text-muted-foreground max-w-2xl">
                    Explore our latest professional development opportunities
                  </p>
                </div>
                <Button asChild variant="outline" className="hidden md:flex">
                  <Link to="/workshops">
                    View All Workshops
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {loading ? <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => <div key={i} className="space-y-4">
                      <Skeleton className="h-48 w-full rounded-xl" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>)}
                </div> : featuredWorkshops.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredWorkshops.map(workshop => <WorkshopCard key={workshop.id} workshop={workshop} />)}
                </div> : <div className="text-center py-12 bg-muted/30 rounded-2xl">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No workshops available yet</h3>
                </div>}
              
              <div className="mt-8 text-center md:hidden">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/workshops">View All Workshops</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* News Section */}
          <section className="py-24 bg-muted/30 border-y">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest News</h2>
                  <p className="text-lg text-muted-foreground max-w-2xl">
                    Stay updated with announcements and insights from GRC
                  </p>
                </div>
                <Button asChild variant="outline" className="hidden md:flex">
                  <Link to="/news">
                    View All News
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {loading ? <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => <div key={i} className="space-y-4">
                      <Skeleton className="h-48 w-full rounded-xl" />
                    </div>)}
                </div> : latestNews.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {latestNews.map(article => <NewsCard key={article.id} article={article} />)}
                </div> : <div className="text-center py-12 bg-background rounded-2xl border border-dashed">
                  <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No news published yet</h3>
                </div>}

              <div className="mt-8 text-center md:hidden">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/news">View All News</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Research Section */}
          <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent"></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Research</h2>
                <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                  Discover groundbreaking publications from our global community of scholars
                </p>
              </div>

              {loading ? <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  {[1, 2, 3].map(i => <div key={i} className="space-y-4">
                      <Skeleton className="h-56 w-full rounded-xl bg-slate-800" />
                    </div>)}
                </div> : featuredResearch.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                  {featuredResearch.map(article => <ResearchCard key={article.id} article={article} />)}
                </div> : <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800 mb-12">
                  <FileText className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-slate-300">No featured research yet</h3>
                </div>}

              <div className="text-center">
                <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-6 text-lg rounded-xl font-medium transition-colors shadow-lg shadow-amber-500/20">
                  <Link to="/research">
                    View All Research Articles
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          <section className="py-20 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to advance your research career?</h2>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Join thousands of researchers worldwide who are enhancing their skills through GRC workshops
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                  <Link to="/signup">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>;
};
export default HomePage;