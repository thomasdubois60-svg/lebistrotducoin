import type { MenuSection } from '@/lib/default-content'
export const menuStyles: Record<string, string>
export function categoryKeys(menu: MenuSection[]): string[]
export default function MenuExperience(props: {
 menu: MenuSection[]
 activeKey?: string | null
 introduction?: string
 onNavigate?: (key: string | null) => void
 preview?: boolean
 compact?: boolean
}): import('react').ReactElement
