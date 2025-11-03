import Sidebar from '@/components/Sidebar'
import { getCurrentUser } from '@/lib/auth';
import { Prisma } from '@/lib/prisma'
import React from 'react'

export default async function DashboardPage() {
    const user = await getCurrentUser();
    const userId = user.id;
    const totalProducts = await Prisma.product.count({where:{userId}})
    const lowStock = await Prisma.product.count({where:{userId }})
    const recent = await Prisma.product.findMany({
        where:{userId},
        orderBy:{createdAt:'desc'},
        take:5
    })
    const allProducts = await Prisma.product.findMany({where:{userId},select:{price:true,createdAt:true,quantity:true}})
    const totalValue = allProducts.reduce((sum,product)=>sum + Number(product.price)* Number(product.quantity),0);
    console.log(totalValue);
    
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
            </main>
        </div>
    )
}
