import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { AdminAuth } from '@/components/admin/AdminAuth'
import { useState } from 'react'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminAuth>
        <AdminDashboard />
      </AdminAuth>
    </div>
  )
} 