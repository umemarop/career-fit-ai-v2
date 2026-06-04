import { Laptop, LogOut, MonitorSmartphone, ShieldX } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Session } from "@/types/settings.types";
import { formatDate } from "@/utils/format";

type SessionSettingsCardProps = {
  sessions: Session[];
  isUpdating: boolean;
  onRevokeSession: (sessionId: string) => Promise<void>;
  onLogoutOthers: () => Promise<void>;
  onLogoutAll: () => Promise<void>;
};

function getSessionTitle(session: Session) {
  const browser = session.browser || "Unknown browser";
  const os = session.os || "Unknown OS";

  return `${browser} on ${os}`;
}

function getSessionSubtitle(session: Session) {
  const device = session.deviceType || "Unknown device";
  const ipAddress = session.ipAddress || "Unknown IP";

  return `${device} · ${ipAddress}`;
}

function SessionItem({
  session,
  isUpdating,
  onRevokeSession,
}: {
  session: Session;
  isUpdating: boolean;
  onRevokeSession: (sessionId: string) => Promise<void>;
}) {
  const isRevoked = Boolean(session.revokedAt);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 ring-1 ring-slate-200">
          <Laptop className="h-5 w-5" />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-slate-950">
              {getSessionTitle(session)}
            </p>

            {session.isCurrent ? (
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                Current
              </span>
            ) : null}

            {isRevoked ? (
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
                Revoked
              </span>
            ) : null}
          </div>

          <p className="mt-1 text-sm text-slate-500">
            {getSessionSubtitle(session)}
          </p>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            <span>Created {formatDate(session.createdAt)}</span>
            <span>Expires {formatDate(session.expiresAt)}</span>
          </div>
        </div>
      </div>

      {!session.isCurrent && !isRevoked ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onRevokeSession(session.id)}
          disabled={isUpdating}
        >
          Revoke
        </Button>
      ) : null}
    </div>
  );
}

export function SessionSettingsCard({
  sessions,
  isUpdating,
  onRevokeSession,
  onLogoutOthers,
  onLogoutAll,
}: SessionSettingsCardProps) {
  const currentSession = sessions.find((session) => session.isCurrent);
  const otherSessions = sessions.filter((session) => !session.isCurrent);
  const hasActiveOtherSessions = otherSessions.some(
    (session) => !session.revokedAt,
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <MonitorSmartphone className="h-5 w-5 text-slate-500" />
            <h2 className="text-lg font-semibold text-slate-950">Sessions</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Review active login sessions and revoke devices you no longer use.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onLogoutOthers}
            disabled={isUpdating || !hasActiveOtherSessions}
          >
            <ShieldX className="mr-2 h-4 w-4" />
            Logout others
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onLogoutAll}
            disabled={isUpdating}
            className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout all
          </Button>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-800">
            Current session
          </h3>

          {currentSession ? (
            <SessionItem
              session={currentSession}
              isUpdating={isUpdating}
              onRevokeSession={onRevokeSession}
            />
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
              Current session information is not available.
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-800">
            Other sessions
          </h3>

          {otherSessions.length > 0 ? (
            <div className="space-y-3">
              {otherSessions.map((session) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  isUpdating={isUpdating}
                  onRevokeSession={onRevokeSession}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
              No other sessions found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
