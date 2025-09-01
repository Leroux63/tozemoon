'use client';
import { Rocket, Layers, BadgeCheck, Wallet, ShieldCheck, Cpu,
         Code2, CircuitBoard, Globe, Server, TerminalSquare, Database, GitBranch, LucideIcon } from 'lucide-react';

export type Skill = { label: string; Icon: LucideIcon };

export const web3Skills: Skill[] = [
  { label: 'Solana / Anchor', Icon: Rocket },
  { label: 'Metaplex / Bubblegum (cNFT)', Icon: Layers },
  { label: 'Token-2022', Icon: BadgeCheck },
  { label: 'Wallet Adapter', Icon: Wallet },
  { label: 'PDA / CPI / Security', Icon: ShieldCheck },
  { label: 'Agent Kit', Icon: Cpu },
];

export const web2Skills: Skill[] = [
  { label: 'Java / Spring', Icon: Code2 },
  { label: 'Jakarta EE', Icon: CircuitBoard },
  { label: 'Angular', Icon: Globe },
  { label: 'PHP / Symfony', Icon: Server },
  { label: 'Node / Express', Icon: TerminalSquare },
  { label: 'Prisma / Supabase', Icon: Database },
  { label: 'CI/CD & Tests', Icon: GitBranch },
];
