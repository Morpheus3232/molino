export default function TrustFooter() {
  return (
    <div className="text-center py-6 border-t border-[#E5E7EB] mt-8">
      <div className="flex flex-wrap justify-center gap-4 text-xs text-[#6B7280]">
        <span>🔒 Datos calculados en tu navegador</span>
        <span>•</span>
        <span>👤 Sin registro ni seguimiento</span>
        <span>•</span>
        <span>📖 <a href="#" className="hover:underline">Cómo funciona</a></span>
      </div>
      <p className="text-xs text-[#9CA3AF] mt-2">Molino es un explorador de identidad. Los marcos simbólicos son herramientas de reflexión.</p>
    </div>
  );
}
