"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { fadeUp } from "@/lib/utils/motion";
import Card from "@/components/ui/Card";

const GITHUB_USER = "Morpheus3232";
const GITHUB_REPO = "Morpheus3232/molino";
const REPO_URL = `https://github.com/${GITHUB_REPO}`;

export default function QuienHaceEsto() {
  return (
    <section className="bg-ink/[0.02] border-t border-ink/10 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 lg:px-12 text-center">
        <motion.h2
          {...fadeUp}
          className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-5"
        >
          Hecho a mano, con código abierto
        </motion.h2>

        <motion.p
          {...fadeUp}
          className="text-base sm:text-lg text-muted/80 leading-relaxed mb-10"
        >
          Molino es un proyecto personal construido con el principio de que el
          autoconocimiento no debería requerir que entregues tu identidad. Cada
          línea de código es pública y auditable.
        </motion.p>

        <motion.div {...fadeUp}>
          <Card padding="lg" className="text-left">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-ink/5 text-accent flex items-center justify-center shrink-0">
                <Github className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground mb-0.5">
                  Creado por {GITHUB_USER}
                </p>
                <p className="text-xs text-muted/70 mb-3">
                  Proyecto personal de autoconocimiento, privacidad radical y
                  transparencia total.
                </p>

                <ul className="flex flex-wrap gap-2 text-xs font-mono">
                  <li>
                    <Link
                      href={`https://github.com/${GITHUB_USER}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 border border-ink/15 rounded-full px-3 py-1.5 text-muted/80 hover:text-foreground hover:border-accent/50 transition-colors"
                    >
                      github.com/{GITHUB_USER}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={REPO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 border border-ink/15 rounded-full px-3 py-1.5 text-muted/80 hover:text-foreground hover:border-accent/50 transition-colors"
                    >
                      github.com/{GITHUB_REPO}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://opensource.org/licenses/MIT"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 rounded-full px-3 py-1.5 transition-colors"
                    >
                      MIT License
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
