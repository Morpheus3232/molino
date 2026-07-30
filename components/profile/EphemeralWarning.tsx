"use client";

import { motion } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";

interface EphemeralWarningProps {
  onDismiss: () => void;
}

export default function EphemeralWarning({ onDismiss }: EphemeralWarningProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="relative p-4 rounded-md bg-amber-50 border border-amber-200 dark:bg-amber-900/30 dark:border-amber-800"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            ⚠️ Información efímera
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-300 mt-1 leading-relaxed">
            Esta lectura se almacena <strong>solo en tu navegador</strong> (localStorage).
            No se guarda en ningún servidor. Si limpias los datos del sitio, usas otro
            dispositivo o navegas en modo incógnito, tu mapa desaparecerá.
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-300 mt-2 leading-relaxed">
            Usá el botón <strong>&ldquo;Descargar como imagen&rdquo;</strong> para guardar una copia permanente.
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="flex-shrink-0 p-1 text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 transition-colors rounded-md hover:bg-amber-100 dark:hover:bg-amber-800/50"
          aria-label="Descartar aviso"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </motion.div>
  );
}