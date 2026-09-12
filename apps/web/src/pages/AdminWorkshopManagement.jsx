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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Edit, Trash2, ArrowLeft, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const AdminWorkshopManagement = () => {
  const [workshops, setWorkshops] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor_name: '',
    instructor_bio: '',
    partner_id: '',
    date: '',
    capacity: '',
    syllabus: '',
    learning_outcomes: '',
    language: 'English',
    difficulty_level: 'Beginner'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [workshopsData, partnersData] = await Promise.all([
        pb.collection('workshops').getFullList({ expand: 'partner_id', sort: '-created', $autoCancel: false }),
        pb.collection('partners').getFullList({ sort: 'name', $autoCancel: false })
      ]);
      setWorkshops(workshopsData);
      setPartners(partnersData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = {
        ...formData,
        capacity: parseInt(formData.capacity),
        enrolled_count: editingWorkshop?.enrolled_count || 0
      };

      if (editingWorkshop) {
        await pb.collection('workshops').update(editingWorkshop.id, data, { $autoCancel: false });
        toast.success('Workshop updated successfully');
      } else {
        await pb.collection('workshops').create(data, { $autoCancel: false });
        toast.success('Workshop created successfully');
      }

      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving workshop:', error);
      toast.error('Failed to save workshop');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (workshop) => {
    setEditingWorkshop(workshop);
    setFormData({
      title: workshop.title,
      description: workshop.description,
      instructor_name: workshop.instructor_name,
      instructor_bio: workshop.instructor_bio || '',
      partner_id: workshop.partner_id,
      date: workshop.date,
      capacity: workshop.capacity.toString(),
      syllabus: workshop.syllabus || '',
      learning_outcomes: workshop.learning_outcomes || '',
      language: workshop.language || 'English',
      difficulty_level: workshop.difficulty_level || 'Beginner'
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workshop?')) return;

    try {
      await pb.collection('workshops').delete(id, { $autoCancel: false });
      toast.success('Workshop deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting workshop:', error);
      toast.error('Failed to delete workshop');
    }
  };

  const resetForm = () => {
    setEditingWorkshop(null);
    setFormData({
      title: '',
      description: '',
      instructor_name: '',
      instructor_bio: '',
      partner_id: '',
      date: '',
      capacity: '',
      syllabus: '',
      learning_outcomes: '',
      language: 'English',
      difficulty_level: 'Beginner'
    });
  };

  return (
    <>
      <Helmet>
        <title>Manage Workshops - Admin - GRC</title>
        <meta name="description" content="Manage workshops" />
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
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Workshops</h1>
              <p className="text-primary-foreground/90">Create and manage workshops</p>
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Workshops</h2>
              <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Workshop
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingWorkshop ? 'Edit Workshop' : 'Add New Workshop'}</DialogTitle>
                    <DialogDescription>
                      {editingWorkshop ? 'Update workshop information' : 'Create a new workshop'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Workshop Title</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="text-foreground"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="partner">Partner University</Label>
                          <Select value={formData.partner_id} onValueChange={(value) => setFormData({ ...formData, partner_id: value })}>
                            <SelectTrigger id="partner">
                              <SelectValue placeholder="Select partner" />
                            </SelectTrigger>
                            <SelectContent>
                              {partners.map((partner) => (
                                <SelectItem key={partner.id} value={partner.id}>{partner.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          required
                          rows={3}
                          className="text-foreground"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="instructor_name">Instructor Name</Label>
                          <Input
                            id="instructor_name"
                            value={formData.instructor_name}
                            onChange={(e) => setFormData({ ...formData, instructor_name: e.target.value })}
                            required
                            className="text-foreground"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="date">Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                            className="text-foreground"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="instructor_bio">Instructor Bio</Label>
                        <Textarea
                          id="instructor_bio"
                          value={formData.instructor_bio}
                          onChange={(e) => setFormData({ ...formData, instructor_bio: e.target.value })}
                          rows={2}
                          className="text-foreground"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="capacity">Capacity</Label>
                          <Input
                            id="capacity"
                            type="number"
                            min="1"
                            value={formData.capacity}
                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                            required
                            className="text-foreground"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="language">Language</Label>
                          <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
                            <SelectTrigger id="language">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="English">English</SelectItem>
                              <SelectItem value="Spanish">Spanish</SelectItem>
                              <SelectItem value="French">French</SelectItem>
                              <SelectItem value="Mandarin">Mandarin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="difficulty">Difficulty</Label>
                          <Select value={formData.difficulty_level} onValueChange={(value) => setFormData({ ...formData, difficulty_level: value })}>
                            <SelectTrigger id="difficulty">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">Intermediate</SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="syllabus">Syllabus</Label>
                        <Textarea
                          id="syllabus"
                          value={formData.syllabus}
                          onChange={(e) => setFormData({ ...formData, syllabus: e.target.value })}
                          rows={3}
                          className="text-foreground"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="learning_outcomes">Learning Outcomes</Label>
                        <Textarea
                          id="learning_outcomes"
                          value={formData.learning_outcomes}
                          onChange={(e) => setFormData({ ...formData, learning_outcomes: e.target.value })}
                          rows={3}
                          className="text-foreground"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={submitting}>
                        {submitting ? 'Saving...' : editingWorkshop ? 'Update' : 'Create'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : workshops.length > 0 ? (
              <div className="space-y-4">
                {workshops.map((workshop) => (
                  <Card key={workshop.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="mb-2">{workshop.title}</CardTitle>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="secondary">{workshop.expand?.partner_id?.name}</Badge>
                            <Badge variant="outline">{workshop.difficulty_level}</Badge>
                            <Badge variant="outline">{workshop.language}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{workshop.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(workshop.date), 'MMM dd, yyyy')}
                          </div>
                          <span>{workshop.enrolled_count || 0}/{workshop.capacity} enrolled</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(workshop)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(workshop.id)}>
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
                  <h3 className="font-semibold mb-2">No workshops yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">Create your first workshop</p>
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

export default AdminWorkshopManagement;