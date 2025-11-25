import React from 'react';
import Demo from './Demo';

const AdmissionProcess = () => {
  const admissionFeatures = [
    {
      step: "Step 1",
      title: "Submit Application",
      content: "Fill out our online application form with basic student information and family background details.",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop"
    },
    {
      step: "Step 2",
      title: "Document Verification",
      content: "Our team reviews your documents and verifies eligibility for the scholarship program.",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1600&auto=format&fit=crop"
    },
    {
      step: "Step 3",
      title: "Interview & Assessment",
      content: "Meet with our admissions team for a personal interview and academic assessment.",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop"
    },
    {
      step: "Step 4",
      title: "Scholarship Approval",
      content: "Receive confirmation of your 100% scholarship and residential care approval.",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop"
    },
    {
      step: "Step 5",
      title: "Welcome to Heal Paradise",
      content: "Join our community and begin your journey with full support, free accommodation, and quality education.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop"
    }
  ];

  return (
    <Demo 
      features={admissionFeatures}
      title="How to Get Started"
      autoPlayInterval={4000}
      imageHeight="h-[500px] md:h-[600px] lg:h-[700px]"
    />
  );
};

export default AdmissionProcess;

