"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { generateAIInterpretation } from "@/lib/engines/aiEngine";
import type { AIInterpretation } from "@/lib/engines/aiEngine";

interface AIInterpretationProps {
  user: any;
  target: any;
  result: any;
  provider?: 'openai' | 'claude';
  template?: string;
}

export default function AIInterpretation({
  user,
  target,
  result,
  provider: providerProp,
  template,
}: AIInterpretationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [interpretation, setInterpretation] = useState<AIInterpretation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const defaultProvider = useMemo(() => {
    if (typeof window !== 'undefined') {
      const envProvider = process.env.NEXT_PUBLIC_AI_PROVIDER as 'openai' | 'claude' | undefined;
      return envProvider === 'claude' ? 'claude' : 'openai';
    }
    return 'openai';
  }, []);

  const provider = providerProp || defaultProvider;

  useEffect(() => {
    const fetchInterpretation = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await generateAIInterpretation(user, target, result, provider, template);
        setInterpretation(data);
      } catch (err) {
        setError('Error al generar la interpretación. Usando datos locales.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterpretation();
  }, [user, target, result, provider, template]);

  if (isLoading) {
    return (
      <div className="space-y-3 p-4 bg-background rounded-none border border-card-border">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <p className="text-xs text-muted text-center">Generando interpretación con IA...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-yellow-50 rounded-none border border-yellow-200">
        <p className="text-sm text-yellow-700">{error}</p>
      </div>
    );
  }

  if (!interpretation) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 p-4 bg-background rounded-none border border-card-border"
    >
      <h4 className="text-sm font-medium text-muted uppercase tracking-wider mb-2">Interpretación</h4>
      
      <p className="text-sm text-foreground/80 leading-relaxed">{interpretation.narrative}</p>

      {interpretation.detailedInsights.length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-muted mb-2">Insights</h5>
          <ul className="space-y-1">
            {interpretation.detailedInsights.map((insight, i) => (
              <li key={i} className="text-sm text-foreground/70 flex items-start gap-2">
                <span className="text-muted mt-0.5">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {interpretation.recommendations.length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-muted mb-2">Recomendaciones</h5>
          <ul className="space-y-1">
            {interpretation.recommendations.map((rec, i) => (
              <li key={i} className="text-sm text-foreground/70 flex items-start gap-2">
                <span className="text-muted mt-0.5">→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {interpretation.reflectionQuestions.length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-muted mb-2">Reflexión</h5>
          <ul className="space-y-1">
            {interpretation.reflectionQuestions.map((q, i) => (
              <li key={i} className="text-sm text-foreground/70 flex items-start gap-2">
                <span className="text-muted mt-0.5">❓</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {interpretation.poeticSummary && (
        <div className="pt-3 border-t border-card-border">
          <p className="text-sm text-muted italic text-center">
            &ldquo;{interpretation.poeticSummary}&rdquo;
          </p>
        </div>
      )}
    </motion.div>
  );
}
