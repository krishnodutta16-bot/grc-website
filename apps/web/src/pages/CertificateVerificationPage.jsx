import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShieldCheck, Search, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import pb from '@/lib/pocketbaseClient';

const CertificateVerificationPage = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotFound(false);
    setCertificate(null);

    try {
      const results = await pb.collection('certificates').getFullList({
        filter: `certificate_code="${code.trim()}"`,
        expand: 'user_id,workshop_id,partner_id',
        $autoCancel: false
      });

      if (results.length > 0) {
        const cert = results[0];
        setCertificate(cert);
        
        await pb.collection('certificates').update(cert.id, {
          verified_count: (cert.verified_count || 0) + 1
        }, { $autoCancel: false });
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Verification error:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Verify Certificate - Global Research Centre</title>
        <meta name="description" content="Verify the authenticity of GRC certificates" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="bg-primary text-primary-foreground py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="h-10 w-10" />
                <h1 className="text-4xl md:text-5xl font-bold" style={{letterSpacing: '-0.02em'}}>
                  Verify certificate
                </h1>
              </div>
              <p className="text-xl text-primary-foreground/90 max-w-2xl">
                Enter a certificate code to verify its authenticity
              </p>
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-2xl mx-auto space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Enter certificate code</CardTitle>
                  <CardDescription>
                    The certificate code can be found on the certificate document
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleVerify} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="code">Certificate Code</Label>
                      <Input
                        id="code"
                        type="text"
                        placeholder="GRC-1234567890-ABCDEFGHI"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        className="text-foreground font-mono"
                      />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                      <Search className="h-4 w-4 mr-2" />
                      {loading ? 'Verifying...' : 'Verify Certificate'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {certificate && (
                <Card className="border-2 border-accent">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-accent mb-2">
                      <CheckCircle2 className="h-6 w-6" />
                      <span className="font-semibold text-lg">Certificate Verified</span>
                    </div>
                    <CardDescription>
                      This certificate is authentic and was issued by the Global Research Centre
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Recipient</p>
                      <p className="text-lg font-semibold">{certificate.expand?.user_id?.name}</p>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Workshop</p>
                      <p className="text-lg font-semibold">{certificate.expand?.workshop_id?.title}</p>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Partner University</p>
                      <p className="text-lg font-semibold">{certificate.expand?.partner_id?.name}</p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Issue Date</p>
                        <p className="font-medium">{format(new Date(certificate.created), 'MMM dd, yyyy')}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Certificate Code</p>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {certificate.certificate_code}
                        </code>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        Verified {certificate.verified_count} times
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        Last verified: {format(new Date(), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {notFound && (
                <Card className="border-2 border-destructive">
                  <CardContent className="pt-6 text-center py-12">
                    <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Certificate not found</h3>
                    <p className="text-sm text-muted-foreground">
                      The certificate code you entered could not be verified. Please check the code and try again.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CertificateVerificationPage;