import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Lock,
  LogOut,
  ShoppingBag,
  Users,
  Mail,
  Search,
  Download,
  Database,
  CheckCircle2,
  Clock,
  Truck,
  RefreshCcw,
  AlertCircle,
  Eye,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  TrendingUp,
  Inbox,
  Loader2,
} from 'lucide-react';

export const AdminDashboard = () => {
  const { isAdminOpen, setIsAdminOpen, formatPrice, showToast, theme } = useStore();
  const isDark = theme === 'dark';

  const [token, setToken] = useState(() => localStorage.getItem('kfb_admin_token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Login form state
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard state
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'subscribers' | 'contacts' | 'db'
  const [metrics, setMetrics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Filters & Search
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [subscriberSearch, setSubscriberSearch] = useState('');
  const [contactSearch, setContactSearch] = useState('');

  // Selected order expansion
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Backup status
  const [backupStatus, setBackupStatus] = useState(null);
  const [isBackingUp, setIsBackingUp] = useState(false);

  // Check auth on mount
  useEffect(() => {
    if (!isAdminOpen) return;

    const verifyToken = async () => {
      if (!token) {
        setIsAuthenticated(false);
        setCheckingAuth(false);
        return;
      }
      try {
        const res = await fetch('/api/admin/check-auth', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('kfb_admin_token');
          setToken('');
        }
      } catch (e) {
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    verifyToken();
  }, [isAdminOpen, token]);

  // Fetch dashboard data when authenticated
  useEffect(() => {
    if (isAuthenticated && isAdminOpen) {
      loadDashboardData();
    }
  }, [isAuthenticated, isAdminOpen, activeTab, orderStatusFilter]);

  const loadDashboardData = async () => {
    setLoadingData(true);
    try {
      // 1. Metrics
      const metricsRes = await fetch('/api/admin/metrics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const metricsData = await metricsRes.json();
      if (metricsData.status) setMetrics(metricsData.metrics);

      // 2. Orders
      if (activeTab === 'orders') {
        const url = `/api/admin/orders?search=${encodeURIComponent(orderSearch)}&status=${encodeURIComponent(orderStatusFilter)}`;
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data.status) setOrders(data.orders || []);
      }

      // 3. Subscribers
      if (activeTab === 'subscribers') {
        const url = `/api/admin/subscribers?search=${encodeURIComponent(subscriberSearch)}`;
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data.status) setSubscribers(data.subscribers || []);
      }

      // 4. Contacts
      if (activeTab === 'contacts') {
        const url = `/api/admin/contacts?search=${encodeURIComponent(contactSearch)}`;
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data.status) setContacts(data.contacts || []);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (res.ok && data.status && data.token) {
        localStorage.setItem('kfb_admin_token', data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        showToast('Welcome back, Admin!', 'success');
      } else {
        setLoginError(data.message || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setLoginError('Server communication error. Please check your connection.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {}
    localStorage.removeItem('kfb_admin_token');
    setToken('');
    setIsAuthenticated(false);
    showToast('Logged out of Admin Portal', 'info');
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch('/api/admin/orders/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await res.json();
      if (data.status) {
        showToast(`Order #${orderId} status set to "${newStatus}"`, 'success');
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (e) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleMarkContactReplied = async (id, status = 'Replied') => {
    try {
      const res = await fetch('/api/admin/contacts/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        showToast(`Inquiry marked as ${status}`, 'success');
        setContacts((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status } : c))
        );
      }
    } catch (e) {
      showToast('Error updating contact status', 'error');
    }
  };

  const handleManualBackup = async () => {
    setIsBackingUp(true);
    setBackupStatus(null);
    try {
      const res = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBackupStatus(data);
        showToast(`Database backup created: ${data.backupFile}`, 'success');
      } else {
        showToast(data.message || 'Backup failed', 'error');
      }
    } catch (err) {
      showToast('Backup request failed', 'error');
    } finally {
      setIsBackingUp(false);
    }
  };

  const downloadCsv = async (type) => {
    try {
      const res = await fetch(`/api/admin/export/${type}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kidsfashionbd-${type}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast(`Exported ${type} successfully!`, 'success');
    } catch (err) {
      showToast('Export failed', 'error');
    }
  };

  if (!isAdminOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200">
      <div className={`relative w-full max-w-6xl h-[94vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden text-left transition-colors duration-200 ${
        isDark ? 'bg-[#0E0E11] border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
      }`}>
        {/* Top Header */}
        <header className="p-4 sm:px-6 border-b border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between bg-neutral-50/50 dark:bg-[#09090B]/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-neutral-900 text-white dark:bg-[#F5EFEB] dark:text-black flex items-center justify-center font-serif font-bold text-sm shadow-md">
              KB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold uppercase tracking-wider font-mono">
                  Kids Fashion BD • Admin Console
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  SQLite Live
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 font-mono">
                Storefront Manager • Narayanganj Studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-xl text-neutral-500 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-xs flex items-center gap-1 font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}

            <button
              onClick={() => {
                setIsAdminOpen(false);
                if (window.location.hash === '#admin') {
                  history.pushState('', document.title, window.location.pathname + window.location.search);
                }
              }}
              className="p-2 rounded-xl text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        {checkingAuth ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#C5A059]" />
          </div>
        ) : !isAuthenticated ? (
          /* Login Screen */
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#141417] shadow-xl text-center space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-[#1E1E22] text-[#C5A059] flex items-center justify-center mx-auto border border-[#C5A059]/30">
                <Lock className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-xl font-bold font-serif">Admin Authentication</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Enter your credentials configured in your <code className="text-[#C5A059]">.env</code> file.
                </p>
              </div>

              {loginError && (
                <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs text-left flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-3.5 text-left">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    className="w-full bg-white dark:bg-[#09090B] border border-neutral-300 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter your .env ADMIN_PASSWORD"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full bg-white dark:bg-[#09090B] border border-neutral-300 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-neutral-900 text-white dark:bg-[#F5EFEB] dark:text-black py-3 rounded-full text-xs uppercase tracking-wider font-bold hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-2"
                >
                  {loginLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <span>Log In to Dashboard</span>
                  )}
                </button>
              </form>

              <p className="text-[10px] text-neutral-400">
                Secured with rate limiting & timing-safe session tokens.
              </p>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Quick Metrics Bar */}
            <div className="p-4 sm:px-6 grid grid-cols-2 sm:grid-cols-5 gap-3 border-b border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-[#0E0E11] shrink-0">
              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-[#141417] border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between text-neutral-500 text-[10px] uppercase font-bold">
                  <span>Total Orders</span>
                  <ShoppingBag className="w-3.5 h-3.5 text-[#C5A059]" />
                </div>
                <div className="text-xl font-bold font-mono mt-1 text-neutral-900 dark:text-white">
                  {metrics?.totalOrders || 0}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-[#141417] border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between text-neutral-500 text-[10px] uppercase font-bold">
                  <span>Gross Sales</span>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="text-xl font-bold font-mono mt-1 text-emerald-600 dark:text-emerald-400">
                  {formatPrice(metrics?.totalRevenue || 0)}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-[#141417] border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between text-neutral-500 text-[10px] uppercase font-bold">
                  <span>Pending Action</span>
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-xl font-bold font-mono mt-1 text-amber-600 dark:text-amber-400">
                  {metrics?.pendingOrders || 0}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-[#141417] border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between text-neutral-500 text-[10px] uppercase font-bold">
                  <span>Subscribers</span>
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <div className="text-xl font-bold font-mono mt-1 text-blue-600 dark:text-blue-400">
                  {metrics?.totalSubscribers || 0}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-[#141417] border border-neutral-200 dark:border-neutral-800 col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between text-neutral-500 text-[10px] uppercase font-bold">
                  <span>Unread Queries</span>
                  <Inbox className="w-3.5 h-3.5 text-purple-500" />
                </div>
                <div className="text-xl font-bold font-mono mt-1 text-purple-600 dark:text-purple-400">
                  {metrics?.unreadMessages || 0}
                </div>
              </div>
            </div>

            {/* Navigation Tabs & Actions */}
            <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-neutral-200 dark:border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 shrink-0 bg-neutral-50/40 dark:bg-[#09090B]/30">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {[
                  { id: 'orders', label: 'Orders', icon: ShoppingBag, count: metrics?.totalOrders },
                  { id: 'subscribers', label: 'Newsletter', icon: Mail, count: metrics?.totalSubscribers },
                  { id: 'contacts', label: 'Customer Queries', icon: Inbox, count: metrics?.unreadMessages },
                  { id: 'db', label: 'Database & Backups', icon: Database },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-neutral-900 text-white dark:bg-[#F5EFEB] dark:text-black shadow-sm'
                          : 'text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                      {tab.count !== undefined && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          activeTab === tab.id
                            ? 'bg-white/20 dark:bg-black/20 text-current'
                            : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Export Button */}
              {activeTab !== 'db' && (
                <button
                  onClick={() => downloadCsv(activeTab)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 hover:border-neutral-500 text-xs font-bold transition-colors cursor-pointer bg-white dark:bg-[#141417] shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Export CSV</span>
                </button>
              )}
            </div>

            {/* Tab Panels */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* TAB 1: ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="Search by Order ID, Customer Name, Phone, or TrxID..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        className="w-full bg-white dark:bg-[#141417] border border-neutral-300 dark:border-neutral-800 rounded-full pl-9 pr-4 py-2 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      {['', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setOrderStatusFilter(st)}
                          className={`text-[11px] px-3 py-1 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap ${
                            orderStatusFilter === st
                              ? 'bg-[#C5A059] text-black font-bold'
                              : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                          }`}
                        >
                          {st || 'All Statuses'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Orders Table */}
                  {loadingData ? (
                    <div className="p-12 text-center">
                      <Loader2 className="w-6 h-6 animate-spin text-[#C5A059] mx-auto mb-2" />
                      <p className="text-xs text-neutral-500">Loading stored orders from SQLite...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="p-12 text-center rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800">
                      <ShoppingBag className="w-10 h-10 text-neutral-400 mx-auto mb-2 opacity-50" />
                      <h4 className="text-sm font-bold">No orders found</h4>
                      <p className="text-xs text-neutral-500 mt-1">
                        When users place orders on the site, they will be persisted in SQLite and appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-[#141417]">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-neutral-50 dark:bg-[#09090B] border-b border-neutral-200 dark:border-neutral-800 font-mono text-neutral-500 uppercase text-[10px]">
                            <tr>
                              <th className="p-3">Order ID</th>
                              <th className="p-3">Date</th>
                              <th className="p-3">Customer</th>
                              <th className="p-3">Area</th>
                              <th className="p-3">Payment</th>
                              <th className="p-3">Status</th>
                              <th className="p-3 text-right">Total</th>
                              <th className="p-3 text-center">Details</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                            {orders.map((o) => (
                              <React.Fragment key={o.orderId}>
                                <tr className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors">
                                  <td className="p-3 font-mono font-bold text-[#C5A059]">
                                    {o.orderId}
                                  </td>
                                  <td className="p-3 text-neutral-500 whitespace-nowrap">
                                    {new Date(o.createdAt).toLocaleDateString()}
                                  </td>
                                  <td className="p-3">
                                    <div className="font-bold text-neutral-900 dark:text-white">
                                      {o.customer.name}
                                    </div>
                                    <div className="text-[11px] font-mono text-neutral-500">
                                      {o.customer.phone}
                                    </div>
                                  </td>
                                  <td className="p-3 text-neutral-600 dark:text-neutral-300">
                                    {o.customer.cityArea}, {o.customer.division}
                                  </td>
                                  <td className="p-3">
                                    <div className="font-medium text-[11px]">{o.payment.method}</div>
                                    <div className="text-[10px] text-neutral-400 font-mono">
                                      {o.payment.trxId ? `Trx: ${o.payment.trxId}` : o.payment.status}
                                    </div>
                                  </td>
                                  <td className="p-3">
                                    <select
                                      value={o.status}
                                      onChange={(e) => handleUpdateOrderStatus(o.orderId, e.target.value)}
                                      className={`px-2 py-1 rounded-lg text-[11px] font-bold border outline-none cursor-pointer ${
                                        o.status === 'Delivered'
                                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                                          : o.status === 'Shipped'
                                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-300'
                                          : o.status === 'Cancelled'
                                          ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-300'
                                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300'
                                      }`}
                                    >
                                      <option value="Pending">Pending</option>
                                      <option value="Processing">Processing</option>
                                      <option value="Shipped">Shipped</option>
                                      <option value="Delivered">Delivered</option>
                                      <option value="Cancelled">Cancelled</option>
                                    </select>
                                  </td>
                                  <td className="p-3 text-right font-mono font-bold text-neutral-900 dark:text-white">
                                    {formatPrice(o.total)}
                                  </td>
                                  <td className="p-3 text-center">
                                    <button
                                      onClick={() =>
                                        setExpandedOrderId(
                                          expandedOrderId === o.orderId ? null : o.orderId
                                        )
                                      }
                                      className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors text-neutral-500 cursor-pointer"
                                      title="View order items & address"
                                    >
                                      {expandedOrderId === o.orderId ? (
                                        <ChevronUp className="w-4 h-4" />
                                      ) : (
                                        <ChevronDown className="w-4 h-4" />
                                      )}
                                    </button>
                                  </td>
                                </tr>

                                {/* Expanded Order Details */}
                                {expandedOrderId === o.orderId && (
                                  <tr className="bg-neutral-100/60 dark:bg-[#0A0A0D]">
                                    <td colSpan={8} className="p-4">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                        <div className="space-y-2">
                                          <div className="font-bold uppercase tracking-wider text-[10px] text-neutral-500 font-mono">
                                            Shipping Details
                                          </div>
                                          <p><strong>Address:</strong> {o.customer.address}</p>
                                          <p><strong>Email:</strong> {o.customer.email || 'N/A'}</p>
                                          {o.customer.notes && (
                                            <p><strong>Notes:</strong> {o.customer.notes}</p>
                                          )}
                                          <p>
                                            <strong>Promo Code:</strong> {o.promoCode || 'None'} {o.discount > 0 ? `(Saved ৳${o.discount})` : ''}
                                          </p>
                                        </div>

                                        <div className="space-y-2">
                                          <div className="font-bold uppercase tracking-wider text-[10px] text-neutral-500 font-mono">
                                            Purchased Items ({o.items?.length || 0})
                                          </div>
                                          <div className="space-y-1">
                                            {o.items?.map((item, idx) => (
                                              <div
                                                key={idx}
                                                className="flex justify-between items-center py-1 border-b border-neutral-200 dark:border-neutral-800"
                                              >
                                                <span>
                                                  {item.product?.name} ({item.size}, {item.color?.name}) x{item.quantity}
                                                </span>
                                                <span className="font-mono">
                                                  {formatPrice((item.product?.price || 0) * item.quantity)}
                                                </span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: NEWSLETTER SUBSCRIBERS */}
              {activeTab === 'subscribers' && (
                <div className="space-y-4">
                  <div className="relative max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search subscriber emails..."
                      value={subscriberSearch}
                      onChange={(e) => setSubscriberSearch(e.target.value)}
                      className="w-full bg-white dark:bg-[#141417] border border-neutral-300 dark:border-neutral-800 rounded-full pl-9 pr-4 py-2 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-[#141417]">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-neutral-50 dark:bg-[#09090B] border-b border-neutral-200 dark:border-neutral-800 font-mono text-neutral-500 uppercase text-[10px]">
                        <tr>
                          <th className="p-3">#</th>
                          <th className="p-3">Subscriber Email</th>
                          <th className="p-3">Date Subscribed</th>
                          <th className="p-3">IP Address</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                        {subscribers.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-neutral-500">
                              No subscribers found yet.
                            </td>
                          </tr>
                        ) : (
                          subscribers.map((s, idx) => (
                            <tr key={s.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30">
                              <td className="p-3 font-mono text-neutral-400">{idx + 1}</td>
                              <td className="p-3 font-bold text-neutral-900 dark:text-white">
                                {s.email}
                              </td>
                              <td className="p-3 text-neutral-500 font-mono">
                                {new Date(s.created_at).toLocaleString()}
                              </td>
                              <td className="p-3 font-mono text-neutral-400">
                                {s.ip_address || 'N/A'}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: CUSTOMER QUERIES */}
              {activeTab === 'contacts' && (
                <div className="space-y-4">
                  <div className="relative max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search customer inquiries..."
                      value={contactSearch}
                      onChange={(e) => setContactSearch(e.target.value)}
                      className="w-full bg-white dark:bg-[#141417] border border-neutral-300 dark:border-neutral-800 rounded-full pl-9 pr-4 py-2 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {contacts.length === 0 ? (
                      <div className="col-span-2 p-8 text-center text-neutral-500 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl">
                        No contact inquiries yet.
                      </div>
                    ) : (
                      contacts.map((c) => (
                        <div
                          key={c.id}
                          className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141417] space-y-2.5 shadow-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-neutral-900 dark:text-white">
                              {c.name}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              c.status === 'Replied'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            }`}>
                              {c.status}
                            </span>
                          </div>

                          <div className="text-[11px] text-neutral-500 font-mono flex flex-wrap gap-3">
                            {c.phone && <span>📞 {c.phone}</span>}
                            {c.email && <span>✉️ {c.email}</span>}
                            <span>📅 {new Date(c.created_at).toLocaleDateString()}</span>
                          </div>

                          <div className="text-xs text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-[#09090B] p-3 rounded-xl border border-neutral-200 dark:border-neutral-800/60 leading-relaxed">
                            <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                              Topic: {c.subject}
                            </span>
                            {c.message}
                          </div>

                          {c.status !== 'Replied' && (
                            <button
                              onClick={() => handleMarkContactReplied(c.id, 'Replied')}
                              className="text-xs font-bold text-[#C5A059] hover:underline cursor-pointer"
                            >
                              ✓ Mark as Replied
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: DATABASE & BACKUPS */}
              {activeTab === 'db' && (
                <div className="max-w-3xl space-y-6">
                  <div className="p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141417] space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-[#1E1E22] text-[#C5A059] flex items-center justify-center border border-[#C5A059]/30">
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">SQLite Database Architecture</h4>
                        <p className="text-xs text-neutral-500">Persistent storage engine configured for Kids Fashion BD</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#09090B] border border-neutral-200 dark:border-neutral-800 font-mono text-[11px]">
                        <span className="text-neutral-400 block mb-1">Active Database Location:</span>
                        <strong className="text-emerald-600 dark:text-emerald-400">
                          {metrics?.dbPath || './data/kidsfashionbd.sqlite'}
                        </strong>
                      </div>

                      <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#09090B] border border-neutral-200 dark:border-neutral-800 font-mono text-[11px]">
                        <span className="text-neutral-400 block mb-1">Automated Daily Backups:</span>
                        <span className="text-neutral-700 dark:text-neutral-300">
                          Scheduled every 24 hours into <code>data/backups/</code> (keeps rolling 7 days).
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleManualBackup}
                        disabled={isBackingUp}
                        className="bg-neutral-900 text-white dark:bg-[#F5EFEB] dark:text-black px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isBackingUp ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Creating Backup...</span>
                          </>
                        ) : (
                          <>
                            <RefreshCcw className="w-3.5 h-3.5" />
                            <span>Create Backup Now</span>
                          </>
                        )}
                      </button>

                      {backupStatus && (
                        <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs">
                          ✓ Backup successfully saved: <strong>{backupStatus.backupFile}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
