import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ResearchCard from '@/components/ResearchCard.jsx';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User, ArrowLeft, BookOpen, Quote } from 'lucide-react';
import { format } from 'date-fns';
import pb from '@/lib/pocketbaseClient';

const ResearchDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const data = await pb.collection('research_articles').getOne(id, { $autoCancel: false });
      setArticle(data);

      if (data.research_category) {
        const related = await pb.collection('research_articles').getList(1, 3, {
          filter: `research_category="${data.research_category}" && id!="${data.id}"`,
          sort: '-publication_date',
          $autoCancel: false
        });
        setRelatedArticles(related.items);
      }
    } catch (error) {
      console.error('Error fetching research article:', error);
      navigate('/research');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-12 w-full mb-6" />
          <Skeleton className="h-32 w-full mb-12" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) return null;

  return (
    <>
      <Helmet>
        <title>{`${article.title} - GRC Research`}</title>
        <meta name="description" content={article.abstract || article.title} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-muted/10">
          <div className="bg-slate-950 text-white py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
              <Button variant="ghost" asChild className="mb-8 -ml-4 text-slate-300 hover:text-white hover:bg-white/10">
                <Link to="/research">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Publications
                </Link>
              </Button>

              <div className="flex items-center gap-3 mb-6">
                <Badge className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border-amber-500/50">
                  {article.research_category}
                </Badge>
                {article.featured && (
                  <Badge variant="outline" className="border-white/20 text-white">
                    Featured Research
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight text-balance" style={{letterSpacing: '-0.02em'}}>
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-slate-300 border-t border-white/10 pt-6">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-amber-500" />
                  <span className="font-medium text-white">{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-amber-500" />
                  <span>{format(new Date(article.publication_date), 'MMMM dd, yyyy')}</span>
                </div>
              </div>
            </div>
          </div>

          <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Main Content */}
              <div className="lg:col-span-8 space-y-12">
                {article.abstract && (
                  <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <BookOpen className="h-6 w-6 text-amber-500" />
                      Abstract
                    </h2>
                    <div className="bg-card p-6 rounded-xl border shadow-sm text-lg text-muted-foreground leading-relaxed">
                      {article.abstract}
                    </div>
                  </section>
                )}

                <section>
                  <h2 className="text-2xl font-bold mb-6">Full Text</h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap text-foreground/90">
                    {article.content}
                  </div>
                </section>

                {article.citations && (
                  <section className="pt-8 border-t">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Quote className="h-5 w-5 text-muted-foreground" />
                      Citations & References
                    </h2>
                    <div className="bg-muted/50 p-6 rounded-lg text-sm text-muted-foreground whitespace-pre-wrap font-mono">
                      {article.citations}
                    </div>
                  </section>
                )}
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-4 space-y-8">
                {article.author_bio && (
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-lg mb-3 border-b pb-2">About the Author</h3>
                      <p className="font-medium text-foreground mb-2">{article.author}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {article.author_bio}
                      </p>
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-lg mb-2 text-amber-900 dark:text-amber-400">Cite this article</h3>
                    <p className="text-sm text-amber-800/80 dark:text-amber-500/80 mb-4">
                      Need to reference this work? Copy the citation format below.
                    </p>
                    <div className="bg-white dark:bg-black/40 p-3 rounded border border-amber-200 dark:border-amber-900/50 text-xs font-mono break-words">
                      {article.author} ({new Date(article.publication_date).getFullYear()}). {article.title}. Global Research Centre.
                    </div>
                  </CardContent>
                </Card>
              </aside>

            </div>
          </article>

          {relatedArticles.length > 0 && (
            <section className="bg-card py-16 border-t">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                <h2 className="text-2xl font-bold mb-8">More in {article.research_category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.map(related => (
                    <ResearchCard key={related.id} article={related} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ResearchDetailPage;