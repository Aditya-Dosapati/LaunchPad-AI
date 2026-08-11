/**
 * LaunchPad AI — Prisma Seed Script
 * ──────────────────────────────────
 * Run:  npx prisma db seed          (recommended)
 *       npm run db:seed              (alias)
 *
 * Creates realistic demo data that mirrors the existing frontend mock data.
 * Uses upsert patterns on unique fields so it is safe to re-run.
 */

import {
  PrismaClient,
  UserRole,
  UserStatus,
  Department,
  DocumentCategory,
  DocumentStatus,
  NotificationType,
  ChatMessageSender,
  KTSessionStatus,
  FeedbackSentiment,
  FeedbackType,
  AuditAction,
  DocCompletionStatus,
} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** Hash once, reuse for every demo user */
async function demoHash(): Promise<string> {
  return bcrypt.hash('LaunchPad@2026', 12);
}

/** Offset a date by N days from a base */
function daysAgo(days: number, from = new Date()): Date {
  const d = new Date(from);
  d.setDate(d.getDate() - days);
  return d;
}

/** Future date — offset by N days */
function daysFromNow(days: number): Date {
  return daysAgo(-days);
}

// ─────────────────────────────────────────────
// Main seed function
// ─────────────────────────────────────────────

async function main() {
  console.log('🌱 Starting seed…\n');
  const passwordHash = await demoHash();

  // ═══════════════════════════════════════════
  // 1. USERS
  // ═══════════════════════════════════════════

  const elena = await prisma.user.upsert({
    where: { email: 'elena.r@company.io' },
    update: {},
    create: {
      email: 'elena.r@company.io',
      name: 'Elena Rostova',
      passwordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      department: Department.PRODUCT,
      jobTitle: 'VP of Platform Intelligence',
      bio: 'Building the future of enterprise knowledge management with AI-powered platforms.',
      phone: '+1 (555) 901-2345',
      location: 'San Francisco, CA',
      employeeId: 'EMP-00101',
      mfaEnabled: true,
      skills: ['SaaS Architecture', 'GraphDB', 'Product Strategy', 'OpenAI API'],
      joinedAt: new Date('2022-04-10'),
    },
  });

  const sarah = await prisma.user.upsert({
    where: { email: 'sarah.c@company.io' },
    update: {},
    create: {
      email: 'sarah.c@company.io',
      name: 'Sarah Connor',
      passwordHash,
      role: UserRole.MANAGER,
      status: UserStatus.ACTIVE,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      department: Department.ENGINEERING,
      jobTitle: 'Lead DevOps Architect',
      bio: 'Infrastructure, Kubernetes, and CI/CD pipelines at scale.',
      phone: '+1 (555) 312-7890',
      location: 'Austin, TX',
      employeeId: 'EMP-00312',
      mfaEnabled: true,
      skills: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Docker', 'Python'],
      joinedAt: new Date('2024-03-12'),
    },
  });

  const emma = await prisma.user.upsert({
    where: { email: 'emma.w@company.io' },
    update: {},
    create: {
      email: 'emma.w@company.io',
      name: 'Emma Watson',
      passwordHash,
      role: UserRole.HR,
      status: UserStatus.ACTIVE,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      department: Department.HR,
      jobTitle: 'Talent Success Partner',
      bio: 'Passionate about building inclusive onboarding experiences.',
      phone: '+1 (555) 204-5678',
      location: 'New York, NY',
      employeeId: 'EMP-00204',
      mfaEnabled: true,
      skills: ['Onboarding', 'Talent Dev', 'Conflict Resolution', 'Notion'],
      joinedAt: new Date('2023-09-01'),
    },
  });

  const david = await prisma.user.upsert({
    where: { email: 'david.c@company.io' },
    update: {},
    create: {
      email: 'david.c@company.io',
      name: 'David Chen',
      passwordHash,
      role: UserRole.EMPLOYEE,
      status: UserStatus.ACTIVE,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      department: Department.ENGINEERING,
      jobTitle: 'Senior Frontend Engineer',
      bio: 'React, Next.js, and design-systems enthusiast.',
      phone: '+1 (555) 482-3456',
      location: 'Seattle, WA',
      employeeId: 'EMP-00482',
      mfaEnabled: true,
      skills: ['React', 'Next.js', 'TailwindCSS', 'TypeScript', 'Redux', 'Jest'],
      joinedAt: new Date('2025-01-18'),
    },
  });

  const alex = await prisma.user.upsert({
    where: { email: 'alex.m@company.io' },
    update: {},
    create: {
      email: 'alex.m@company.io',
      name: 'Alex Mercer',
      passwordHash,
      role: UserRole.EMPLOYEE,
      status: UserStatus.ONBOARDING,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      department: Department.ENGINEERING,
      jobTitle: 'Junior Backend Developer',
      bio: 'Eager learner focused on Node.js, Docker, and PostgreSQL.',
      phone: '+1 (555) 501-6789',
      location: 'Denver, CO',
      employeeId: 'EMP-00501',
      mfaEnabled: false,
      skills: ['Node.js', 'Express', 'PostgreSQL', 'Git', 'Docker'],
      joinedAt: new Date('2026-07-15'),
    },
  });

  const users = { elena, sarah, emma, david, alex };
  console.log('  ✅ Users seeded (5 users)');

  // ═══════════════════════════════════════════
  // 2. DOCUMENTS (Knowledge Base)
  // ═══════════════════════════════════════════

  const docData = [
    {
      title: 'Kubernetes Cluster Deployment Guide',
      category: DocumentCategory.DEPLOYMENT,
      content:
        'This SOP outlines the steps to deploy a highly available Kubernetes cluster in AWS EKS. ' +
        'It covers VPC peering, subnets config, worker groups configuration in Terraform, and ' +
        'setup of CoreDNS, kube-proxy, and AWS VPC CNI. Always verify kubectl versions before starting.',
      version: 'v2.1',
      status: DocumentStatus.APPROVED,
      isBookmarked: true,
      isFavorite: true,
      authorId: sarah.id,
    },
    {
      title: 'Frontend Coding Standards & ESLint Config',
      category: DocumentCategory.CODING_STANDARDS,
      content:
        'We use Next.js, Tailwind CSS, and TypeScript for all web applications. Prettier rules ' +
        'are enforced on commit. Class naming follows utility-first conventions with logical group ' +
        'order. Avoid custom utility classes unless absolutely required by design.',
      version: 'v1.4',
      status: DocumentStatus.APPROVED,
      isBookmarked: false,
      isFavorite: true,
      authorId: david.id,
    },
    {
      title: 'Knowledge Graph Integration Architecture',
      category: DocumentCategory.ARCHITECTURE,
      content:
        'System architecture map detailing the integration of Neo4j vector database with our AI RAG ' +
        'pipeline. It includes node descriptions for Employees, Skills, Projects, and Documents, ' +
        'outlining how queries traverse document nodes to compute documentation health.',
      version: 'v0.9-draft',
      status: DocumentStatus.PENDING_REVIEW,
      isBookmarked: false,
      isFavorite: false,
      authorId: alex.id,
    },
    {
      title: 'API Authentication Flow & JWT Rotation',
      category: DocumentCategory.API_DOCS,
      content:
        'Endpoints details for JWT authentication. Contains detailed descriptions of /api/auth/login, ' +
        '/api/auth/refresh, and security protocols like httpOnly cookies, CORS origins list, and ' +
        'token expiration handling.',
      version: 'v3.0',
      status: DocumentStatus.APPROVED,
      isBookmarked: false,
      isFavorite: false,
      authorId: elena.id,
    },
    {
      title: 'Employee Onboarding & Access Provisioning SOP',
      category: DocumentCategory.SOP,
      content:
        'Steps to provision developer machines, GitHub organization permissions, Slack channel ' +
        'subscriptions, Jira board access, and 1Password vault memberships.',
      version: 'v2.0',
      status: DocumentStatus.APPROVED,
      isBookmarked: false,
      isFavorite: false,
      authorId: emma.id,
    },
    {
      title: 'AI Assistant Token Usage & Rate Limits FAQ',
      category: DocumentCategory.FAQ,
      content:
        'Frequently Asked Questions about AI chat quota, context window limits, prompt guidelines, ' +
        'and instructions on how to request a token limit increase.',
      version: 'v1.0',
      status: DocumentStatus.APPROVED,
      isBookmarked: true,
      isFavorite: false,
      authorId: elena.id,
    },
  ];

  // Use title as a deterministic key — delete-then-create avoids UUID mismatch
  for (const doc of docData) {
    const existing = await prisma.document.findFirst({ where: { title: doc.title } });
    if (!existing) {
      await prisma.document.create({ data: doc });
    }
  }

  console.log('  ✅ Documents seeded (6 docs)');

  // ═══════════════════════════════════════════
  // 3. NOTIFICATIONS
  // ═══════════════════════════════════════════

  const notifData = [
    {
      userId: david.id,
      type: NotificationType.QUESTION,
      title: 'Question Answered',
      message:
        'Your question "How to deploy worker groups with Terraform?" has been answered by Sarah Connor.',
      isRead: false,
      createdAt: daysAgo(0),
    },
    {
      userId: david.id,
      type: NotificationType.DOCUMENT,
      title: 'Document Updated',
      message: 'David Chen updated "Frontend Coding Standards" to v1.4.',
      isRead: false,
      createdAt: daysAgo(0),
    },
    {
      userId: alex.id,
      type: NotificationType.REMINDER,
      title: 'Learning Reminder',
      message: 'Your upcoming quiz "Advanced Kubernetes Concepts" is due in 2 days.',
      isRead: true,
      createdAt: daysAgo(1),
    },
    {
      userId: emma.id,
      type: NotificationType.ANNOUNCEMENT,
      title: 'HR Announcement',
      message: 'Quarterly Knowledge Hackathon kicks off on August 15th! Sign up now.',
      isRead: false,
      createdAt: daysAgo(3),
    },
    {
      userId: david.id,
      type: NotificationType.FEEDBACK,
      title: 'Mentor Feedback',
      message: 'VP Elena Rostova left review comments on your draft architecture map.',
      isRead: true,
      createdAt: daysAgo(4),
    },
    {
      userId: sarah.id,
      type: NotificationType.DOCUMENT,
      title: 'SOP Pending Approval',
      message: 'Alex Mercer submitted "Knowledge Graph Integration Architecture" for review.',
      isRead: false,
      createdAt: daysAgo(2),
    },
    {
      userId: elena.id,
      type: NotificationType.ANNOUNCEMENT,
      title: 'System Reindex Complete',
      message: 'Vector re-indexing finished: 1,240 documents processed with text-embedding-3-large.',
      isRead: true,
      createdAt: daysAgo(1),
    },
  ];

  // Guard: only insert if the user has no notifications yet
  for (const n of notifData) {
    const count = await prisma.notification.count({ where: { userId: n.userId, title: n.title } });
    if (count === 0) {
      await prisma.notification.create({ data: n });
    }
  }

  console.log('  ✅ Notifications seeded (7 notifications)');

  // ═══════════════════════════════════════════
  // 4. CHAT SESSIONS & MESSAGES
  // ═══════════════════════════════════════════

  // Session 1: David — Kubernetes VPC peering
  let chat1 = await prisma.chatSession.findFirst({
    where: { userId: david.id, title: 'Kubernetes VPC peering setup' },
  });
  if (!chat1) {
    chat1 = await prisma.chatSession.create({
      data: {
        title: 'Kubernetes VPC peering setup',
        userId: david.id,
      },
    });

    await prisma.chatMessage.createMany({
      data: [
        {
          sessionId: chat1.id,
          sender: ChatMessageSender.USER,
          text: 'How do I set up VPC peering in our AWS EKS cluster deployment?',
          createdAt: new Date('2026-08-05T11:30:00Z'),
        },
        {
          sessionId: chat1.id,
          sender: ChatMessageSender.AI,
          text:
            'To peer VPCs in our environment, refer to the "Kubernetes Cluster Deployment Guide". ' +
            'You need to define a `aws_vpc_peering_connection` resource in Terraform and add routes ' +
            'targeting the peer subnet in your route tables.',
          codeSnippet: [
            'resource "aws_vpc_peering_connection" "k8s_peer" {',
            '  peer_owner_id = var.peer_owner_id',
            '  peer_vpc_id   = var.peer_vpc_id',
            '  vpc_id        = aws_vpc.k8s_vpc.id',
            '  auto_accept   = true',
            '',
            '  tags = {',
            '    Name = "k8s-vpc-peering"',
            '  }',
            '}',
          ].join('\n'),
          language: 'hcl',
          sources: ['Kubernetes Cluster Deployment Guide (v2.1)', 'Infrastructure VPC Config SOP'],
          confidence: 96,
          createdAt: new Date('2026-08-05T11:31:00Z'),
        },
      ],
    });
  }

  // Session 2: David — Tailwind border config
  let chat2 = await prisma.chatSession.findFirst({
    where: { userId: david.id, title: 'Tailwind custom borders config' },
  });
  if (!chat2) {
    chat2 = await prisma.chatSession.create({
      data: {
        title: 'Tailwind custom borders config',
        userId: david.id,
      },
    });

    await prisma.chatMessage.createMany({
      data: [
        {
          sessionId: chat2.id,
          sender: ChatMessageSender.USER,
          text: 'What is the standard border class for subtle glassmorphism in our dark mode theme?',
          createdAt: new Date('2026-08-03T15:15:00Z'),
        },
        {
          sessionId: chat2.id,
          sender: ChatMessageSender.AI,
          text:
            'Per our "Frontend Coding Standards", subtle glassmorphic borders are styled using ' +
            '`border border-white/10` with `backdrop-blur-md` in dark mode, and `border border-black/5` ' +
            'with `backdrop-blur-md` in light mode.',
          codeSnippet: [
            '<div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl p-6">',
            '  <h3 className="text-white font-medium">Sleek Card</h3>',
            '</div>',
          ].join('\n'),
          language: 'jsx',
          sources: ['Frontend Coding Standards & ESLint Config (v1.4)'],
          confidence: 98,
          createdAt: new Date('2026-08-03T15:16:00Z'),
        },
      ],
    });
  }

  // Session 3: Alex — onboarding question
  let chat3 = await prisma.chatSession.findFirst({
    where: { userId: alex.id, title: 'Onboarding access provisioning' },
  });
  if (!chat3) {
    chat3 = await prisma.chatSession.create({
      data: {
        title: 'Onboarding access provisioning',
        userId: alex.id,
      },
    });

    await prisma.chatMessage.createMany({
      data: [
        {
          sessionId: chat3.id,
          sender: ChatMessageSender.USER,
          text: 'What tools do I need access to on my first day?',
          createdAt: new Date('2026-07-16T09:00:00Z'),
        },
        {
          sessionId: chat3.id,
          sender: ChatMessageSender.AI,
          text:
            'According to the "Employee Onboarding & Access Provisioning SOP", you will need: ' +
            'GitHub org access, Slack workspace invitation, Jira board membership, 1Password vault, ' +
            'and your development machine provisioned with the standard engineering toolchain.',
          sources: ['Employee Onboarding & Access Provisioning SOP (v2.0)'],
          confidence: 94,
          createdAt: new Date('2026-07-16T09:01:00Z'),
        },
      ],
    });
  }

  console.log('  ✅ Chat sessions seeded (3 sessions, 6 messages)');

  // ═══════════════════════════════════════════
  // 5. KT SESSIONS & ATTENDANCE
  // ═══════════════════════════════════════════

  // Helper: find-or-create KT session by title + host
  async function upsertKT(data: {
    title: string;
    hostId: string;
    status: KTSessionStatus;
    scheduledAt: Date;
    rating?: number;
  }) {
    let session = await prisma.kTSession.findFirst({
      where: { title: data.title, hostId: data.hostId },
    });
    if (!session) {
      session = await prisma.kTSession.create({ data });
    }
    return session;
  }

  const kt1 = await upsertKT({
    title: 'AWS EKS Cluster Peering Workshop',
    hostId: sarah.id,
    status: KTSessionStatus.UPCOMING,
    scheduledAt: daysFromNow(1),
  });

  const kt2 = await upsertKT({
    title: 'Frontend Design System & Glassmorphism SOP',
    hostId: david.id,
    status: KTSessionStatus.UPCOMING,
    scheduledAt: daysFromNow(2),
  });

  const kt3 = await upsertKT({
    title: 'OAuth2 Authentication Routing Flow',
    hostId: elena.id,
    status: KTSessionStatus.COMPLETED,
    scheduledAt: daysAgo(10),
    rating: 4.9,
  });

  const kt4 = await upsertKT({
    title: 'Neo4j Cypher Traversal & Indexing',
    hostId: alex.id,
    status: KTSessionStatus.COMPLETED,
    scheduledAt: daysAgo(14),
    rating: 4.8,
  });

  // Attendance records (compound unique: sessionId + userId)
  const attendanceData: { sessionId: string; userId: string; attended: boolean }[] = [
    { sessionId: kt1.id, userId: alex.id, attended: false },
    { sessionId: kt1.id, userId: david.id, attended: false },
    { sessionId: kt1.id, userId: emma.id, attended: false },
    { sessionId: kt1.id, userId: elena.id, attended: false },
    { sessionId: kt2.id, userId: alex.id, attended: false },
    { sessionId: kt2.id, userId: sarah.id, attended: false },
    { sessionId: kt2.id, userId: emma.id, attended: false },
    { sessionId: kt3.id, userId: david.id, attended: true },
    { sessionId: kt3.id, userId: sarah.id, attended: true },
    { sessionId: kt3.id, userId: alex.id, attended: true },
    { sessionId: kt4.id, userId: david.id, attended: true },
    { sessionId: kt4.id, userId: elena.id, attended: true },
  ];

  for (const att of attendanceData) {
    await prisma.kTAttendance.upsert({
      where: { sessionId_userId: { sessionId: att.sessionId, userId: att.userId } },
      update: {},
      create: att,
    });
  }

  console.log('  ✅ KT sessions seeded (4 sessions, 12 attendance records)');

  // ═══════════════════════════════════════════
  // 6. MENTOR PAIRINGS
  // ═══════════════════════════════════════════

  await prisma.mentorPairing.upsert({
    where: { mentorId_menteeId: { mentorId: sarah.id, menteeId: alex.id } },
    update: {},
    create: {
      mentorId: sarah.id,
      menteeId: alex.id,
      isActive: true,
    },
  });

  await prisma.mentorPairing.upsert({
    where: { mentorId_menteeId: { mentorId: elena.id, menteeId: david.id } },
    update: {},
    create: {
      mentorId: elena.id,
      menteeId: david.id,
      isActive: true,
    },
  });

  console.log('  ✅ Mentor pairings seeded (2 pairings)');

  // ═══════════════════════════════════════════
  // 7. PROJECTS & MEMBERS
  // ═══════════════════════════════════════════

  async function upsertProject(data: {
    name: string;
    description: string;
    progress: number;
    health: number;
    leadId: string;
    techStack: string[];
    docArchitecture: DocCompletionStatus;
    docSop: DocCompletionStatus;
    docApi: DocCompletionStatus;
    memberIds: string[];
  }) {
    const { memberIds, ...projectData } = data;
    let project = await prisma.project.findFirst({ where: { name: data.name } });
    if (!project) {
      project = await prisma.project.create({ data: projectData });
    }
    // Add members
    for (const userId of memberIds) {
      await prisma.projectMember.upsert({
        where: { projectId_userId: { projectId: project.id, userId } },
        update: {},
        create: { projectId: project.id, userId },
      });
    }
    return project;
  }

  await upsertProject({
    name: 'Knowledge RAG Pipeline v2',
    description:
      'Upgrading vector indexing engine to support real-time PDF parsing and hybrid graph queries.',
    progress: 75,
    health: 88,
    leadId: sarah.id,
    techStack: ['Neo4j', 'Pinecone', 'LangChain', 'Python', 'FastAPI'],
    docArchitecture: DocCompletionStatus.COMPLETE,
    docSop: DocCompletionStatus.COMPLETE,
    docApi: DocCompletionStatus.DRAFT,
    memberIds: [sarah.id, alex.id, david.id, elena.id],
  });

  await upsertProject({
    name: 'Enterprise Admin Center',
    description:
      'Building custom enterprise dashboard with multi-role access control, usage metrics and logs auditing.',
    progress: 42,
    health: 64,
    leadId: david.id,
    techStack: ['Next.js', 'Tailwind CSS', 'Radix UI', 'TypeScript'],
    docArchitecture: DocCompletionStatus.DRAFT,
    docSop: DocCompletionStatus.MISSING,
    docApi: DocCompletionStatus.DRAFT,
    memberIds: [david.id, alex.id, emma.id],
  });

  await upsertProject({
    name: 'Telemetry & Monitoring Integration',
    description:
      'Setting up OpenTelemetry collectors and PromQL/Grafana dashboards across microservices.',
    progress: 95,
    health: 98,
    leadId: sarah.id,
    techStack: ['Kubernetes', 'Prometheus', 'Grafana', 'Go'],
    docArchitecture: DocCompletionStatus.COMPLETE,
    docSop: DocCompletionStatus.COMPLETE,
    docApi: DocCompletionStatus.COMPLETE,
    memberIds: [sarah.id, elena.id],
  });

  console.log('  ✅ Projects seeded (3 projects, 9 memberships)');

  // ═══════════════════════════════════════════
  // 8. ONBOARDING TRACKS
  // ═══════════════════════════════════════════

  await prisma.onboardingTrack.upsert({
    where: { userId: alex.id },
    update: {},
    create: {
      userId: alex.id,
      progress: 45,
      trainingCompletion: 50,
      readinessScore: 64,
      pendingKT: 'AWS EKS Cluster Peering Workshop',
      pendingDoc: 'OAuth Security Keys SOP',
      assignedMentorName: 'Sarah Connor',
    },
  });

  await prisma.onboardingTrack.upsert({
    where: { userId: david.id },
    update: {},
    create: {
      userId: david.id,
      progress: 100,
      trainingCompletion: 100,
      readinessScore: 92,
      pendingKT: 'None (Completed)',
      pendingDoc: 'None (All Approved)',
      assignedMentorName: 'Sarah Connor',
      completedAt: new Date('2025-03-01'),
    },
  });

  await prisma.onboardingTrack.upsert({
    where: { userId: emma.id },
    update: {},
    create: {
      userId: emma.id,
      progress: 100,
      trainingCompletion: 90,
      readinessScore: 89,
      pendingKT: 'None (Completed)',
      pendingDoc: 'None (All Approved)',
      assignedMentorName: 'Elena Rostova',
      completedAt: new Date('2023-11-15'),
    },
  });

  console.log('  ✅ Onboarding tracks seeded (3 tracks)');

  // ═══════════════════════════════════════════
  // 9. FEEDBACK ENTRIES
  // ═══════════════════════════════════════════

  const feedbackData = [
    {
      text: 'The mentor pairing with Sarah Connor made onboarding 10x smoother!',
      authorId: david.id,
      type: FeedbackType.PUBLIC,
      sentiment: FeedbackSentiment.POSITIVE,
    },
    {
      text: 'VPC peering setup guide needs clearer diagram steps.',
      authorId: null as string | null,
      type: FeedbackType.ANONYMOUS,
      sentiment: FeedbackSentiment.NEUTRAL,
    },
    {
      text: 'Suggestion: Add a weekly virtual coffee chat for new joiners.',
      authorId: alex.id,
      type: FeedbackType.SUGGESTION,
      sentiment: FeedbackSentiment.POSITIVE,
    },
    {
      text: 'The AI Copilot search is incredibly fast — saved me hours of digging through Confluence.',
      authorId: alex.id,
      type: FeedbackType.PUBLIC,
      sentiment: FeedbackSentiment.POSITIVE,
    },
    {
      text: 'MacBook setup script had a permissions error on Day 1, needed manual fix.',
      authorId: null as string | null,
      type: FeedbackType.ANONYMOUS,
      sentiment: FeedbackSentiment.NEGATIVE,
    },
  ];

  // Guard: only insert if text doesn't already exist
  for (const fb of feedbackData) {
    const exists = await prisma.feedbackEntry.findFirst({ where: { text: fb.text } });
    if (!exists) {
      await prisma.feedbackEntry.create({
        data: {
          text: fb.text,
          authorId: fb.authorId,
          type: fb.type,
          sentiment: fb.sentiment,
        },
      });
    }
  }

  console.log('  ✅ Feedback entries seeded (5 entries)');

  // ═══════════════════════════════════════════
  // 10. AUDIT LOGS
  // ═══════════════════════════════════════════

  const auditData = [
    {
      userId: elena.id,
      action: AuditAction.REINDEX,
      entity: 'VectorIndex',
      details: 'Re-indexed Pinecone Vector Index — 1,240 documents processed',
      ipAddress: '192.168.1.104',
      createdAt: daysAgo(1),
    },
    {
      userId: elena.id,
      action: AuditAction.LOGIN,
      entity: 'Session',
      details: 'Authenticated via SSO (Google Workspace)',
      ipAddress: '192.168.1.104',
      createdAt: daysAgo(0),
    },
    {
      userId: sarah.id,
      action: AuditAction.APPROVE,
      entity: 'Document',
      details: 'Approved SOP "Kubernetes Cluster Deployment Guide" v2.1',
      ipAddress: '192.168.1.88',
      createdAt: daysAgo(2),
    },
    {
      userId: emma.id,
      action: AuditAction.EXPORT,
      entity: 'Report',
      details: 'Exported Weekly Talent Readiness Report (PDF)',
      ipAddress: '192.168.1.92',
      createdAt: daysAgo(3),
    },
    {
      userId: david.id,
      action: AuditAction.QUERY,
      entity: 'ChatSession',
      details: 'Queried Copilot: "OAuth2 authentication flow & JWT rotation"',
      ipAddress: '192.168.1.105',
      createdAt: daysAgo(1),
    },
    {
      userId: david.id,
      action: AuditAction.CREATE,
      entity: 'Document',
      details: 'Created "Frontend Coding Standards & ESLint Config" v1.4',
      ipAddress: '192.168.1.105',
      createdAt: daysAgo(5),
    },
    {
      userId: alex.id,
      action: AuditAction.LOGIN,
      entity: 'Session',
      details: 'First login — onboarding user provisioned',
      ipAddress: '172.16.0.42',
      createdAt: daysAgo(25),
    },
    {
      userId: sarah.id,
      action: AuditAction.UPDATE,
      entity: 'Project',
      details: 'Updated "Knowledge RAG Pipeline v2" progress to 75%',
      ipAddress: '192.168.1.88',
      createdAt: daysAgo(1),
    },
  ];

  // Guard: check by userId + action + details combo
  for (const log of auditData) {
    const exists = await prisma.auditLog.findFirst({
      where: { userId: log.userId, action: log.action, details: log.details },
    });
    if (!exists) {
      await prisma.auditLog.create({ data: log });
    }
  }

  console.log('  ✅ Audit logs seeded (8 entries)');

  // ═══════════════════════════════════════════
  // DONE
  // ═══════════════════════════════════════════
  console.log('\n🎉 Seed complete! All demo data inserted.');
  console.log('   Run `npm run db:studio` to browse the data.\n');
}

// ─────────────────────────────────────────────
// Execute
// ─────────────────────────────────────────────
main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
