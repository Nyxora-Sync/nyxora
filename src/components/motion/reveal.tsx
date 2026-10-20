'use client'

import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react'
import { cn } from '@/lib/utils'

interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'whileInView' | 'transition'> {
  delay?: number
  distance?: number
}

/**
 * Reveals a block once as it enters the viewport. Keep this for larger pieces
 * of content; repeating it on every element makes a page feel busy.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 18,
  ...props
}: RevealProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      data-motion-reveal=""
      className={cn(className)}
      initial={reduceMotion ? false : { opacity: 0, y: distance }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
