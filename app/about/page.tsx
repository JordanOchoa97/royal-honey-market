// app/about/page.tsx
'use client';

import styled from 'styled-components';
import { Button } from '@/src/presentation/components/ui/Button';
import Link from 'next/link';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const Hero = styled.section`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  color: #f59e0b;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: #6b7280;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const Content = styled.section`
  display: grid;
  gap: 4rem;
`;

const Section = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  &:nth-child(even) {
    direction: rtl;
    & > * {
      direction: ltr;
    }
  }
`;

const ImagePlaceholder = styled.div`
  aspect-ratio: 4 / 3;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 4rem;
`;

const TextContent = styled.div``;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const SectionText = styled.p`
  font-size: 1.125rem;
  color: #4b5563;
  line-height: 1.8;
  margin-bottom: 1rem;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin: 4rem 0;
  padding: 3rem;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Stat = styled.div`
  text-align: center;
  color: white;
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const StatLabel = styled.div`
  font-size: 1rem;
  opacity: 0.9;
`;

const Values = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 4rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ValueCard = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-8px);
  }
`;

const ValueIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ValueTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.75rem;
`;

const ValueText = styled.p`
  color: #6b7280;
  line-height: 1.6;
`;

const CTA = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%);
  border-radius: 1.5rem;
  margin-top: 4rem;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CTAText = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
  margin-bottom: 2rem;
`;

export default function AboutPage() {
  return (
    <Container>
      <Hero>
        <Title>About Royal Honey</Title>
        <Subtitle>
          Bringing you the finest organic honey from nature&apos;s most pristine locations since 2010
        </Subtitle>
      </Hero>

      <Content>
        <Section>
          <ImagePlaceholder>🍯</ImagePlaceholder>
          <TextContent>
            <SectionTitle>Our Story</SectionTitle>
            <SectionText>
              Founded in 2010, Royal Honey began with a simple mission: to share the pure, 
              unadulterated goodness of honey with the world. Our journey started in the 
              remote mountains of New Zealand, where we discovered the incredible healing 
              properties of Manuka honey.
            </SectionText>
            <SectionText>
              Today, we work with sustainable beekeepers across the globe, ensuring every 
              jar of honey meets our strict quality standards while supporting local 
              communities and protecting bee populations.
            </SectionText>
          </TextContent>
        </Section>

        <Section>
          <ImagePlaceholder>🐝</ImagePlaceholder>
          <TextContent>
            <SectionTitle>Sustainable Beekeeping</SectionTitle>
            <SectionText>
              We believe in ethical and sustainable beekeeping practices. Our partner 
              apiaries prioritize bee health and environmental conservation, never 
              compromising quality for quantity.
            </SectionText>
            <SectionText>
              Every purchase supports our bee conservation program, helping to protect 
              and restore natural habitats for wild pollinators worldwide.
            </SectionText>
          </TextContent>
        </Section>

        <Section>
          <ImagePlaceholder>🌿</ImagePlaceholder>
          <TextContent>
            <SectionTitle>Quality Commitment</SectionTitle>
            <SectionText>
              Each batch of honey undergoes rigorous testing to ensure purity, potency, 
              and quality. We test for antibiotics, pesticides, and authenticity, 
              guaranteeing you receive only the finest honey.
            </SectionText>
            <SectionText>
              Our products are certified organic, non-GMO, and sustainably sourced, 
              meeting the highest international standards.
            </SectionText>
          </TextContent>
        </Section>
      </Content>

      <Stats>
        <Stat>
          <StatNumber>15+</StatNumber>
          <StatLabel>Years Experience</StatLabel>
        </Stat>
        <Stat>
          <StatNumber>50K+</StatNumber>
          <StatLabel>Happy Customers</StatLabel>
        </Stat>
        <Stat>
          <StatNumber>100%</StatNumber>
          <StatLabel>Organic</StatLabel>
        </Stat>
        <Stat>
          <StatNumber>25+</StatNumber>
          <StatLabel>Countries</StatLabel>
        </Stat>
      </Stats>

      <Values>
        <ValueCard>
          <ValueIcon>🌍</ValueIcon>
          <ValueTitle>Sustainability</ValueTitle>
          <ValueText>
            We&apos;re committed to environmental stewardship and supporting 
            sustainable beekeeping practices worldwide.
          </ValueText>
        </ValueCard>

        <ValueCard>
          <ValueIcon>💎</ValueIcon>
          <ValueTitle>Quality</ValueTitle>
          <ValueText>
            Every product is tested and certified to ensure the highest 
            standards of purity and potency.
          </ValueText>
        </ValueCard>

        <ValueCard>
          <ValueIcon>❤️</ValueIcon>
          <ValueTitle>Community</ValueTitle>
          <ValueText>
            We support local beekeepers and communities, creating positive 
            impact through fair trade practices.
          </ValueText>
        </ValueCard>
      </Values>

      <CTA>
        <CTATitle>Ready to Experience Pure Honey?</CTATitle>
        <CTAText>
          Discover our collection of premium organic honey products
        </CTAText>
        <Link href="/products">
          <Button size="lg">Shop Now</Button>
        </Link>
      </CTA>
    </Container>
  );
}