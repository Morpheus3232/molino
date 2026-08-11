"use client";

import ProfilePageShell from "@/components/profile/ProfilePageShell";
import WorldConnections from "@/components/profile/WorldConnections";

export default function MundoPage() {
  return (
    <ProfilePageShell
      breadcrumbLabel="Mundo"
      loadingLabel="Cargando tu mundo..."
      emptyTitle="Tu mundo de conexiones"
      emptyDescription="Para ver tu mundo, primero necesitás crear tu perfil personal."
    >
      {(profile) => <WorldConnections profile={profile} />}
    </ProfilePageShell>
  );
}
