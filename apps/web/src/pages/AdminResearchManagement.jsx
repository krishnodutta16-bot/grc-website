import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Edit, Trash2, ArrowLeft, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const AdminResearchManagement = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Computer Science', 'Life Sciences', 'Engineering', 'Social Sciences', 'Other'];

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    abstract: '',
    author: '',
    author_bio: '',
    research_category: 'Computer Science',
    publication_date: new Date().toISOString().split('T')[0],
    citations: '',
    featured: false
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const data = await pb.collection('research_articles').getFullList({ sort: '-publication_date', $autoCancel: false });
      setArticles(data);
    } catch (error) {
      console.error('Error fetching research:', error);
      toast.error('Failed to load research articles');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const dataToSave = {
        ...formData,
        publication_date: `${formData.publication_date} 12:00:00.000Z`
      };

      if (editingArticle) {
        await pb.collection('research_articles').update(editingArticle.id, dataToSave, { $autoCancel: false });
        toast.success('Research article updated successfully');
      } else {
        await pb.collection('research_articles').create(dataToSave, { $autoCancel: false });
        toast.success('Research article created successfully');
      }

      setDialogOpen(false);
      resetForm();
      fetchArticles();
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error('Failed to save research article');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      abstract: article.abstract || '',
      author: article.author || '',
      author_bio: article.author_bio || '',
      research_category: article.research_category || 'Computer Science',
      publication_date: article.publication_date ? article.publication_date.split(' ')[0] : new Date().toISOString().split('T')[0],
      citations: article.citations || '',
      featured: article.featured || false
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this research article?')) return;

    try {
      await pb.collection('research_articles').delete(id, { $autoCancel: false });
      toast.success('Article deleted successfully');
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('Failed to delete article');
    }
  };

  const resetForm = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      content: '',
      abstract: '',
      author: '',
      author_bio: '',
      research_category: 'Computer Science',
      publication_date: new Date().toISOString().split('T')[0],
      citations: '',
      featured: false
    });
  };

  return (
    <>
      <Helmet>
        <title>Manage Research - Admin - GRC</title>
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
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Research</h1>
              <p className="text-primary-foreground/90">Publish and manage research articles</p>
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Research Publications</h2>
              <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Publish Research
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingArticle ? 'Edit Research' : 'Publish New Research'}</DialogTitle>
                    <DialogDescription>
                      Enter the details of the research publication.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="author">Author(s) *</Label>
                          <Input
                            id="author"
                            value={formData.author}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="research_category">Discipline</Label>
                          <Select value={formData.research_category} onValueChange={(value) => setFormData({ ...formData, research_category: value })}>
                            <SelectTrigger id="research_category">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="publication_date">Publication Date *</Label>
                          <Input
                            id="publication_date"
                            type="date"
                            value={formData.publication_date}
                            onChange={(e) => setFormData({ ...formData, publication_date: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="author_bio">Author Bio</Label>
                        <Textarea
                          id="author_bio"
                          value={formData.author_bio}
                          onChange={(e) => setFormData({ ...formData, author_bio: e.target.value })}
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="abstract">Abstract</Label>
                        <Textarea
                          id="abstract"
                          value={formData.abstract}
                          onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="content">Full Text *</Label>
                        <Textarea
                          id="content"
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          required
                          rows={12}
                          className="font-mono text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="citations">Citations & References</Label>
                        <Textarea
                          id="citations"
                          value={formData.citations}
                          onChange={(e) => setFormData({ ...formData, citations: e.target.value })}
                          rows={4}
                          placeholder="List references here..."
                        />
                      </div>

                      <div className="flex items-center space-x-2 bg-muted/50 p-4 rounded-lg">
                        <Switch
                          id="featured"
                          checked={formData.featured}
                          onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                        />
                        <Label htmlFor="featured" className="cursor-pointer">Feature this research on the homepage</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={submitting}>
                        {submitting ? 'Saving...' : editingArticle ? 'Update Research' : 'Publish Research'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className="space-y-4">
                {articles.map((article) => (
                  <Card key={article.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{article.title}</h3>
                            {article.featured && <Badge variant="secondary" className="bg-amber-100 text-amber-800">Featured</Badge>}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <Badge variant="outline">{article.research_category}</Badge>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(article.publication_date), 'MMM dd, yyyy')}
                            </span>
                            <span>By {article.author}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(article)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(article.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No research published yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">Publish your first research article.</p>
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

export default AdminResearchManagement;