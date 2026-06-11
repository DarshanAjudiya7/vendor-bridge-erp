import React from "react";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user) return null;
  const userId = Number((session.user as any).id);

  let notifs: any[] = [];
  try {
    notifs = await db.select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  } catch (err) {
    console.error("Failed to load notifications:", err);
  }

  return (
    <div className="w-full text-on-background font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="font-headline-md text-[28px] font-bold text-primary mb-1">Notifications</h2>
        <p className="text-on-surface-variant text-sm">Stay updated on your recent alerts and actions.</p>
      </div>

      <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
        <div className="divide-y divide-outline-variant/50">
          {notifs.length > 0 ? notifs.map((notif) => (
            <div key={notif.id} className={`p-4 md:p-6 flex gap-4 ${!notif.isRead ? 'bg-primary/5' : 'bg-transparent'} hover:bg-surface-container transition-colors`}>
              <div className="mt-1">
                {notif.type === 'ALERT' && <span className="material-symbols-outlined text-error text-[24px]">error</span>}
                {notif.type === 'SUCCESS' && <span className="material-symbols-outlined text-tertiary text-[24px]">check_circle</span>}
                {notif.type === 'WARNING' && <span className="material-symbols-outlined text-secondary text-[24px]">warning</span>}
                {notif.type === 'INFO' && <span className="material-symbols-outlined text-primary text-[24px]">info</span>}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start gap-4">
                  <h4 className={`text-sm font-bold ${!notif.isRead ? 'text-on-surface' : 'text-on-surface-variant'}`}>{notif.title}</h4>
                  <span className="text-[11px] text-outline font-mono-sm whitespace-nowrap">{notif.createdAt?.toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">{notif.message}</p>
                {notif.link && (
                  <a href={notif.link} className="inline-flex items-center gap-1 mt-3 text-primary text-[12px] font-bold hover:underline">
                    View Details <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </a>
                )}
              </div>
            </div>
          )) : (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-[48px] text-outline mb-4 opacity-50">notifications_off</span>
              <p className="text-on-surface-variant text-sm">You have no notifications at this time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
