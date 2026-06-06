import React, { useMemo } from 'react';
import { ShoppingCart, DollarSign, Package, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsDashboard({ orders }) {
  const stats = useMemo(() => {
    let totalRevenue = 0;
    let totalItems = 0;
    const uniqueCustomers = new Set();
    const productSales = {};
    const salesByDate = {};

    orders.forEach(order => {
      totalRevenue += order.totalAmount;
      uniqueCustomers.add(order.customerEmail);

      // Trend data
      const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!salesByDate[date]) salesByDate[date] = 0;
      salesByDate[date] += 1;

      // Products data
      order.products.forEach(p => {
        totalItems += p.quantity;
        const pId = p.product?._id || p.product;
        const pName = p.product?.title || 'Unknown Product';
        if (!productSales[pId]) {
          productSales[pId] = { name: pName, quantity: 0, revenue: 0 };
        }
        productSales[pId].quantity += p.quantity;
        productSales[pId].revenue += (p.priceAtPurchase * p.quantity);
      });
    });

    const trendData = Object.keys(salesByDate).map(date => ({
      date,
      sales: salesByDate[date]
    })).slice(-14); // Last 14 days

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      totalOrders: orders.length,
      totalRevenue,
      totalItems,
      activeCustomers: uniqueCustomers.size,
      trendData,
      topProducts
    };
  }, [orders]);

  const getCurrencySymbol = () => '₦'; // Assuming base currency NGN for dashboard

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>Sales Analytics Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Real-time insights on orders, sales, and revenue</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Orders</p>
            <h3 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>{stats.totalOrders}</h3>
          </div>
          <ShoppingCart size={32} color="var(--accent-gold)" opacity={0.8} />
        </div>
        
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Items Sold</p>
            <h3 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>{stats.totalItems}</h3>
          </div>
          <Package size={32} color="var(--accent-gold)" opacity={0.8} />
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Revenue Generated</p>
            <h3 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>{getCurrencySymbol()}{stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          </div>
          <DollarSign size={32} color="var(--accent-gold)" opacity={0.8} />
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Active Customers</p>
            <h3 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>{stats.activeCustomers}</h3>
          </div>
          <Users size={32} color="var(--accent-gold)" opacity={0.8} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Sales Trend (Last 14 Days)</h4>
          <div style={{ height: '300px', width: '100%' }}>
            {stats.trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(201, 168, 76, 0.1)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} />
                  <YAxis stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                    itemStyle={{ color: 'var(--accent-gold)' }}
                  />
                  <Line type="monotone" dataKey="sales" stroke="var(--accent-gold)" strokeWidth={3} dot={{ r: 4, fill: 'var(--bg-primary)', stroke: 'var(--accent-gold)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                No sales recorded yet
              </div>
            )}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Top Products</h4>
          {stats.topProducts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {stats.topProducts.map((product, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div>
                    <p style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{product.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{product.quantity} sold</p>
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--accent-gold)' }}>
                    {getCurrencySymbol()}{product.revenue.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              No top products yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
