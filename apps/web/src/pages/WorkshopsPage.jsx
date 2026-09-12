import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import WorkshopCard from '@/components/WorkshopCard.jsx';
import FilterBar from '@/components/FilterBar.jsx';
import SearchBar from '@/components/SearchBar.jsx';
import { Skeleton } from '@/components/ui/skeleton';
import pb from '@/lib/pocketbaseClient';
import { BookOpen } from 'lucide-react';

const WorkshopsPage = () => {
  const [workshops, setWorkshops] = useState([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    difficulty: 'all',
    language: 'all',
    partner: 'all',
    status: 'all',
    partnerOptions: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [workshops, searchQuery, filters]);

  const fetchData = async () => {
    try {
      const [workshopsData, partnersData] = await Promise.all([
        pb.collection('workshops').getFullList({
          expand: 'partner_id',
          sort: '-created',
          $autoCancel: false
        }),
        pb.collection('partners').getFullList({ $autoCancel: false })
      ]);

      setWorkshops(workshopsData);
      setPartners(partnersData);
      setFilters(prev => ({ ...prev, partnerOptions: partnersData }));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...workshops];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(w => 
        w.title.toLowerCase().includes(query) ||
        w.description.toLowerCase().includes(query) ||
        w.instructor_name.toLowerCase().includes(query)
      );
    }

    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(w => w.difficulty_level === filters.difficulty);
    }

    if (filters.language !== 'all') {
      filtered = filtered.filter(w => w.language === filters.language);
    }

    if (filters.partner !== 'all') {
      filtered = filtered.filter(w => w.partner_id === filters.partner);
    }

    if (filters.status === 'available') {
      filtered = filtered.filter(w => (w.enrolled_count || 0) < w.capacity);
    } else if (filters.status === 'full') {
      filtered = filtered.filter(w => (w.enrolled_count || 0) >= w.capacity);
    }

    setFilteredWorkshops(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <Helmet>
        <title>Workshops - Global Research Centre</title>
        <meta name="description" content="Browse and enroll in professional development workshops from leading universities worldwide" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="bg-primary text-primary-foreground py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-10 w-10" />
                <h1 className="text-4xl md:text-5xl font-bold" style={{letterSpacing: '-0.02em'}}>
                  Workshops
                </h1>
              </div>
              <p className="text-xl text-primary-foreground/90 max-w-2xl">
                Explore professional development opportunities from leading universities worldwide
              </p>
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-6">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              
              <FilterBar filters={filters} onFilterChange={handleFilterChange} />

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="h-48 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : filteredWorkshops.length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredWorkshops.length} {filteredWorkshops.length === 1 ? 'workshop' : 'workshops'}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWorkshops.map((workshop) => (
                      <WorkshopCard key={workshop.id} workshop={workshop} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No workshops found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search query
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default WorkshopsPage;