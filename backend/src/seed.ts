/**
 * Seed script — populates the aspire database with the permission catalogue,
 * system roles, demo team accounts, and realistic Team Aspire content.
 *
 * Run: pnpm db:seed   (set FORCE_SEED=true to re-seed a non-empty database)
 */
import { sequelize } from './config/sequelizeConfig';
import User from './app/models/user.model';
import Role from './app/models/role.model';
import Permission from './app/models/permission.model';
import RolePermission from './app/models/role.permission.model';
import UserRole from './app/models/user.role.model';
import Project from './app/models/project.model';
import ProjectUpdate from './app/models/project.update.model';
import Campaign from './app/models/campaign.model';
import Donation from './app/models/donation.model';
import Course from './app/models/course.model';
import CourseModule from './app/models/course.module.model';
import Lesson from './app/models/lesson.model';
import Cohort from './app/models/cohort.model';
import Enrollment from './app/models/enrollment.model';
import ClassSession from './app/models/class.session.model';
import Attendance from './app/models/attendance.model';
import TeachingAssignment from './app/models/teaching.assignment.model';
import Certificate from './app/models/certificate.model';
import Page from './app/models/page.model';
import Setting from './app/models/setting.model';
import EncryptionUtil from './app/utils/EncryptionUtil';
import {
    makeCertificateNumber,
    makeGatewayRef,
    makeReceiptNumber,
    makeVerificationCode,
} from './app/utils/Ids';
import { ensureContact, logInteraction } from './app/utils/CrmUtil';

require('dotenv').config();

const PERMISSIONS: Record<string, string> = {
    'users.read': 'View users and profiles',
    'users.create': 'Create users',
    'users.update': 'Update users',
    'users.delete': 'Deactivate users',
    'roles.manage': 'Manage roles and permission assignments',
    'donations.read': 'View donations',
    'donations.manage': 'Confirm / update donations',
    'donations.refund': 'Refund donations',
    'campaigns.manage': 'Create and edit campaigns',
    'projects.read': 'View projects (admin)',
    'projects.manage': 'Create and edit projects',
    'projects.publish': 'Publish / archive projects',
    'lms.courses.read': 'View courses (admin)',
    'lms.courses.manage': 'Create and edit courses',
    'lms.cohorts.manage': 'Manage cohorts and class sessions',
    'lms.enrollments.manage': 'Manage enrollments',
    'lms.attendance.read': 'View attendance',
    'lms.attendance.manage': 'Mark and edit attendance',
    'certificates.read': 'View certificates',
    'certificates.issue': 'Issue certificates',
    'certificates.revoke': 'Revoke certificates',
    'cms.manage': 'Manage pages and site content',
    'crm.read': 'View contacts and interactions',
    'crm.manage': 'Manage contacts and interactions',
    'dashboard.read': 'View operational dashboard',
    'audit.read': 'Read audit logs',
    'settings.manage': 'Manage platform settings',
};

const ALL = Object.keys(PERMISSIONS);

const ROLES: { key: string; name: string; description: string; permissions: string[] }[] = [
    { key: 'SUPER_ADMIN', name: 'Super Admin', description: 'Full control of the platform', permissions: ALL },
    { key: 'ADMIN', name: 'Admin', description: 'Operations admin (no role management)', permissions: ALL.filter((p) => p !== 'roles.manage') },
    {
        key: 'PROGRAM_MANAGER',
        name: 'Program Manager',
        description: 'Runs projects, courses and community programs',
        permissions: [
            'dashboard.read', 'users.read', 'projects.read', 'projects.manage', 'projects.publish',
            'lms.courses.read', 'lms.courses.manage', 'lms.cohorts.manage', 'lms.enrollments.manage',
            'lms.attendance.read', 'lms.attendance.manage', 'certificates.read', 'certificates.issue',
            'crm.read', 'crm.manage', 'cms.manage',
        ],
    },
    {
        key: 'FINANCE',
        name: 'Finance',
        description: 'Donations, receipts and campaigns',
        permissions: ['dashboard.read', 'donations.read', 'donations.manage', 'donations.refund', 'campaigns.manage', 'crm.read'],
    },
    {
        key: 'TEACHER',
        name: 'Teacher',
        description: 'Teaches assigned cohorts, marks attendance',
        permissions: ['dashboard.read', 'lms.courses.read', 'lms.attendance.read', 'lms.attendance.manage'],
    },
    { key: 'MEMBER', name: 'Member', description: 'Community member account', permissions: [] },
];

