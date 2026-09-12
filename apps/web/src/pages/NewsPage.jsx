import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import NewsCard from '@/components/NewsCard.jsx';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Newspaper, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const NewsPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const categories = ['Technology', 'Science', 'Education', 'Innovation'];

  useEffect(() => {
    fetchNews();
  }, [page, category, dateFrom, dateTo, searchQuery]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      let filterStr = [];
      
      if (searchQuery) {
        filterStr.push(`(title ~ "${searchQuery}" || content ~ "${searchQuery}")`);
      }
      if (category !== 'all') {
        filterStr.push(`category = "${category}"`);
      }
      if (dateFrom) {
        filterStr.push(`published_date >= "${dateFrom} 00:00:00"`);
      }
      if (dateTo) {
        filterStr.push(`published_date <= "${dateTo} 23:59:59"`);
      }

      const result = await pb.collection('news_articles').getList(page, 9, {
        filter: filterStr.join(' && '),
        sort: '-published_date',
        $autoCancel: false
      });

      setArticles(result.items);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchNews();
  };

  return (
    <>
      <Helmet>
        <title>News & Updates - Global Research Centre</title>
        <meta name="description" content="Latest news, updates, and announcements from the Global Research Centre" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="bg-primary text-primary-foreground py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-4">
                <Newspaper className="h-10 w-10" />
                <h1 className="text-4xl md:text-5xl font-bold" style={{letterSpacing: '-0.02em'}}>
                  News & Updates
                </h1>
              </div>
              <p className="text-xl text-primary-foreground/90 max-w-2xl">
                Stay informed with the latest announcements and insights from our global network
              </p>
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Filters */}
              <div className="space-y-6">
                <div className="bg-muted/50 p-6 rounded-xl space-y-6">
                  <h3 className="font-semibold text-lg">Filters</h3>
                  
                  <form onSubmit={handleSearch} className="space-y-2">
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-background"
                      />
                    </div>
                  </form>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={(val) => { setCategory(val); setPage(1); }}>
                      <SelectTrigger id="category" className="bg-background">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label>Date Range</Label>
                    <div className="space-y-2">
                      <Input 
                        type="date" 
                        value={dateFrom} 
                        onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                        className="bg-background text-sm"
                        aria-label="From Date"
                      />
                      <div className="text-center text-xs text-muted-foreground">to</div>
                      <Input 
                        type="date" 
                        value={dateTo} 
                        onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                        className="bg-background text-sm"
                        aria-label="To Date"
                      />
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setSearchQuery('');
                      setCategory('all');
                      setDateFrom('');
                      setDateTo('');
                      setPage(1);
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3 space-y-8">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="space-y-4">
                        <Skeleton className="h-48 w-full rounded-xl" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : articles.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {articles.map((article) => (
                        <NewsCard key={article.id} article={article} />
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-8">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium px-4">
                          Page {page} of {totalPages}
                        </span>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
                    <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your filters or search query to find what you're looking for.
                    </p>
                  </div>
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

export default NewsPage;