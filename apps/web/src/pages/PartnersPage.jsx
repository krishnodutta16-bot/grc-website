import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import PartnerCard from '@/components/PartnerCard.jsx';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const PartnersPage = () => {
  const [partners, setPartners] = useState([]);
  const [workshopCounts, setWorkshopCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [partnersData, workshopsData] = await Promise.all([
        pb.collection('partners').getFullList({ sort: 'name', $autoCancel: false }),
        pb.collection('workshops').getFullList({ $autoCancel: false })
      ]);

      const counts = {};
      workshopsData.forEach(workshop => {
        counts[workshop.partner_id] = (counts[workshop.partner_id] || 0) + 1;
      });

      setPartners(partnersData);
      setWorkshopCounts(counts);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Partner Universities - Global Research Centre</title>
        <meta name="description" content="Explore our network of leading universities and research institutions worldwide" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="bg-primary text-primary-foreground py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="h-10 w-10" />
                <h1 className="text-4xl md:text-5xl font-bold" style={{letterSpacing: '-0.02em'}}>
                  Partner universities
                </h1>
              </div>
              <p className="text-xl text-primary-foreground/90 max-w-2xl">
                In collaboration with leading universities and research institutions worldwide
              </p>
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            ) : partners.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {partners.map((partner) => (
                  <PartnerCard 
                    key={partner.id} 
                    partner={partner}
                    workshopCount={workshopCounts[partner.id] || 0}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No partners yet</h3>
                <p className="text-muted-foreground">
                  Partner universities will be listed here
                </p>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PartnersPage;