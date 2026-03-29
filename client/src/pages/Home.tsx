import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { MessageCircle, Mail, Phone, MapPin, ArrowRight, Star, Zap, BarChart3, Code2, TrendingUp, Users } from 'lucide-react';
import AIChatbotWidget from '@/components/AIChatbotWidget';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';

export default function Home() {
  const [, setLocation] = useLocation();
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createLeadMutation = trpc.leads.create.useMutation();

  const handleAdminClick = () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setLocation('/admin/dashboard');
    } else {
      setLocation('/admin/login');
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createLeadMutation.mutateAsync({
        name: contactForm.name,
        email: contactForm.email,
        phone: contactForm.phone,
        projectType: 'web_development', // Default for contact form
      });

      toast.success('Thank you! We\'ll be in touch shortly.');
      setContactForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="container flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-primary">ViyonaDigital</div>
          <div className="hidden md:flex gap-8">
            <a href="#services" className="text-foreground hover:text-primary transition-colors">Services</a>
            <a href="#portfolio" className="text-foreground hover:text-primary transition-colors">Portfolio</a>
            <a href="#testimonials" className="text-foreground hover:text-primary transition-colors">Testimonials</a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient section-padding">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Transform Your Business with <span className="text-primary">Digital Excellence</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                We deliver cutting-edge digital marketing, web development, and data analysis solutions tailored to your unique business needs.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Button className="btn-primary" size="lg">
                  Get Started
                  <ArrowRight className="ml-2" size={20} />
                </Button>
                <Button className="btn-outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="hidden md:block animate-fade-in-scale">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-12 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Zap size={64} className="text-primary mx-auto mb-4" />
                  <p className="text-xl font-semibold text-foreground">Innovative Solutions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-padding bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Services</h2>
            <p className="text-xl text-muted-foreground">Comprehensive solutions for your digital transformation</p>
          </div>

          <div className="services-grid">
            {/* Digital Marketing */}
            <Card className="p-8 border border-border rounded-lg shadow-lg hover:shadow-xl transition-shadow hover:border-primary">
              <div className="mb-4">
                <TrendingUp size={40} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Digital Marketing</h3>
              <p className="text-muted-foreground mb-4">
                Boost your online presence with strategic SEO, social media marketing, and targeted advertising campaigns.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  SEO Optimization
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Social Media Management
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Content Marketing
                </li>
              </ul>
            </Card>

            {/* Web Development */}
            <Card className="p-8 border border-border rounded-lg shadow-lg hover:shadow-xl transition-shadow hover:border-primary">
              <div className="mb-4">
                <Code2 size={40} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Web Development</h3>
              <p className="text-muted-foreground mb-4">
                Custom, responsive websites and web applications built with the latest technologies for optimal performance.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Responsive Design
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Web Applications
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  E-commerce Solutions
                </li>
              </ul>
            </Card>

            {/* Data Analysis */}
            <Card className="p-8 border border-border rounded-lg shadow-lg hover:shadow-xl transition-shadow hover:border-primary">
              <div className="mb-4">
                <BarChart3 size={40} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Data Analysis</h3>
              <p className="text-muted-foreground mb-4">
                Unlock insights from your data with advanced analytics and visualization tools to drive informed decisions.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Business Intelligence
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Data Visualization
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Predictive Analytics
                </li>
              </ul>
            </Card>
          </div>

          {/* Coming Soon Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-2 border-secondary/30 bg-secondary/5 shadow-md">
              <div className="badge-coming-soon mb-3">Coming Soon</div>
              <h4 className="text-xl font-bold text-foreground mb-2">AI Automation</h4>
              <p className="text-muted-foreground">Streamline your workflows with intelligent automation powered by cutting-edge AI technology.</p>
            </Card>
            <Card className="p-6 border-2 border-secondary/30 bg-secondary/5 shadow-md">
              <div className="badge-coming-soon mb-3">Coming Soon</div>
              <h4 className="text-xl font-bold text-foreground mb-2">Digital Ads</h4>
              <p className="text-muted-foreground">Maximize your ROI with targeted digital advertising campaigns across all major platforms.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="section-padding bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Recent Projects</h2>
            <p className="text-xl text-muted-foreground">Showcasing our best work</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <div className="bg-gradient-to-br from-primary/20 to-secondary/20 h-48 flex items-center justify-center">
                  <div className="text-center">
                    <Code2 size={48} className="text-primary mx-auto mb-2" />
                    <p className="text-foreground font-semibold">Project {item}</p>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold text-foreground mb-2">E-commerce Platform</h4>
                  <p className="text-muted-foreground text-sm mb-4">
                    A modern, scalable e-commerce solution with advanced features and seamless user experience.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">React</span>
                    <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">Node.js</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section-padding bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">What Our Clients Say</h2>
            <p className="text-xl text-muted-foreground">Trusted by leading businesses</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-foreground mb-4">
                  "ViyonaDigital transformed our digital presence. Their team is professional, innovative, and results-driven. Highly recommended!"
                </p>
                <div>
                  <p className="font-semibold text-foreground">Client Name</p>
                  <p className="text-sm text-muted-foreground">Company Name</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Get In Touch</h2>
            <p className="text-xl text-muted-foreground">Let's discuss your next project</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="bg-primary/10 p-4 rounded-lg h-fit">
                  <Mail size={24} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Email</h4>
                  <p className="text-muted-foreground">hello@viyonadigital.com</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-primary/10 p-4 rounded-lg h-fit">
                  <Phone size={24} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Phone</h4>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-primary/10 p-4 rounded-lg h-fit">
                  <MapPin size={24} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Location</h4>
                  <p className="text-muted-foreground">123 Business Street, City, State 12345</p>
                </div>
              </div>

              {/* WhatsApp Contact */}
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white mt-8">
                <MessageCircle className="mr-2" size={20} />
                Chat on WhatsApp
              </Button>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <Input
                placeholder="Your Name"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                required
              />
              <Input
                type="email"
                placeholder="Your Email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                required
              />
              <Input
                type="tel"
                placeholder="Your Phone"
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
              />
              <Textarea
                placeholder="Your Message"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                rows={5}
              />
              <Button
                type="submit"
                className="w-full btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer - Fixed Bottom Right */}
      <footer className="fixed bottom-0 right-0 bg-foreground text-white p-6 rounded-tl-lg shadow-2xl max-w-xs z-30">
        <div className="space-y-3">
          <div>
            <h4 className="font-bold text-sm mb-2">ViyonaDigital</h4>
            <p className="text-white/70 text-xs">Transforming businesses through digital innovation.</p>
          </div>
          <div className="border-t border-white/20 pt-3">
            <p className="text-white/70 text-xs mb-2">&copy; 2026 ViyonaDigital</p>
            <div className="flex gap-2 flex-wrap">
              <a href="#" className="text-white/70 hover:text-white transition-colors text-xs">LinkedIn</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors text-xs">Twitter</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors text-xs">Facebook</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Admin Button */}
      <button
        onClick={handleAdminClick}
        className="admin-button"
        title="Admin Panel"
      >
        <span className="text-xs font-bold">Admin</span>
      </button>

      {/* Chatbot Widget */}
      <AIChatbotWidget />
    </div>
  );
}
