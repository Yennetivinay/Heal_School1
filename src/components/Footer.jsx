import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'About Us', to: '/about' },
    { label: 'Academics', to: '/academics/programs' },
    { label: 'Admissions', to: '/admissions' },
    { label: 'Events', to: '/events/annual-day' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'Contact', to: '/contact' },
  ];

  const resources = [
    { label: 'Infrastructure', to: '/infrastructure/library' },
    { label: 'Faculty', to: '/academics/faculty' },
    { label: 'Awards', to: '/awards' },
    { label: 'Certifications', to: '/certifications' },
    { label: 'Disclosure', to: '/disclosure' },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/HealVillage', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* School Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center border border-white/20">
                <img
                  src="/logo.png"
                  alt="Heal Paradise School Logo"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Heal Paradise</h3>
                <p className="text-xs text-slate-400">School</p>
              </div>
            </div>
           
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <GraduationCap className="w-4 h-4 text-sky-400" />
              <span>CBSE Affiliated</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-bold mb-3 text-white">Quick Links</h4>
            <ul className="space-y-1.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-slate-300 hover:text-sky-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-base font-bold mb-3 text-white">Resources</h4>
            <ul className="space-y-1.5">
              {resources.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-slate-300 hover:text-sky-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base font-bold mb-3 text-white">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-3 text-slate-300 text-sm">
                <MapPin className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  Heal Paradise School<br />
                  3-118, Thotapalli Village<br />
                  Agiripalli Madalam, Eluru District<br />
                  PIN Code: 521211
                </span>
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <Phone className="w-5 h-5 text-sky-400 shrink-0" />
                <a href="tel:+91XXXXXXXXXX" className="hover:text-sky-400 transition-colors">
                  +91 XXXXXXXXXX
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <Mail className="w-5 h-5 text-sky-400 shrink-0" />
                <a href="mailto:info@healparadiseschool.edu" className="hover:text-sky-400 transition-colors break-all">
                  info@healparadiseschool.edu
                </a>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-4">
              <h5 className="text-sm font-semibold mb-2 text-slate-400">Follow Us</h5>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 rounded-full bg-slate-700/50 hover:bg-sky-500 flex items-center justify-center transition-all duration-200 hover:scale-110 border border-slate-600 hover:border-sky-400"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
            
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 mt-6 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-slate-400 text-sm text-center md:text-left">
              <p>
                ©  Heal Paradise School {currentYear}. All rights reserved.
              </p>
             
            </div>

            {/* Additional Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link to="/disclosure" className="text-slate-400 hover:text-sky-400 transition-colors">
                Disclosure
              </Link>
              <span className="text-slate-600">|</span>
              <Link to="/certifications" className="text-slate-400 hover:text-sky-400 transition-colors">
                Certifications
              </Link>
              <span className="text-slate-600">|</span>
              <a href="#" className="text-slate-400 hover:text-sky-400 transition-colors">
                Privacy Policy
              </a>
              <span className="text-slate-600">|</span>
              <a href="#" className="text-slate-400 hover:text-sky-400 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
     
    </footer>
  );
};

export default Footer;

