import Link from "next/link";

export default function OpenSourceSection() {
  return (
    <section id="codigo" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-[#6B4C7A]/10 text-[#6B4C7A] text-sm font-medium px-4 py-1 rounded-full mb-4">
            🧬 Código Abierto
          </div>
          <h2 className="text-3xl font-serif font-semibold text-[#1F2937]">
            Este proyecto es tuyo
          </h2>
          <p className="text-[#6B7280] text-lg mt-4">
            Molino es 100% open source. Puedes usarlo, modificarlo y compartirlo.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-2">📂</div>
              <p className="font-medium text-[#1F2937]">Repositorio</p>
              <p className="text-xs text-[#6B7280] mt-1">Ver código en GitHub</p>
            </a>
            <Link
              href="/biblioteca"
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-2">📄</div>
              <p className="font-medium text-[#1F2937]">Documentación</p>
              <p className="text-xs text-[#6B7280] mt-1">Cómo contribuir</p>
            </Link>
            <Link
              href="/biblioteca"
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-2">🛠️</div>
              <p className="font-medium text-[#1F2937]">API Pública</p>
              <p className="text-xs text-[#6B7280] mt-1">Usa los datos libremente</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
