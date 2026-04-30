import { getDashboardStats } from '@/lib/actions/dashboard';
import Link from 'next/link';
import {
    ShoppingCart, DollarSign, Package, Users, FileText, Mail,
    Plus, Clock, AlertCircle, ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboard() {
    console.info('[Dashboard] Loading live data');
    const { stats, recentOrders } = await getDashboardStats();

    const statCards = [
        { label: 'Total Revenue', value: `KSh ${stats.confirmedRevenue.toLocaleString()}`, icon: DollarSign, textColor: 'text-green-600', bgColor: 'bg-green-50' },
        { label: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingCart, textColor: 'text-blue-600', bgColor: 'bg-blue-50' },
        { label: 'Pending Orders', value: stats.pendingOrders.toString(), icon: Clock, textColor: 'text-orange-600', bgColor: 'bg-orange-50' },
        { label: 'Active Products', value: stats.totalProducts.toString(), icon: Package, textColor: 'text-amber-600', bgColor: 'bg-amber-50' },
        { label: 'Customers', value: stats.totalCustomers.toString(), icon: Users, textColor: 'text-purple-600', bgColor: 'bg-purple-50' },
        { label: 'New Quotes', value: stats.newQuotations.toString(), icon: FileText, textColor: 'text-cyan-600', bgColor: 'bg-cyan-50' },
        { label: 'New Inquiries', value: stats.newInquiries.toString(), icon: Mail, textColor: 'text-rose-600', bgColor: 'bg-rose-50' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-brand-dark">Dashboard</h1>
                    <p className="text-brand-grey text-sm mt-1">Store overview & quick actions</p>
                </div>
                <Link href="/admin/products/new">
                    <Button className="bg-brand-gold hover:bg-[#b88a35] text-white shadow-sm">
                        <Plus className="h-4 w-4 mr-2" /> Add Product
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => (
                    <div key={stat.label} className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-brand-grey uppercase tracking-wide">{stat.label}</span>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`h-4 w-4 ${stat.textColor}`} />
                            </div>
                        </div>
                        <div className="text-xl font-bold text-brand-dark">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Recent Orders (2 cols) */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader className="pb-3 flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
                            <Link href="/admin/orders">
                                <Button variant="ghost" size="sm" className="text-brand-gold hover:text-[#b88a35] hover:bg-brand-gold/10 h-8 px-2">
                                    View All <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {recentOrders.length === 0 ? (
                                <div className="text-center py-8 text-brand-grey">
                                    <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                    <p>No orders yet. They will appear here after checkout.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentOrders.map((order) => (
                                        <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border border-stone-100 hover:border-brand-gold/30 transition bg-stone-50/30">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold font-medium text-xs">
                                                    {order.customer.charAt(0)}
                                                </div>
                                                <div>
                                                    <Link href={`/admin/orders/${order.id}`} className="font-medium text-brand-dark hover:text-brand-gold text-sm">
                                                        {order.orderNumber}
                                                    </Link>
                                                    <p className="text-xs text-brand-grey">{order.customer}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-right">
                                                <span className="text-sm font-medium">KSh {order.total.toLocaleString()}</span>
                                                <Badge className={
                                                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                                            'bg-blue-100 text-blue-700'
                                                }>
                                                    {order.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Alerts & Quick Actions (1 col) */}
                <div className="space-y-6">
                    {/* Attention Alerts */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-rose-500" /> Attention Needed
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link href="/admin/quotations?status=new" className="flex items-center justify-between p-3 rounded-lg bg-cyan-50 hover:bg-cyan-100 transition group">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-4 w-4 text-cyan-600" />
                                    <span className="text-sm font-medium text-cyan-900">New Quotations</span>
                                </div>
                                <Badge className="bg-cyan-200 text-cyan-800 group-hover:bg-cyan-300">{stats.newQuotations}</Badge>
                            </Link>
                            <Link href="/admin/contacts?status=new" className="flex items-center justify-between p-3 rounded-lg bg-rose-50 hover:bg-rose-100 transition group">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-rose-600" />
                                    <span className="text-sm font-medium text-rose-900">New Inquiries</span>
                                </div>
                                <Badge className="bg-rose-200 text-rose-800 group-hover:bg-rose-300">{stats.newInquiries}</Badge>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            <Link href="/admin/orders" className="p-3 rounded-lg border border-stone-200 hover:border-brand-gold hover:bg-brand-gold/5 transition text-center">
                                <ShoppingCart className="h-5 w-5 mx-auto mb-1 text-brand-gold" />
                                <span className="text-xs font-medium text-brand-dark">View Orders</span>
                            </Link>
                            <Link href="/admin/customers" className="p-3 rounded-lg border border-stone-200 hover:border-brand-gold hover:bg-brand-gold/5 transition text-center">
                                <Users className="h-5 w-5 mx-auto mb-1 text-brand-gold" />
                                <span className="text-xs font-medium text-brand-dark">Customers</span>
                            </Link>
                            <Link href="/admin/quotations" className="p-3 rounded-lg border border-stone-200 hover:border-brand-gold hover:bg-brand-gold/5 transition text-center">
                                <FileText className="h-5 w-5 mx-auto mb-1 text-brand-gold" />
                                <span className="text-xs font-medium text-brand-dark">Quotes</span>
                            </Link>
                            <Link href="/admin/contacts" className="p-3 rounded-lg border border-stone-200 hover:border-brand-gold hover:bg-brand-gold/5 transition text-center">
                                <Mail className="h-5 w-5 mx-auto mb-1 text-brand-gold" />
                                <span className="text-xs font-medium text-brand-dark">Contacts</span>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}