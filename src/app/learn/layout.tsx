import { BadgeEarnedToast } from '@/components/badge-earned-toast'

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BadgeEarnedToast />
    </>
  )
}
