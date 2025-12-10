// app/contact/page.tsx
'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { Button } from '@/src/presentation/components/ui/Button';

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

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const InfoCard = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 1.5rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const InfoIcon = styled.div`
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const InfoText = styled.p`
  color: #6b7280;
  line-height: 1.6;
`;

const InfoLink = styled.a`
  color: #f59e0b;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;

  &:hover {
    color: #d97706;
  }
`;

const FormSection = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

  @media (max-width: 640px) {
    padding: 2rem 1.5rem;
  }
`;

const FormTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.9375rem;
`;

const Input = styled.input`
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const TextArea = styled.textarea`
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  transition: all 0.2s ease;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SuccessMessage = styled.div`
  padding: 1rem;
  background: rgba(16, 185, 129, 0.1);
  border: 2px solid #10b981;
  border-radius: 8px;
  color: #059669;
  font-weight: 600;
  text-align: center;
`;

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica real de envío
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container>
      <Hero>
        <Title>Get In Touch</Title>
        <Subtitle>
          Have a question? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
        </Subtitle>
      </Hero>

      <Content>
        <ContactInfo>
          <InfoCard>
            <InfoIcon>📍</InfoIcon>
            <InfoContent>
              <InfoTitle>Visit Us</InfoTitle>
              <InfoText>
                123 Honey Lane<br />
                San Francisco, CA 94102<br />
                United States
              </InfoText>
            </InfoContent>
          </InfoCard>

          <InfoCard>
            <InfoIcon>📧</InfoIcon>
            <InfoContent>
              <InfoTitle>Email Us</InfoTitle>
              <InfoText>
                General inquiries:<br />
                <InfoLink href="mailto:hello@royalhoney.com">hello@royalhoney.com</InfoLink>
              </InfoText>
              <InfoText>
                Support:<br />
                <InfoLink href="mailto:support@royalhoney.com">support@royalhoney.com</InfoLink>
              </InfoText>
            </InfoContent>
          </InfoCard>

          <InfoCard>
            <InfoIcon>📞</InfoIcon>
            <InfoContent>
              <InfoTitle>Call Us</InfoTitle>
              <InfoText>
                Customer Service:<br />
                <InfoLink href="tel:+14155551234">+1 (415) 555-1234</InfoLink>
              </InfoText>
              <InfoText>
                Monday - Friday: 9am - 6pm PST<br />
                Saturday: 10am - 4pm PST
              </InfoText>
            </InfoContent>
          </InfoCard>

          <InfoCard>
            <InfoIcon>⏰</InfoIcon>
            <InfoContent>
              <InfoTitle>Business Hours</InfoTitle>
              <InfoText>
                Monday - Friday: 9:00 AM - 6:00 PM<br />
                Saturday: 10:00 AM - 4:00 PM<br />
                Sunday: Closed
              </InfoText>
            </InfoContent>
          </InfoCard>
        </ContactInfo>

        <FormSection>
          <FormTitle>Send us a Message</FormTitle>
          {isSubmitted && (
            <SuccessMessage>
              ✓ Thank you! Your message has been sent successfully.
            </SuccessMessage>
          )}
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Your Name *</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">Your Email *</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="message">Message *</Label>
              <TextArea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more about your inquiry..."
                required
              />
            </FormGroup>

            <Button type="submit" size="lg" fullWidth>
              Send Message
            </Button>
          </Form>
        </FormSection>
      </Content>
    </Container>
  );
}