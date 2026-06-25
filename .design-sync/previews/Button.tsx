import { Button } from 'booksphere-client';

export const Variants = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', padding: '24px', background: '#0d0d0d' }}>
    <Button variant="primary">Upload Book</Button>
    <Button variant="secondary">Cancel</Button>
    <Button variant="ghost">View More</Button>
    <Button variant="danger">Delete</Button>
    <Button variant="outline">Explore</Button>
  </div>
);

export const Sizes = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', padding: '24px', background: '#0d0d0d' }}>
    <Button size="sm" variant="primary">Small</Button>
    <Button size="md" variant="primary">Medium</Button>
    <Button size="lg" variant="primary">Large</Button>
    <Button size="xl" variant="primary">Extra Large</Button>
  </div>
);

export const States = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', padding: '24px', background: '#0d0d0d' }}>
    <Button variant="primary" loading>Generating Story...</Button>
    <Button variant="primary" disabled>Disabled</Button>
    <Button variant="secondary" loading>Processing...</Button>
  </div>
);
