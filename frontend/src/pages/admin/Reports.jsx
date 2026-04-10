// src/pages/admin/Reports.jsx
import { useState, useEffect } from 'react';
import API from '../../api/axios';

const categoryEmoji = { Facial: '💆', Bridal: '👰', Mehndi: '🌿', Stitching: '🧵' };
const categoryColor = { Facial: '#e8637a', Bridal: '#c9973a', Mehndi: '#4caf50', Stitching: '#9c27b0' };

export default function Reports() {
  const [data, setData]     = useState({ dailyEarnings: [], categoryStats: [] });
  const [loading, setLoading] = useState(true);
  const [range, setRange]   = useState({ startDate: '', endDate: '' });

  const fetchReports = () => {
    setLoading(true);
    const params = range.startDate && range.endDate
      ? `?startDate=${range.startDate}&endDate=${range.endDate}` : '';
    API.get(`/admin/reports${params}`).then(({ data: d }) => setData(d)).finally(() => setLoading(false));
  };

  useEffect(fetchReports, []);

  const totalEarnings = data.dailyEarnings.reduce((sum, d) => sum + d.earnings, 0);
  const totalBookings = data.dailyEarnings.reduce((sum, d) => sum + d.count, 0);
  const topCategory   = data.categoryStats.sort((a, b) => b.revenue - a.revenue)[0];

  const maxEarning = Math.max(...data.dailyEarnings.map(d => d.earnings), 1);

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 1100 }}>
        <h1 style={styles.title}>📊 Reports & Analytics</h1>

        {/* Date Range Filter */}
        <div style={styles.filterRow}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label className="form-label">From</label>
              <input type="date" className="form-input" style={{ width: 160 }} value={range.startDate} onChange={e => setRange(r => ({ ...r, startDate: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">To</label>
              <input type="date" className="form-input" style={{ width: 160 }} value={range.endDate} onChange={e => setRange(r => ({ ...r, endDate: e.target.value }))} />
            </div>
            <button onClick={fetchReports} className="btn btn-primary" style={{ marginTop: 20 }}>Apply Filter</button>
            <button onClick={() => { setRange({ startDate: '', endDate: '' }); setTimeout(fetchReports, 0); }} className="btn btn-outline" style={{ marginTop: 20 }}>Reset</button>
          </div>
        </div>

        {loading ? <div className="spinner" /> : (
          <>
            {/* Summary Cards */}
            <div style={styles.summaryGrid}>
              <div style={styles.summaryCard}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>💰</div>
                <div style={styles.summaryVal}>₹{totalEarnings.toLocaleString('en-IN')}</div>
                <div style={styles.summaryLabel}>Total Revenue Collected</div>
              </div>
              <div style={styles.summaryCard}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
                <div style={styles.summaryVal}>{totalBookings}</div>
                <div style={styles.summaryLabel}>Total Bookings</div>
              </div>
              <div style={styles.summaryCard}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📈</div>
                <div style={styles.summaryVal}>₹{totalBookings ? Math.round(totalEarnings / totalBookings) : 0}</div>
                <div style={styles.summaryLabel}>Average Per Booking</div>
              </div>
              <div style={styles.summaryCard}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{categoryEmoji[topCategory?._id] || '🏆'}</div>
                <div style={styles.summaryVal}>{topCategory?._id || '—'}</div>
                <div style={styles.summaryLabel}>Top Category</div>
              </div>
            </div>

            {/* Daily Earnings Bar Chart (CSS-based) */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Daily Earnings (Last 30 Days)</h2>
              {data.dailyEarnings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#7a5560' }}>No earnings data available for selected range</div>
              ) : (
                <div style={styles.barChart}>
                  {[...data.dailyEarnings].reverse().map(d => (
                    <div key={d._id} style={styles.barWrap}>
                      <div style={styles.barAmount}>₹{d.earnings >= 1000 ? (d.earnings / 1000).toFixed(1) + 'k' : d.earnings}</div>
                      <div style={{ ...styles.bar, height: `${Math.max(4, (d.earnings / maxEarning) * 140)}px` }} />
                      <div style={styles.barDate}>{d._id.slice(5)}</div>
                      <div style={styles.barCount}>{d.count} booking{d.count !== 1 ? 's' : ''}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category Stats */}
            <div style={styles.twoCol}>
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Category Performance</h2>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      {['Category', 'Bookings', 'Revenue'].map(h => <th key={h} style={styles.th}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {data.categoryStats.length === 0 ? (
                      <tr><td colSpan={3} style={{ textAlign: 'center', padding: 24, color: '#7a5560' }}>No data</td></tr>
                    ) : data.categoryStats.map(c => (
                      <tr key={c._id} style={styles.tr}>
                        <td style={styles.td}>
                          <span style={{ ...styles.catBadge, background: (categoryColor[c._id] || '#999') + '20', color: categoryColor[c._id] || '#999' }}>
                            {categoryEmoji[c._id]} {c._id}
                          </span>
                        </td>
                        <td style={styles.td}>{c.count}</td>
                        <td style={{ ...styles.td, fontWeight: 700, color: 'var(--rose)' }}>₹{c.revenue.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Booking History Table */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Day-by-Day Summary</h2>
                <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        {['Date', 'Bookings', 'Earned'].map(h => <th key={h} style={styles.th}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {data.dailyEarnings.length === 0 ? (
                        <tr><td colSpan={3} style={{ textAlign: 'center', padding: 24, color: '#7a5560' }}>No data</td></tr>
                      ) : data.dailyEarnings.map(d => (
                        <tr key={d._id} style={styles.tr}>
                          <td style={styles.td}>{new Date(d._id).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                          <td style={styles.td}>{d.count}</td>
                          <td style={{ ...styles.td, fontWeight: 700, color: '#2e7d32' }}>₹{d.earnings}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  title: { fontSize: 30, marginBottom: 24 },
  filterRow: { background: '#fff', border: '1px solid #f0dde2', borderRadius: 14, padding: '18px 22px', marginBottom: 24 },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 },
  summaryCard: { background: '#fff', border: '1px solid #f0dde2', borderRadius: 14, padding: '22px', textAlign: 'center' },
  summaryVal: { fontSize: 28, fontWeight: 800, color: 'var(--rose)', fontFamily: "'Playfair Display', serif", marginBottom: 6 },
  summaryLabel: { fontSize: 13, color: '#7a5560' },
  section: { background: '#fff', border: '1px solid #f0dde2', borderRadius: 14, padding: '22px', marginBottom: 20 },
  sectionTitle: { fontSize: 18, marginBottom: 20, borderBottom: '1px solid #f0dde2', paddingBottom: 12 },
  barChart: { display: 'flex', alignItems: 'flex-end', gap: 8, overflowX: 'auto', paddingBottom: 8, minHeight: 180 },
  barWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 40 },
  barAmount: { fontSize: 10, color: '#7a5560', marginBottom: 4, fontWeight: 600 },
  bar: { width: 28, background: 'linear-gradient(to top, #c94d65, #e8637a)', borderRadius: '4px 4px 0 0', transition: 'height 0.3s' },
  barDate: { fontSize: 9, color: '#7a5560', marginTop: 4, fontWeight: 500 },
  barCount: { fontSize: 9, color: '#c0a0a8' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '10px 14px', background: '#fafafa', fontSize: 12, fontWeight: 700, color: '#7a5560', textAlign: 'left', textTransform: 'uppercase', letterSpacing: 0.5 },
  tr: { borderBottom: '1px solid #f8f2f4' },
  td: { padding: '12px 14px', fontSize: 14, color: '#3d1f28' },
  catBadge: { padding: '4px 10px', borderRadius: 20, fontSize: 13, fontWeight: 600 },
};
