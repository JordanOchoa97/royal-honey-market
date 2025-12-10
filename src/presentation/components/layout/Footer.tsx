// src/presentation/components/layout/Footer.tsx
'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { memo, useState } from 'react';
import { Button } from '@/src/presentation/components/ui/Button';

const FooterWrapper = styled.footer`
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  color: white;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 4rem 2rem 2rem;

  @media (max-width: 640px) {
    padding: 3rem 1rem 1.5rem;
  }
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 2fr 1fr 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FooterBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const BrandIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
`;

const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
`;

const BrandName = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #fbbf24;
`;

const BrandTagline = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
`;

const FooterDescription = styled.p`
  color: #9ca3af;
  line-height: 1.6;
  font-size: 0.9375rem;
`;

const ColumnTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FooterLink = styled(Link)`
  color: #9ca3af;
  text-decoration: none;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: #fbbf24;
    transform: translateX(4px);
  }
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 0.9375rem;
  transition: all 0.2s ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
    border-color: #fbbf24;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialLink = styled.a`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  font-size: 1.25rem;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: #fbbf24;
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(251, 191, 36, 0.3);
  }
`;

const FooterDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 2rem 0;
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: #9ca3af;
  font-size: 0.875rem;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 1.5rem;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const LegalLink = styled(Link)`
  color: #9ca3af;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;

  &:hover {
    color: #fbbf24;
  }
`;

const SuccessMessage = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.4);
  border-radius: 6px;
  color: #10b981;
  font-size: 0.875rem;
  text-align: center;
`;

export const Footer = memo(function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <FooterWrapper>
      <FooterContent>
        <FooterGrid>
          <FooterColumn>
            <FooterBrand>
              <BrandIcon>🍯</BrandIcon>
              <BrandText>
                <BrandName>Royal Honey</BrandName>
                <BrandTagline>Premium Quality</BrandTagline>
              </BrandText>
            </FooterBrand>
            <FooterDescription>
              Discover the finest organic honey and bee products. 
              Sustainably sourced from pristine locations worldwide, 
              bringing nature&apos;s golden treasure to your table.
            </FooterDescription>
            <SocialLinks>
              <SocialLink href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                📘
              </SocialLink>
              <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                📷
              </SocialLink>
              <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                🐦
              </SocialLink>
              <SocialLink href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                📹
              </SocialLink>
            </SocialLinks>
          </FooterColumn>

          <FooterColumn>
            <ColumnTitle>Shop</ColumnTitle>
            <FooterLinks>
              <li><FooterLink href="/products">All Products</FooterLink></li>
              <li><FooterLink href="/categories">Categories</FooterLink></li>
              <li><FooterLink href="/products?category=raw-honey">Raw Honey</FooterLink></li>
              <li><FooterLink href="/products?category=honeycomb">Honeycomb</FooterLink></li>
              <li><FooterLink href="/products?onSale=true">Sale</FooterLink></li>
              <li><FooterLink href="/products?featured=true">Featured</FooterLink></li>
            </FooterLinks>
          </FooterColumn>

          <FooterColumn>
            <ColumnTitle>Company</ColumnTitle>
            <FooterLinks>
              <li><FooterLink href="/about">About Us</FooterLink></li>
              <li><FooterLink href="/contact">Contact</FooterLink></li>
              <li><FooterLink href="/blog">Blog</FooterLink></li>
              <li><FooterLink href="/sustainability">Sustainability</FooterLink></li>
              <li><FooterLink href="/careers">Careers</FooterLink></li>
            </FooterLinks>
          </FooterColumn>

          <FooterColumn>
            <ColumnTitle>Newsletter</ColumnTitle>
            <FooterDescription>
              Subscribe to get special offers, updates and honey tips.
            </FooterDescription>
            <NewsletterForm onSubmit={handleSubscribe}>
              <NewsletterInput
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" variant="primary" size="sm">
                Subscribe
              </Button>
            </NewsletterForm>
            {isSubscribed && (
              <SuccessMessage>
                ✓ Thanks for subscribing!
              </SuccessMessage>
            )}
          </FooterColumn>
        </FooterGrid>

        <FooterDivider />

        <FooterBottom>
          <Copyright>
            © 2024 Royal Honey. All rights reserved.
          </Copyright>
          <LegalLinks>
            <LegalLink href="/privacy">Privacy Policy</LegalLink>
            <LegalLink href="/terms">Terms of Service</LegalLink>
            <LegalLink href="/cookies">Cookie Policy</LegalLink>
          </LegalLinks>
        </FooterBottom>
      </FooterContent>
    </FooterWrapper>
  );
});