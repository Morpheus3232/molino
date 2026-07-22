export default function PhilosophySection() {
  return (
    <section className="py-16 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-accent/10 text-accent text-sm font-medium px-4 py-1 rounded-full mb-4">
            Manifiesto
          </div>
          <h2 className="text-3xl font-serif font-semibold text-foreground">
            El conocimiento simbólico es patrimonio de la humanidad
          </h2>
          <p className="text-muted text-lg mt-4 leading-relaxed">
            Molino es una herramienta para explorar sistemas simbólicos —{" "}
            <span className="text-foreground font-medium">no para encerrarlos</span>.
            Todo el código es abierto, todos los datos son efímeros, todo el conocimiento es libre.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 text-left">
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <div className="text-3xl mb-3">🔓</div>
              <h3 className="font-semibold text-foreground">Código Abierto</h3>
              <p className="text-sm text-muted mt-1">
                Todo el código está disponible en GitHub. Puedes revisarlo, mejorarlo o forkearlo.
              </p>
            </div>
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <div className="text-3xl mb-3">🕊️</div>
              <h3 className="font-semibold text-foreground">Sin Datos</h3>
              <p className="text-sm text-muted mt-1">
                No guardamos nada. Ni cookies, ni localStorage, ni análisis. Tu visita es efímera.
              </p>
            </div>
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="font-semibold text-foreground">Conocimiento Libre</h3>
              <p className="text-sm text-muted mt-1">
                Todo el contenido se basa en fuentes públicas y está disponible para cualquier persona.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
