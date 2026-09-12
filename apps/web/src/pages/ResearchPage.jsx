import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ResearchCard from '@/components/ResearchCard.jsx';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const ResearchPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [author, setAuthor] = useState('');

  const categories = ['Computer Science', 'Life Sciences', 'Engineering', 'Social Sciences', 'Other'];

  useEffect(() => {
    fetchResearch();
  }, [page, category, author, searchQuery]);

  const fetchResearch = async () => {
    setLoading(true);
    try {
      let filterStr = [];
      
      if (searchQuery) {
        filterStr.push(`(title ~ "${searchQuery}" || abstract ~ "${searchQuery}")`);
      }
      if (category !== 'all') {
        filterStr.push(`research_category = "${category}"`);
      }
      if (author) {
        filterStr.push(`author ~ "${author}"`);
      }

      const result = await pb.collection('research_articles').getList(page, 9, {
        filter: filterStr.join(' && '),
        sort: '-publication_date',
        $autoCancel: false
      });

      setArticles(result.items);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error fetching research:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchResearch();
  };

  return (
    <>
      <Helmet>
        <title>Research Publications - Global Research Centre</title>
        <meta name="description" content="Explore cutting-edge research publications from our global network of scholars" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="bg-slate-950 text-white py-20 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent"></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="h-10 w-10 text-amber-500" />
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold" style={{letterSpacing: '-0.02em'}}>
                  Research Publications
                </h1>
              </div>
              <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
                Discover groundbreaking research and academic insights from our global community of scholars and partner institutions.
              </p>
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <aside className="w-full lg:w-1/4 space-y-6">
                <div className="bg-card border rounded-2xl p-6 shadow-sm sticky top-24">
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b">
                    <Filter className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold text-lg">Filter Research</h3>
                  </div>
                  
                  <form onSubmit={handleSearch} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="search">Keywords</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="search"
                          placeholder="Search titles, abstracts..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Discipline</Label>
                      <Select value={category} onValueChange={(val) => { setCategory(val); setPage(1); }}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="All Disciplines" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Disciplines</SelectItem>
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="author">Author</Label>
                      <Input
                        id="author"
                        placeholder="Filter by author name..."
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                      />
                    </div>

                    <Button 
                      type="button"
                      variant="secondary" 
                      className="w-full mt-4"
                      onClick={() => {
                        setSearchQuery('');
                        setCategory('all');
                        setAuthor('');
                        setPage(1);
                      }}
                    >
                      Reset Filters
                    </Button>
                  </form>
                </div>
              </aside>

              {/* Main Content */}
              <div className="w-full lg:w-3/4 space-y-8">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="space-y-4">
                        <Skeleton className="h-56 w-full rounded-xl" />
                      </div>
                    ))}
                  </div>
                ) : articles.length > 0 ? (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm text-muted-foreground">
                        Showing page {page} of {totalPages}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {articles.map((article) => (
                        <ResearchCard key={article.id} article={article} />
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-10 border-t mt-10">
                        <Button 
                          variant="outline" 
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page === 1}
                        >
                          <ChevronLeft className="h-4 w-4 mr-2" />
                          Previous
                        </Button>
                        <div className="flex gap-1 mx-4">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            // Simple pagination logic for display
                            let pageNum = i + 1;
                            if (totalPages > 5 && page > 3) {
                              pageNum = page - 2 + i;
                              if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                            }
                            return (
                              <Button
                                key={pageNum}
                                variant={page === pageNum ? "default" : "ghost"}
                                size="icon"
                                className="w-8 h-8"
                                onClick={() => setPage(pageNum)}
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-24 bg-muted/20 rounded-2xl border border-dashed">
                    <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-40" />
                    <h3 className="text-xl font-semibold mb-2">No research publications found</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      We couldn't find any articles matching your current filters. Try broadening your search criteria.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-6"
                      onClick={() => {
                        setSearchQuery('');
                        setCategory('all');
                        setAuthor('');
                        setPage(1);
                      }}
                    >
                      Clear all filters
                    </Button>
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

export default ResearchPage;