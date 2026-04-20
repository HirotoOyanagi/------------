'use client'

import { motion } from 'framer-motion'
import clsx from 'clsx'

const STEPS = [
  { n: 1, en: 'Upload', ja: 'アップロード' },
  { n: 2, en: 'Configure', ja: '設定' },
  { n: 3, en: 'Generate', ja: '生成中' },
  { n: 4, en: 'Publish', ja: '投稿' },
]

export default function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center">
      {STEPS.map((step, i) => (
        <div key={step.n} className="flex items-center">
          <div className="flex flex-col items-center gap-2">
            <motion.div
              className={clsx(
                'relative w-9 h-9 rounded-full flex items-center justify-center text-sm font-heading font-bold transition-all duration-500',
                currentStep > step.n &&
                  'text-white',
                currentStep === step.n &&
                  'text-white',
                currentStep < step.n &&
                  'text-gray-600 bg-white/[0.04] border border-white/[0.08]'
              )}
              style={
                currentStep >= step.n
                  ? {
                      background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                      boxShadow:
                        currentStep === step.n
                          ? '0 0 20px rgba(236,72,153,0.45), 0 0 40px rgba(124,58,237,0.2)'
                          : 'none',
                    }
                  : {}
              }
              animate={
                currentStep === step.n
                  ? { scale: [1, 1.08, 1] }
                  : { scale: 1 }
              }
              transition={{
                duration: 1.5,
                repeat: currentStep === step.n ? Infinity : 0,
                repeatDelay: 2,
              }}
            >
              {currentStep > step.n ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                step.n
              )}
            </motion.div>

            <div className="flex flex-col items-center">
              <span
                className={clsx(
                  'text-[10px] font-heading font-semibold tracking-[0.12em] uppercase hidden sm:block transition-colors duration-300',
                  currentStep === step.n ? 'text-gray-200' : 'text-gray-600'
                )}
              >
                {step.en}
              </span>
              <span
                className={clsx(
                  'text-[9px] font-body hidden sm:block transition-colors duration-300',
                  currentStep === step.n ? 'text-gray-500' : 'text-gray-700'
                )}
              >
                {step.ja}
              </span>
            </div>
          </div>

          {i < STEPS.length - 1 && (
            <div className="relative w-14 md:w-24 h-px mx-3 overflow-hidden">
              <div className="absolute inset-0 bg-white/[0.07]" />
              {currentStep > step.n && (
                <motion.div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(90deg, #7C3AED, #EC4899)' }}
                  initial={{ scaleX: 0, originX: 'left' }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
