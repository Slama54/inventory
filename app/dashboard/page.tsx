import Sidebar from '@/components/Sidebar'
import React from 'react'

export default function DashboardPage() {
    return (
        <div className='min-h-screen bg-gray-50'>
            <Sidebar currentPath='/dashboard' />
        </div>
    )
}