const daysFromNow = (days: number, hour = 11, minute = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(hour, minute, 0, 0);
    return d;
};

async function seed() {
    await sequelize.authenticate();
    await sequelize.sync({ alter: false });

    const userCount = await User.count();
    if (userCount > 0 && process.env.FORCE_SEED !== 'true') {
        console.log(`Database already has ${userCount} users — skipping seed (set FORCE_SEED=true to override)`);
        process.exit(0);
    }

    console.log('Seeding permissions & roles…');
    const permByKey = new Map<string, Permission>();
    for (const [key, description] of Object.entries(PERMISSIONS)) {
        const [perm] = await Permission.findOrCreate({ where: { key }, defaults: { key, description } as any });
        permByKey.set(key, perm);
    }

    const roleByKey = new Map<string, Role>();
    for (const roleDef of ROLES) {
        const [role] = await Role.findOrCreate({
            where: { key: roleDef.key },
            defaults: { key: roleDef.key, name: roleDef.name, description: roleDef.description, isSystem: true } as any,
        });
        roleByKey.set(roleDef.key, role);
        for (const permKey of roleDef.permissions) {
            await RolePermission.findOrCreate({
                where: { roleId: role.id, permissionId: permByKey.get(permKey)!.id },
                defaults: { roleId: role.id, permissionId: permByKey.get(permKey)!.id } as any,
            });
        }
    }

    console.log('Seeding team accounts…');
    const mkUser = async (fullName: string, email: string, password: string, roles: string[], phone?: string) => {
        const [user] = await User.findOrCreate({
            where: { email },
            defaults: { fullName, email, phone: phone ?? null, passwordHash: await EncryptionUtil.hashPassword(password) } as any,
        });
        for (const r of roles) {
            await UserRole.findOrCreate({
                where: { userId: user.id, roleId: roleByKey.get(r)!.id },
                defaults: { userId: user.id, roleId: roleByKey.get(r)!.id } as any,
            });
        }
        return user;
    };

    const admin = await mkUser('Aspire Admin', 'admin@teamaspire.org', 'Admin@123', ['SUPER_ADMIN'], '+91 81954 71511');
    const fatima = await mkUser('Fatima Khan', 'fatima@teamaspire.org', 'Admin@123', ['ADMIN']);
    const maryam = await mkUser('Maryam Siddiqui', 'maryam@teamaspire.org', 'Admin@123', ['PROGRAM_MANAGER']);
    const khadija = await mkUser('Khadija Ansari', 'khadija@teamaspire.org', 'Admin@123', ['FINANCE']);
    const aaliyah = await mkUser('Aaliyah Rahman', 'aaliyah@teamaspire.org', 'Teacher@123', ['TEACHER', 'MEMBER']);
    const sumaiya = await mkUser('Sumaiya Sheikh', 'sumaiya@teamaspire.org', 'Teacher@123', ['TEACHER', 'MEMBER']);

    const students: User[] = [];
    const studentSeed = [
        ['Zara Ahmed', 'zara@example.com'],
        ['Hiba Qureshi', 'hiba@example.com'],
        ['Amina Patel', 'amina@example.com'],
        ['Ruqayya Syed', 'ruqayya@example.com'],
        ['Safiya Momin', 'safiya@example.com'],
        ['Nusaybah Ali', 'nusaybah@example.com'],
        ['Yusra Baig', 'yusra@example.com'],
        ['Iqra Shaikh', 'iqra@example.com'],
    ] as const;
    for (const [name, email] of studentSeed) {
        students.push(await mkUser(name, email, 'Student@123', ['MEMBER']));
    }

    console.log('Seeding projects & campaigns…');
    const rehnuma = await Project.create({
        slug: 'project-rehnuma',
        title: 'Project Rehnuma',
        summary: 'A 3–4 month mentoring program to empower young underprivileged girls, conducted every Sunday.',
        description:
            'Project Rehnuma is Team Aspire\'s flagship mentorship initiative for young, underprivileged girls. Across a 3–4 month journey of weekly Sunday circles, mentees build life skills, deen-centred confidence, digital literacy and career awareness with dedicated mentors from the sisterhood.',
        category: 'education',
        status: 'active',
        location: 'Bengaluru, India',
        goalAmount: '500000',
        raisedAmount: '0',
        impactStats: [
            { label: 'Girls mentored', value: '120+' },
            { label: 'Mentors', value: '25' },
            { label: 'Cohorts completed', value: '6' },
        ],
        featured: true,
        startedAt: new Date('2023-06-01'),
        publishedAt: new Date('2023-06-01'),
    } as any);

    const touchlife = await Project.create({
        slug: 'project-touchlife',
        title: 'Project Touchlife',
        summary: 'Medical & humanitarian aid for families in crisis — from cancer care support to emergency relief.',
        description:
            'Project Touchlife extends a hand to families facing medical and humanitarian crises. From supporting a 3-year-old fighting cancer to emergency relief for households that lost their earning member, Touchlife channels the community\'s giving into verified, dignified support.',
        category: 'health',
        status: 'active',
        location: 'Pan India',
        goalAmount: '1500000',
        raisedAmount: '0',
        impactStats: [
            { label: 'Families supported', value: '85' },
            { label: 'Medical cases funded', value: '32' },
        ],
        featured: true,
        startedAt: new Date('2022-01-15'),
        publishedAt: new Date('2022-01-15'),
    } as any);

    const breakfastClub = await Project.create({
        slug: 'breakfast-club',
        title: "Team Aspire's Breakfast Club",
        summary: 'Warm, nutritious breakfasts served to daily-wage workers and children every weekend.',
        description:
            'The Breakfast Club began with a simple idea: no one in our neighbourhood should start their day hungry. Volunteers cook and serve fresh breakfasts every weekend to daily-wage workers, school children and the elderly.',
        category: 'food',
        status: 'active',
        location: 'Bengaluru, India',
        goalAmount: '200000',
        raisedAmount: '0',
        impactStats: [
            { label: 'Meals served', value: '9,400+' },
            { label: 'Weekends active', value: '110' },
        ],
        featured: false,
        startedAt: new Date('2024-02-01'),
        publishedAt: new Date('2024-02-01'),
    } as any);

    const cleanWater = await Project.create({
        slug: 'clean-water-initiative',
        title: 'Clean Water Initiative',
        summary: 'Commercial R.O. plants installed in underserved communities for safe drinking water.',
        description:
            'Access to clean drinking water changes everything — health, school attendance, family income. Team Aspire installs and maintains commercial R.O. purification plants in underserved localities and masjids, each serving hundreds of families daily.',
        category: 'water',
        status: 'active',
        location: 'Karnataka, India',
        goalAmount: '800000',
        raisedAmount: '0',
        impactStats: [
            { label: 'R.O. plants installed', value: '8' },
            { label: 'People served daily', value: '3,000+' },
        ],
        featured: true,
        startedAt: new Date('2023-11-01'),
        publishedAt: new Date('2023-11-01'),
    } as any);

    await ProjectUpdate.bulkCreate([
        { projectId: cleanWater.id, title: '8th R.O. plant goes live', body: 'Alhamdulillah — our 8th commercial R.O. plant is now serving 400+ families in KR Puram. JazakAllah khair to every donor.', createdBy: admin.id },
        { projectId: rehnuma.id, title: 'Batch 2026-A graduation', body: '27 girls completed the full 16-week Rehnuma journey. 21 earned certificates with 80%+ attendance.', createdBy: maryam.id },
        { projectId: breakfastClub.id, title: '110th weekend completed', body: '312 breakfasts served this Sunday near the railway station.', createdBy: fatima.id },
    ] as any[]);

    const restoringHope = await Campaign.create({
        slug: 'restoring-hope',
        title: 'Restoring Hope',
        description:
            'An initiative under Project Touchlife. A 3-year-old baby is diagnosed with cancer with high risk of neuro-blastoma. The little one has gone through a lot of difficulties and is in need of help. Let\'s come together to do our bit in saving her life.',
        projectId: touchlife.id,
        goalAmount: '600000',
        raisedAmount: '0',
        status: 'active',
        startsAt: new Date('2026-07-01'),
    } as any);

    console.log('Seeding LMS…');
    const seerah = await Course.create({
        slug: 'seerah-circle',
        title: 'Seerah Circle — Mercy to the Aalameen',
        summary: 'A weekly online journey through the life of the Prophet ﷺ, every Sunday on Zoom.',
        description:
            'Seerah Circle is a women-only weekly class walking through the blessed life of the Prophet Muhammad ﷺ — his character, his struggles, and the lessons his seerah holds for our lives today. Live on Zoom every Sunday, 11:00 AM – 12:30 PM.',
        category: 'deen',
        level: 'beginner',
        status: 'published',
        durationWeeks: 16,
        isOnline: true,
        meetingPlatform: 'Zoom',
        certificateEnabled: true,
        minAttendancePct: 75,
        createdBy: maryam.id,
        publishedAt: new Date('2026-06-20'),
    } as any);

    const arabic = await Course.create({
        slug: 'quranic-arabic-foundations',
        title: 'Quranic Arabic Foundations',
        summary: 'Understand the language of the Quran from absolute basics — grammar, vocabulary and tadabbur.',
        description:
            'A beginner-friendly course building Quranic Arabic from the ground up: essential grammar, high-frequency vocabulary, and guided reflection (tadabbur) so the Quran begins to speak to you directly.',
        category: 'deen',
        level: 'beginner',
        status: 'published',
        durationWeeks: 12,
        isOnline: true,
        meetingPlatform: 'Zoom',
        certificateEnabled: true,
        minAttendancePct: 80,
        createdBy: maryam.id,
        publishedAt: new Date('2026-05-10'),
    } as any);

    const webdev = await Course.create({
        slug: 'web-development-for-girls',
        title: 'Web Development for Girls (Rehnuma Skills Track)',
        summary: 'HTML, CSS, JavaScript and a portfolio project — a Rehnuma skills-track for young girls.',
        description:
            'Part of Project Rehnuma\'s skills track: a hands-on introduction to building for the web. Students finish with a personal portfolio site and the confidence to keep building.',
        category: 'skills',
        level: 'beginner',
        status: 'published',
        durationWeeks: 10,
        capacity: 30,
        isOnline: false,
        meetingPlatform: 'In-person — Community Centre',
        certificateEnabled: true,
        minAttendancePct: 80,
        createdBy: maryam.id,
        publishedAt: new Date('2026-06-01'),
    } as any);

    const seerahMod1 = await CourseModule.create({ courseId: seerah.id, title: 'Makkah Years', position: 1 } as any);
    const seerahMod2 = await CourseModule.create({ courseId: seerah.id, title: 'Madinah Years', position: 2 } as any);
    await Lesson.bulkCreate([
        { moduleId: seerahMod1.id, title: 'The World Before the Prophet ﷺ', position: 1, content: 'Arabia before revelation — society, trade, beliefs.' },
        { moduleId: seerahMod1.id, title: 'The First Revelation', position: 2, content: 'Cave of Hira and the beginning of prophethood.' },
        { moduleId: seerahMod2.id, title: 'The Hijrah', position: 1, content: 'The migration to Madinah and the first community.' },
    ] as any[]);

    const webdevMod = await CourseModule.create({ courseId: webdev.id, title: 'Foundations', position: 1 } as any);
    await Lesson.bulkCreate([
        { moduleId: webdevMod.id, title: 'How the Web Works', position: 1 },
        { moduleId: webdevMod.id, title: 'HTML Basics', position: 2 },
        { moduleId: webdevMod.id, title: 'CSS Fundamentals', position: 3 },
    ] as any[]);

    const seerahCohort = await Cohort.create({
        courseId: seerah.id,
        name: 'Seerah Circle — 2026 Batch',
        code: 'SEERAH-2026-A',
        startsOn: new Date('2026-07-05'),
        scheduleNote: 'Every Sunday 11:00 AM – 12:30 PM (Zoom)',
        status: 'active',
        capacity: 100,
    } as any);

    const webdevCohort = await Cohort.create({
        courseId: webdev.id,
        name: 'FSWD Girls — Batch 2026-B',
        code: 'WEBDEV-2026-B',
        startsOn: new Date('2026-08-02'),
        scheduleNote: 'Saturdays 10:00 AM – 1:00 PM (Community Centre)',
        status: 'active',
        capacity: 30,
    } as any);

    const arabicCohort = await Cohort.create({
        courseId: arabic.id,
        name: 'Arabic Foundations — Weekend 2026',
        code: 'ARABIC-2026-W',
        startsOn: new Date('2026-09-06'),
        scheduleNote: 'Sundays 4:00 PM – 5:30 PM (Zoom)',
        status: 'upcoming',
        capacity: 60,
    } as any);

    await TeachingAssignment.bulkCreate([
        { teacherId: aaliyah.id, cohortId: seerahCohort.id, role: 'instructor' },
        { teacherId: sumaiya.id, cohortId: webdevCohort.id, role: 'instructor' },
        { teacherId: aaliyah.id, cohortId: arabicCohort.id, role: 'instructor' },
    ] as any[]);

    // Enrollments: first 6 students in seerah, first 5 in webdev
    const seerahStudents = students.slice(0, 6);
    const webdevStudents = students.slice(3, 8);
    for (const s of seerahStudents) {
        await Enrollment.create({ userId: s.id, courseId: seerah.id, cohortId: seerahCohort.id, status: 'active' } as any);
    }
    for (const s of webdevStudents) {
        await Enrollment.create({ userId: s.id, courseId: webdev.id, cohortId: webdevCohort.id, status: 'active' } as any);
    }

    // Past sessions (completed w/ attendance) + upcoming ones
    const pastTopics = ['The World Before the Prophet ﷺ', 'The First Revelation', 'The Early Muslims', 'Persecution & Patience'];
    for (let i = 0; i < pastTopics.length; i++) {
        const session = await ClassSession.create({
            cohortId: seerahCohort.id,
            title: `Week ${i + 1}`,
            topic: pastTopics[i],
            startsAt: daysFromNow(-7 * (pastTopics.length - i)),
            endsAt: daysFromNow(-7 * (pastTopics.length - i), 12, 30),
            meetingUrl: 'https://zoom.us/j/aspire-seerah',
            teacherId: aaliyah.id,
            status: 'completed',
        } as any);
        for (let j = 0; j < seerahStudents.length; j++) {
            // deterministic-ish variety: one absentee/late per week rotation
            const status = j === i % seerahStudents.length ? (i % 2 === 0 ? 'absent' : 'late') : 'present';
            await Attendance.create({
                sessionId: session.id,
                studentId: seerahStudents[j].id,
                status,
                markedBy: aaliyah.id,
                markedAt: daysFromNow(-7 * (pastTopics.length - i), 12, 45),
            } as any);
        }
    }
    await ClassSession.create({
        cohortId: seerahCohort.id,
        title: `Week ${pastTopics.length + 1}`,
        topic: 'The Year of Sorrow',
        startsAt: daysFromNow(1),
        endsAt: daysFromNow(1, 12, 30),
        meetingUrl: 'https://zoom.us/j/aspire-seerah',
        teacherId: aaliyah.id,
        status: 'scheduled',
    } as any);
    await ClassSession.create({
        cohortId: webdevCohort.id,
        title: 'Session 3',
        topic: 'CSS Fundamentals',
        startsAt: daysFromNow(6, 10, 0),
        endsAt: daysFromNow(6, 13, 0),
        location: 'Community Centre, Frazer Town',
        teacherId: sumaiya.id,
        status: 'scheduled',
    } as any);

    console.log('Seeding donations…');
    const donationSeeds = [
        { name: 'Rahul Sharma', email: 'rahul@example.com', amount: 5000, projectId: cleanWater.id, days: -40 },
        { name: 'Ayesha Merchant', email: 'ayesha@example.com', amount: 10000, campaignId: restoringHope.id, projectId: touchlife.id, days: -25 },
        { name: 'Zara Ahmed', email: 'zara@example.com', amount: 2500, projectId: rehnuma.id, days: -20 },
        { name: 'Anonymous Well-wisher', email: 'anon@example.com', amount: 25000, campaignId: restoringHope.id, projectId: touchlife.id, days: -12, anonymous: true },
        { name: 'Imran Kagalwala', email: 'imran@example.com', amount: 7500, projectId: breakfastClub.id, days: -8 },
        { name: 'Sana Fathima', email: 'sana@example.com', amount: 15000, projectId: cleanWater.id, days: -3 },
        { name: 'Rahul Sharma', email: 'rahul@example.com', amount: 10000, campaignId: restoringHope.id, projectId: touchlife.id, days: -1 },
    ];

    for (const d of donationSeeds) {
        const createdAt = daysFromNow(d.days, 15);
        const receiptNumber = makeReceiptNumber();
        await Donation.create({
            donorName: d.name,
            donorEmail: d.email,
            projectId: d.projectId ?? null,
            campaignId: d.campaignId ?? null,
            amount: d.amount,
            status: 'success',
            method: 'mock_upi',
            gatewayRef: makeGatewayRef(),
            isAnonymous: d.anonymous ?? false,
            receiptNumber,
            receiptedAt: createdAt,
            createdAt,
            updatedAt: createdAt,
        } as any);
        if (d.projectId) await Project.increment({ raisedAmount: d.amount }, { where: { id: d.projectId } });
        if (d.campaignId) await Campaign.increment({ raisedAmount: d.amount }, { where: { id: d.campaignId } });

        const contactId = await ensureContact({ fullName: d.name, email: d.email, type: 'donor' });
        await logInteraction({
            contactId,
            kind: 'donation',
            subject: `Donated ₹${d.amount}${d.anonymous ? ' (anonymous)' : ''}`,
            detail: `Receipt ${receiptNumber}`,
            occurredAt: createdAt,
        });
    }

    // one pending bank transfer + one failed for realistic variety
    await Donation.create({
        donorName: 'Bilal Khan', donorEmail: 'bilal@example.com', amount: 50000,
        projectId: cleanWater.id, method: 'bank_transfer', status: 'pending', gatewayRef: makeGatewayRef(),
    } as any);
    await Donation.create({
        donorName: 'Test Failure', donorEmail: 'fail@example.com', amount: 1000,
        projectId: rehnuma.id, method: 'mock_card', status: 'failed', gatewayRef: makeGatewayRef(),
    } as any);

    console.log('Seeding certificates…');
    for (const s of students.slice(0, 2)) {
        await Certificate.create({
            certificateNumber: makeCertificateNumber(),
            verificationCode: makeVerificationCode(),
            userId: s.id,
            courseId: seerah.id,
            cohortId: seerahCohort.id,
            title: 'Certificate of Completion — Seerah Circle 2025',
            description: 'Completed the 16-week Seerah Circle with distinction.',
            issuedBy: admin.id,
            issuedAt: new Date('2026-01-15'),
        } as any);
    }

    console.log('Seeding CMS & settings…');
    await Page.create({
        slug: 'about',
        title: 'About Team Aspire',
        status: 'published',
        publishedAt: new Date(),
        updatedBy: admin.id,
        blocks: [
            { type: 'hero', heading: 'A sisterhood rooted in deen & service', subheading: 'For over 10 years, Team Aspire has been a women-only space building community through faith, learning and humanitarian action.' },
            { type: 'richText', heading: 'Who we are', body: 'Team Aspire is a women-only community rooted in deen, sisterhood and humanitarian service. What began as a small circle of sisters has grown into a decade-strong movement — running weekly classes, mentoring young girls, feeding neighbourhoods, funding medical emergencies and installing clean-water plants.' },
            { type: 'stats', items: [ { label: 'Years of service', value: '10+' }, { label: 'Active volunteers', value: '150+' }, { label: 'Lives touched', value: '15,000+' } ] },
            { type: 'richText', heading: 'What drives us', body: 'We believe service is worship. Every project — from a warm breakfast to a mentorship circle — is our way of living the mercy our faith teaches.' },
            { type: 'cta', heading: 'Walk this journey with us', body: 'Join as a volunteer, learn in our circles, or support a project.', ctaLabel: 'Get involved', ctaHref: '/contact' },
        ],
        seo: { title: 'About — Team Aspire', description: 'A women-only space rooted in deen, sisterhood & humanitarian service. Building community for 10+ years.' },
    } as any);

    const settingsSeed: [string, unknown, string][] = [
        ['site.name', 'Team Aspire', 'Public site name'],
        ['site.tagline', 'Rooted in deen, sisterhood & humanitarian service', 'Homepage tagline'],
        ['site.contactEmail', 'aspireforandaman@gmail.com', 'Public contact email'],
        ['site.instagram', 'https://www.instagram.com/team.aspire', 'Instagram URL'],
        ['donations.minAmount', 10, 'Minimum donation amount (INR)'],
        ['donations.currency', 'INR', 'Donation currency'],
        ['features.lms', true, 'Enable courses on the public site'],
        ['features.donations', true, 'Enable donations on the public site'],
        ['features.certificateVerification', true, 'Enable public certificate verification'],
    ];
    for (const [key, value, description] of settingsSeed) {
        await Setting.upsert({ key, value: value as object, description, updatedBy: admin.id } as any);
    }

    // CRM: make sure teachers/students exist as contacts too
    for (const u of [aaliyah, sumaiya, ...students]) {
        await ensureContact({ userId: u.id, fullName: u.fullName, email: u.email, type: students.includes(u) ? 'student' : 'teacher' });
    }
    await ensureContact({ userId: khadija.id, fullName: khadija.fullName, email: khadija.email, type: 'other' });

    console.log('✔ Seed complete');
    console.log('   Admin   → admin@teamaspire.org / Admin@123');
    console.log('   Finance → khadija@teamaspire.org / Admin@123');
    console.log('   Teacher → aaliyah@teamaspire.org / Teacher@123');
    console.log('   Student → zara@example.com / Student@123');
    process.exit(0);
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
