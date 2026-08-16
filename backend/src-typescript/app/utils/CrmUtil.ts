import Contact from '../models/contact.model';
import Interaction from '../models/interaction.model';

type ContactSeed = {
    userId?: string | null;
    fullName: string;
    email?: string | null;
    phone?: string | null;
    type?: string;
};

/** Find-or-create a CRM contact (by userId, then email) and return its id. */
export const ensureContact = async (seed: ContactSeed): Promise<string> => {
    if (seed.userId) {
        const byUser = await Contact.findOne({ where: { userId: seed.userId } });
        if (byUser) return byUser.id;
    }
    if (seed.email) {
        const byEmail = await Contact.findOne({ where: { email: seed.email } });
        if (byEmail) {
            if (seed.userId && !byEmail.userId) {
                await byEmail.update({ userId: seed.userId });
            }
            return byEmail.id;
        }
    }
    const created = await Contact.create({
        userId: seed.userId ?? null,
        fullName: seed.fullName,
        email: seed.email ?? null,
        phone: seed.phone ?? null,
        type: seed.type ?? 'other',
    } as any);
    return created.id;
};

export const logInteraction = async (input: {
    contactId: string;
    kind: string;
    subject: string;
    detail?: string | null;
    createdBy?: string | null;
    occurredAt?: Date;
}): Promise<void> => {
    await Interaction.create({
        contactId: input.contactId,
        kind: input.kind,
        subject: input.subject,
        detail: input.detail ?? null,
        createdBy: input.createdBy ?? null,
        occurredAt: input.occurredAt ?? new Date(),
    } as any);
};
