import Sidebar from '@/components/Sidebar'
import { getCurrentUser } from '@/lib/auth';
import { Prisma } from '@/lib/prisma'
import { TrendingUp } from 'lucide-react';
import React from 'react'

export default async function DashboardPage() {
    const user = await getCurrentUser();
    const userId = user.id;
    const [totalProducts, lowStock, allProducts] = await Promise.all([
        Prisma.product.count({ where: { userId } }),
        Prisma.product.count({
            where: {
                userId,
                lowStockAt: { not: null }, quantity: { lte: 5 }
            }
        }),
        Prisma.product.findMany({ where: { userId }, select: { price: true, createdAt: true, quantity: true } })

    ])


    const totalValue = allProducts.reduce((sum, product) => sum + Number(product.price) * Number(product.quantity), 0);

    const recent = await Prisma.product.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5
    })
    return (
        <div className='min-h-screen bg-gray-50'>
            <Sidebar currentPath='/dashboard' />
            <main className='ml-64 p-8'>
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="">
                            <h1 className='text-2xl font-semibold text-gray-900'>Dashboard</h1>
                            <p className='text-sm text-gray-500'>Welcome to the Inventory Management Dashboard!</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className='text-lg font-semibold text-gray-900 mb-6'> Key Metrics</h2>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900">{totalProducts}</div>
                                <div className="text-sm text-gray-600">Total Products</div>
                                <div className="flex items-center justify-center mt-1">
                                    <span className='text-xs text-green-600'>+{totalProducts}</span>
                                    <TrendingUp className=' w-4 h-4 text-green-500 ml-1' />
                                </div>

                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900">${Number(totalValue).toFixed()}</div>
                                <div className="text-sm text-gray-600">Total Value</div>
                                <div className="flex items-center justify-center mt-1">
                                    <span className='text-xs text-green-600'>+${Number(totalValue).toFixed()}</span>
                                    <TrendingUp className=' w-4 h-4 text-green-500 ml-1' />
                                </div>

                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900">{lowStock}</div>
                                <div className="text-sm text-gray-600">Low Stock</div>
                                <div className="flex items-center justify-center mt-1">
                                    <span className='text-xs text-green-600'>+{lowStock}</span>
                                    <TrendingUp className=' w-4 h-4 text-green-500 ml-1' />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* stock Level */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className='text-lg font-semibold text-gray-900'>Stock Level</h2>
                        </div>
                        <div className="space-y-3">
                            {recent.map((product, key) => {
                                const stockLevel = product.quantity === 0 ? 0 : product.quantity <= (product.lowStockAt || 5) ? 1 : 2
                                const bgColor = ['bg-red-500', 'bg-yellow-400', 'bg-green-500']
                                const textColor = ['text-red-800', 'text-yellow-600', 'text-green-800']
                                return (
                                    <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-3 h-3 rounded-full ${bgColor[stockLevel]}`}/>
                                            <span className='text-sm font-medium text-gray-900'>{product.name}</span>
                                        </div>
                                        <div className={`text-sm font-medium ${textColor[stockLevel]}`}>{product.quantity} units</div>
                                    </div>
                                )
                            })}

                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
