'use client';
import { Container } from '@/components/Container';

export function Footer() {
  return (
    <footer className="border-t border-white/10">
      <Container className="py-10 text-center text-xs opacity-70">
        © {new Date().getFullYear()} ToZeMoon Labs — Design & Dev par ToZeMoon.
      </Container>
    </footer>
  );
}
