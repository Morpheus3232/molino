"use client";

import ProfilePageShell from "@/components/profile/ProfilePageShell";
import CircleAlignment from "@/components/profile/CircleAlignment";

export default function CirculoPage() {
  return (
    <ProfilePageShell
      breadcrumbLabel="Círculo"
      loadingLabel="Cargando tu círculo..."
      emptyTitle="Tu círculo de energías"
      emptyDescription="Para ver tu círculo, primero necesitás crear tu perfil personal."
    >
      {(profile) => <CircleAlignment profile={profile} />}
    </ProfilePageShell>
  );
}
