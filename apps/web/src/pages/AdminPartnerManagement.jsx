import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const AdminPartnerManagement = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    certificate_template_colors: ''
  });
  const [logoFile, setLogoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const data = await pb.collection('partners').getFullList({ sort: 'name', $autoCancel: false });
      setPartners(data);
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast.error('Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('certificate_template_colors', formData.certificate_template_colors);
      
      if (logoFile) {
        data.append('logo', logoFile);
      }

      if (editingPartner) {
        await pb.collection('partners').update(editingPartner.id, data, { $autoCancel: false });
        toast.success('Partner updated successfully');
      } else {
        await pb.collection('partners').create(data, { $autoCancel: false });
        toast.success('Partner created successfully');
      }

      setDialogOpen(false);
      resetForm();
      fetchPartners();
    } catch (error) {
      console.error('Error saving partner:', error);
      toast.error('Failed to save partner');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      description: partner.description || '',
      certificate_template_colors: partner.certificate_template_colors || ''
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this partner?')) return;

    try {
      await pb.collection('partners').delete(id, { $autoCancel: false });
      toast.success('Partner deleted successfully');
      fetchPartners();
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast.error('Failed to delete partner');
    }
  };

  const resetForm = () => {
    setEditingPartner(null);
    setFormData({ name: '', description: '', certificate_template_colors: '' });
    setLogoFile(null);
  };

  return (
    <>
      <Helmet>
        <title>Manage Partners - Admin - GRC</title>
        <meta name="description" content="Manage partner universities" />
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
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Partners</h1>
              <p className="text-primary-foreground/90">Add and edit partner universities</p>
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Partner Universities</h2>
              <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Partner
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingPartner ? 'Edit Partner' : 'Add New Partner'}</DialogTitle>
                    <DialogDescription>
                      {editingPartner ? 'Update partner information' : 'Add a new partner university'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">University Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="text-foreground"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={3}
                          className="text-foreground"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="logo">Logo</Label>
                        <Input
                          id="logo"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setLogoFile(e.target.files[0])}
                          className="text-foreground"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="colors">Certificate Template Colors</Label>
                        <Input
                          id="colors"
                          value={formData.certificate_template_colors}
                          onChange={(e) => setFormData({ ...formData, certificate_template_colors: e.target.value })}
                          placeholder="#1e40af,#3b82f6"
                          className="text-foreground"
                        />
                        <p className="text-xs text-muted-foreground">Comma-separated hex colors for certificate branding</p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={submitting}>
                        {submitting ? 'Saving...' : editingPartner ? 'Update' : 'Create'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            ) : partners.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {partners.map((partner) => {
                  const logoUrl = partner.logo ? pb.files.getUrl(partner, partner.logo) : null;
                  return (
                    <Card key={partner.id}>
                      <CardHeader>
                        {logoUrl && (
                          <div className="mb-4 flex justify-center">
                            <img src={logoUrl} alt={partner.name} className="h-20 w-20 object-contain" />
                          </div>
                        )}
                        <CardTitle className="text-center">{partner.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {partner.description && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{partner.description}</p>
                        )}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(partner)} className="flex-1">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(partner.id)} className="flex-1">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
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
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No partners yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">Add your first partner university</p>
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

export default AdminPartnerManagement;