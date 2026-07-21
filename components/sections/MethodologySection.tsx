export default function MethodologySection() {
  return (
    <section id="metodologia" className="py-16 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-[#2D5A3D]/10 text-[#2D5A3D] text-sm font-medium px-4 py-1 rounded-full mb-4">
            🔬 Metodología Transparente
          </div>
          <h2 className="text-3xl font-serif font-semibold text-[#1F2937] mb-6">
            Cómo funciona Molino
          </h2>
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start gap-4">
                <span className="text-2xl">1.</span>
                <div>
                  <h4 className="font-semibold text-[#1F2937]">Numerología Pitagórica</h4>
                  <p className="text-sm text-[#6B7280]">Basada en la tabla pitagórica (A=1, B=2, ... Z=8).</p>
                  <details className="mt-2 text-xs text-[#6B7280]">
                    <summary className="cursor-pointer hover:text-[#1F2937]">Ver fórmula</summary>
                    <code className="block mt-2 p-3 bg-[#F8F9FA] rounded-lg font-mono text-xs">
                      Life Path = Σ(dígitos de fecha de nacimiento) → reducción a 1-9, 11, 22, 33
                    </code>
                  </details>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start gap-4">
                <span className="text-2xl">2.</span>
                <div>
                  <h4 className="font-semibold text-[#1F2937]">Astrología Occidental</h4>
                  <p className="text-sm text-[#6B7280]">Cálculo del signo solar según fecha de nacimiento.</p>
                  <details className="mt-2 text-xs text-[#6B7280]">
                    <summary className="cursor-pointer hover:text-[#1F2937]">Ver fuente</summary>
                    <p className="mt-2 p-3 bg-[#F8F9FA] rounded-lg">Basado en el zodíaco tropical con fechas estándar.</p>
                  </details>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start gap-4">
                <span className="text-2xl">3.</span>
                <div>
                  <h4 className="font-semibold text-[#1F2937]">Zodiaco Chino</h4>
                  <p className="text-sm text-[#6B7280]">Animal y elemento según año lunar.</p>
                  <details className="mt-2 text-xs text-[#6B7280]">
                    <summary className="cursor-pointer hover:text-[#1F2937]">Ver fuente</summary>
                    <p className="mt-2 p-3 bg-[#F8F9FA] rounded-lg">Basado en el ciclo sexagenario chino.</p>
                  </details>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 text-sm text-[#6B7280] bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <p className="flex items-center gap-2">
              <span className="text-[#D4A843]">📖</span>
              <span>
                Todas las fuentes están disponibles en la <a href="#" className="text-[#1F2937] underline">Biblioteca Pública</a>.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
