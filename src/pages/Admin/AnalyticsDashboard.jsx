import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, Package, DollarSign, Users } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsDashboard({ orders }) {
  const analyticsData = useMemo(() => {
    if (!orders || orders.length === 0) return {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      recentSales: [],
      topProducts: []
    };

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const averageOrderValue = totalRevenue / totalOrders;

    const salesByDate = {};
    const productCounts = {};

    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    sortedOrders.forEach(order => {
      const dateStr = new Date(order.createdAt).toLocaleDateString();
      salesByDate[dateStr] = (salesByDate[dateStr] || 0) + (order.totalAmount || 0);

      order.items?.forEach(item => {
        const title = item.product?.title || 'Unknown Product';
        productCounts[title] = (productCounts[title] || 0) + item.quantity;
      });
    });

    const recentSales = Object.entries(salesByDate)
      .slice(0, 7)
      .map(([date, amount]) => ({ date, amount }))
      .reverse();

    const topProducts = Object.entries(productCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      recentSales,
      topProducts
    };
  }, [orders]);

  const { totalRevenue, totalOrders, averageOrderValue, recentSales, topProducts } = analyticsData;

  const chartData = {
    labels: recentSales.map(item => item.date),
    datasets: [
      {
        label: 'Revenue ($)',
        data: recentSales.map(item => item.amount),
        borderColor: '#c9a84c',
        backgroundColor: 'rgba(201, 168, 76, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1a1612',
        titleColor: '#c9a84c',
        bodyColor: '#fff',
        borderColor: '#c9a84c',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          callback: (value) => '$' + value
        }
      }
    }
  };

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Sales & Orders Overview</h2>
        <p style={{ color: 'var(--text-muted)' }}>Track your sanctuary's performance</p>
      </div>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="stat-card" style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="stat-icon" style={{ padding: '10px', background: 'rgba(201, 168, 76, 0.1)', borderRadius: '8px', color: 'var(--accent-gold)' }}><DollarSign size={24} /></div>
          <div className="stat-info">
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Total Revenue</h3>
            <p className="stat-value" style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>${totalRevenue.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="stat-card" style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="stat-icon" style={{ padding: '10px', background: 'rgba(201, 168, 76, 0.1)', borderRadius: '8px', color: 'var(--accent-gold)' }}><Package size={24} /></div>
          <div className="stat-info">
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Total Orders</h3>
            <p className="stat-value" style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>{totalOrders}</p>
          </div>
        </div>

        <div className="stat-card" style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="stat-icon" style={{ padding: '10px', background: 'rgba(201, 168, 76, 0.1)', borderRadius: '8px', color: 'var(--accent-gold)' }}><TrendingUp size={24} /></div>
          <div className="stat-info">
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Avg. Order Value</h3>
            <p className="stat-value" style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>${averageOrderValue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="charts-container" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="chart-box" style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Revenue Trend (Last 7 Days)</h3>
          <div className="chart-wrapper" style={{ height: '300px', width: '100%' }}>
            {recentSales.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="no-data" style={{ color: 'var(--text-muted)', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No recent sales data</div>
            )}
          </div>
        </div>

        <div className="top-products-box" style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Top Selling Products</h3>
          {topProducts.length > 0 ? (
            <ul className="top-products-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {topProducts.map((product, index) => (
                <li key={index} className="top-product-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span className="product-rank" style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>#{index + 1}</span>
                    <span className="product-name" style={{ color: 'var(--text-primary)' }}>{product.name}</span>
                  </div>
                  <span className="product-sales" style={{ color: 'var(--text-muted)' }}>{product.count} sold</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-data" style={{ color: 'var(--text-muted)' }}>No products sold yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
