export default function UniversityFooter() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#1F2937]">🌾 Molino</h3>
            <p className="text-sm text-[#6B7280] mt-2">
              Universidad Pública de Libre Acceso
            </p>
            <p className="text-xs text-[#6B7280] mt-1">
              Código Abierto · Sin Registro · Sin Rastreo
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#1F2937]">Principios</h4>
            <ul className="mt-2 space-y-1 text-sm text-[#6B7280]">
              <li>🔓 Conocimiento libre</li>
              <li>🕊️ Privacidad radical</li>
              <li>📚 Transparencia total</li>
              <li>🧬 Código abierto</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#1F2937]">Enlaces</h4>
            <ul className="mt-2 space-y-1 text-sm text-[#6B7280]">
              <li><a href="#" className="hover:text-[#1F2937]">GitHub</a></li>
              <li><a href="#" className="hover:text-[#1F2937]">Documentación</a></li>
              <li><a href="#" className="hover:text-[#1F2937]">Biblioteca Pública</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-100 text-center text-xs text-[#6B7280]">
          <p>
            🌾 Molino — Universidad Pública de Libre Acceso.{" "}
            Todo el contenido es educativo y no constituye asesoramiento profesional.
          </p>
          <p className="mt-1">
            El conocimiento simbólico es patrimonio de la humanidad. Compartilo libremente.
          </p>
        </div>
      </div>
    </footer>
  );
}
