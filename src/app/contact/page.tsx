import {
    Building2,
    Clock,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Sparkles,
  } from "lucide-react";
  
  import Navbar from "@/components/layout/Navbar";
  import Footer from "@/components/layout/Footer";
  import Container from "@/components/layout/Container";
  import Section from "@/components/layout/Section";
  import ContactForm from "@/components/shared/ContactForm";
  
  const contactCards = [
    {
      icon: Mail,
      title: "Email",
      value: "hello@propertyflow.ai",
      description: "For platform, support, and partnership queries.",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+971 00 000 0000",
      description: "Speak with our real estate platform team.",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Dubai, UAE",
      description: "Built for premium GCC real estate markets.",
    },
    {
      icon: Clock,
      title: "Working Hours",
      value: "Mon - Sat",
      description: "9:00 AM - 6:00 PM GST",
    },
  ];
  
  export default function ContactPage() {
    return (
      <>
        <Navbar />
  
        <main>
          <section className="border-b border-border bg-[linear-gradient(180deg,#ffffff,#f8fafc)]">
            <Container>
              <div className="py-12 sm:py-20 lg:py-24">
                <div className="max-w-4xl">
                  <div className="mb-5 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800 sm:text-sm">
                    <Sparkles size={16} className="mr-2" />
                    Contact PropertyFlow AI
                  </div>
  
                  <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                    Let’s build smarter real estate experiences together.
                  </h1>
  
                  <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:mt-6 sm:text-lg sm:leading-8">
                    Contact our team for property platform queries, partnerships,
                    agent onboarding, investment insights, or product support.
                  </p>
                </div>
              </div>
            </Container>
          </section>
  
          <Section className="bg-white">
            <Container>
              <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                    {contactCards.map((card) => {
                      const Icon = card.icon;
  
                      return (
                        <div
                          key={card.title}
                          className="rounded-[1.75rem] border border-border bg-secondary p-5 sm:rounded-[2rem] sm:p-6"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary">
                            <Icon size={24} />
                          </div>
  
                          <h3 className="mt-5 font-heading text-xl font-bold">
                            {card.title}
                          </h3>
  
                          <p className="mt-2 font-semibold text-foreground">
                            {card.value}
                          </p>
  
                          <p className="mt-2 text-sm leading-7 text-muted-foreground">
                            {card.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
  
                <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-xl shadow-slate-200/70 sm:rounded-[2rem] sm:p-6 lg:p-8">
                  <div className="mb-8">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-primary">
                      <MessageCircle size={24} />
                    </div>
  
                    <h2 className="font-heading text-2xl font-bold sm:text-3xl">
                      Send us a message
                    </h2>
  
                    <p className="mt-2 text-muted-foreground">
                      Fill the form below and our team will get back to you.
                    </p>
                  </div>
  
                  <ContactForm />
                </div>
              </div>
            </Container>
          </Section>
  
          <Section className="bg-secondary/40">
            <Container>
              <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-8 lg:p-12">
                <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                  <div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-primary">
                      <Building2 size={28} />
                    </div>
  
                    <h2 className="mt-6 font-heading text-3xl font-bold sm:text-4xl">
                      Built for GCC real estate teams.
                    </h2>
  
                    <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                      PropertyFlow AI is designed for property businesses, agents,
                      investors, and customers looking for a smarter real estate
                      workflow.
                    </p>
                  </div>
  
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      "Agent onboarding",
                      "Property discovery",
                      "Market intelligence",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-border bg-secondary p-5"
                      >
                        <p className="font-heading font-bold">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Container>
          </Section>
        </main>
  
        <Footer />
      </>
    );
  }
