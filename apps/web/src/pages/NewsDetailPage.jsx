import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import NewsCard from '@/components/NewsCard.jsx';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import pb from '@/lib/pocketbaseClient';

const NewsDetailPage = () => {
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
      const data = await pb.collection('news_articles').getOne(id, { $autoCancel: false });
      setArticle(data);

      // Fetch related articles
      if (data.category) {
        const related = await pb.collection('news_articles').getList(1, 3, {
          filter: `category="${data.category}" && id!="${data.id}"`,
          sort: '-published_date',
          $autoCancel: false
        });
        setRelatedArticles(related.items);
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      navigate('/news');
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
          <Skeleton className="h-12 w-3/4 mb-6" />
          <Skeleton className="h-6 w-1/2 mb-12" />
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
        <title>{`${article.title} - GRC News`}</title>
        <meta name="description" content={article.excerpt || article.title} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
            <Button variant="ghost" asChild className="mb-8 -ml-4 text-muted-foreground hover:text-foreground">
              <Link to="/news">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to News
              </Link>
            </Button>

            <header className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none text-sm px-3 py-1">
                  {article.category}
                </Badge>
                {article.featured && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-none">
                    Featured
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-balance" style={{letterSpacing: '-0.02em'}}>
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-y py-4">
                {article.author && (
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span className="font-medium text-foreground">{article.author}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{format(new Date(article.published_date), 'MMMM dd, yyyy')}</span>
                </div>
                <div className="ml-auto">
                  <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigator.clipboard.writeText(window.location.href)}>
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </header>

            {article.excerpt && (
              <div className="text-xl text-muted-foreground leading-relaxed mb-10 font-medium border-l-4 border-primary pl-6">
                {article.excerpt}
              </div>
            )}

            <div className="prose prose-lg dark:prose-invert max-w-none mb-16 whitespace-pre-wrap">
              {article.content}
            </div>
          </article>

          {relatedArticles.length > 0 && (
            <section className="bg-muted/30 py-16 border-t">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.map(related => (
                    <NewsCard key={related.id} article={related} />
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

export default NewsDetailPage;