import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Eye, Users, Award } from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: Target,
      title: 'Excellence',
      description: 'We partner with leading universities to deliver world-class professional development programs'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Building bridges between researchers, institutions, and knowledge across borders'
    },
    {
      icon: Award,
      title: 'Recognition',
      description: 'Co-branded certificates that validate your achievements and enhance your professional profile'
    },
    {
      icon: Eye,
      title: 'Accessibility',
      description: 'Making quality research training accessible to scholars worldwide'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - Global Research Centre</title>
        <meta name="description" content="Learn about GRC's mission to empower researchers worldwide through collaborative learning" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="bg-primary text-primary-foreground py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{letterSpacing: '-0.02em'}}>
                About Global Research Centre
              </h1>
              <p className="text-xl text-primary-foreground/90 max-w-2xl">
                Empowering researchers worldwide through collaborative learning
              </p>
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-4xl mx-auto space-y-16">
              <section>
                <h2 className="text-3xl font-bold mb-6">Our mission</h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    The Global Research Centre (GRC) is dedicated to advancing research excellence by connecting scholars with world-class professional development opportunities. Through strategic partnerships with leading universities, we provide researchers with access to cutting-edge workshops, training programs, and certification courses that enhance their skills and expand their professional networks.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Our platform bridges geographical and institutional boundaries, creating a global community of researchers committed to continuous learning and collaboration. Every workshop is co-designed with our partner universities, ensuring the highest academic standards and real-world relevance.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-bold mb-6">Our vision</h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    We envision a world where every researcher, regardless of location or institutional affiliation, has access to premium professional development opportunities. By fostering collaboration between universities and creating pathways for knowledge exchange, we aim to accelerate research innovation and impact globally.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-bold mb-8">Our values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {values.map((value, index) => {
                    const Icon = value.icon;
                    return (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>{value.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{value.description}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-bold mb-6">How it works</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Browse workshops</h3>
                      <p className="text-muted-foreground">
                        Explore our catalog of workshops from leading universities across various research disciplines and skill levels.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Enroll and learn</h3>
                      <p className="text-muted-foreground">
                        Register for workshops that match your interests and career goals. Access materials, participate in sessions, and engage with instructors and peers.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Earn certificates</h3>
                      <p className="text-muted-foreground">
                        Upon completion, receive a co-branded certificate from GRC and the partner university, validating your achievement and enhancing your professional credentials.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AboutPage;