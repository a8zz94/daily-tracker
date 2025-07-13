import { User } from '@supabase/supabase-js'

export interface DailyEntry {
  metric_name: string
  status: 'yes' | 'no' | 'nd'
  date: string
}

export interface AuthFormProps {
  onAuthSuccess: (user: User) => void
}

export interface MetricListProps {
  user: User
  onSignOut: () => void
}

export interface CalendarViewProps {
  user: User
  metricName: string
  onBack: () => void
}