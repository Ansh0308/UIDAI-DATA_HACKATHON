'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, AlertTriangle, Users, MapPin, Activity, Download, Filter, RefreshCw } from 'lucide-react';

interface DashboardMetrics {
  totalEnrolment: number;
  demographicUpdates: number;
  biometricCoverage: number;
  highRiskDistricts: number;
  vulnerablePopulation: number;
  anomaliesDetected: number;
}

interface GeographicData {
  state: string;
  enrolments: number;
  updates: number;
  migrationRisk: number;
  vulnerability: number;
}

interface AgeGroupData {
  ageGroup: string;
  enrolments: number;
  updates: number;
  biometric: number;
}

interface TimeSeriesData {
  date: string;
  value: number;
  trend: number;
}

interface VulnerabilityData {
  category: string;
  score: number;
  count: number;
}

interface AnomalyData {
  district: string;
  state: string;
  anomalyScore: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export default function AadhaarAnalyticsDashboard() {
  const [selectedMetric, setSelectedMetric] = useState<string>('overview');
  const [dateRange, setDateRange] = useState<string>('90days');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Sample data - will be replaced with real API calls
  const metrics: DashboardMetrics = {
    totalEnrolment: 1234567890,
    demographicUpdates: 98765432,
    biometricCoverage: 87.5,
    highRiskDistricts: 127,
    vulnerablePopulation: 45678901,
    anomaliesDetected: 234,
  };

  const geographicData: GeographicData[] = [
    { state: 'Uttar Pradesh', enrolments: 185000000, updates: 12500000, migrationRisk: 72, vulnerability: 68 },
    { state: 'Maharashtra', enrolments: 120000000, updates: 9800000, migrationRisk: 45, vulnerability: 42 },
    { state: 'Bihar', enrolments: 105000000, updates: 8200000, migrationRisk: 85, vulnerability: 78 },
    { state: 'West Bengal', enrolments: 95000000, updates: 7600000, migrationRisk: 68, vulnerability: 65 },
    { state: 'Madhya Pradesh', enrolments: 85000000, updates: 6800000, migrationRisk: 62, vulnerability: 58 },
  ];

  const ageGroupData: AgeGroupData[] = [
    { ageGroup: 'Child (0-5)', enrolments: 52000000, updates: 3200000, biometric: 45 },
    { ageGroup: 'Child (6-17)', enrolments: 125000000, updates: 8900000, biometric: 68 },
    { ageGroup: 'Youth (18-25)', enrolments: 180000000, updates: 15600000, biometric: 82 },
    { ageGroup: 'Adult (26-40)', enrolments: 450000000, updates: 38900000, biometric: 85 },
    { ageGroup: 'Senior (41-60)', enrolments: 280000000, updates: 22300000, biometric: 72 },
    { ageGroup: 'Elderly (60+)', enrolments: 147000000, updates: 9800000, biometric: 48 },
  ];

  const timeSeriesData: TimeSeriesData[] = [
    { date: 'Jan', value: 4000, trend: 2400 },
    { date: 'Feb', value: 3000, trend: 1398 },
    { date: 'Mar', value: 2000, trend: 9800 },
    { date: 'Apr', value: 2780, trend: 3908 },
    { date: 'May', value: 1890, trend: 4800 },
    { date: 'Jun', value: 2390, trend: 3800 },
  ];

  const vulnerabilityData: VulnerabilityData[] = [
    { category: 'Geographic Isolation', score: 78, count: 45 },
    { category: 'Age-Related Gaps', score: 82, count: 67 },
    { category: 'Biometric Deficiency', score: 65, count: 34 },
    { category: 'Migration Strain', score: 71, count: 52 },
    { category: 'Digital Exclusion', score: 88, count: 78 },
  ];

  const anomalies: AnomalyData[] = [
    { district: 'District A', state: 'State 1', anomalyScore: 0.92, severity: 'critical' },
    { district: 'District B', state: 'State 2', anomalyScore: 0.78, severity: 'high' },
    { district: 'District C', state: 'State 3', anomalyScore: 0.65, severity: 'medium' },
    { district: 'District D', state: 'State 4', anomalyScore: 0.45, severity: 'medium' },
    { district: 'District E', state: 'State 5', anomalyScore: 0.34, severity: 'low' },
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleExport = () => {
    console.log('Exporting dashboard data...');
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-850 text-slate-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
              Aadhaar Analytics
            </h1>
            <p className="text-slate-400">Societal Trends, Migration Patterns & System Health</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex gap-2">
            <span className="text-sm text-slate-400 self-center">Period:</span>
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 hover:border-slate-600"
            >
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="1year">Last year</option>
              <option value="all">All time</option>
            </select>
          </div>
          <div className="flex gap-2">
            <span className="text-sm text-slate-400 self-center">State:</span>
            <select 
              value={selectedState} 
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 hover:border-slate-600"
            >
              <option value="all">All States</option>
              <option value="up">Uttar Pradesh</option>
              <option value="mh">Maharashtra</option>
              <option value="br">Bihar</option>
              <option value="wb">West Bengal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              Total Enrolment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">
              {(metrics.totalEnrolment / 1000000000).toFixed(1)}B
            </div>
            <p className="text-xs text-slate-500 mt-2">Active Aadhaar holders</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Demographic Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-400">
              {(metrics.demographicUpdates / 1000000).toFixed(0)}M
            </div>
            <p className="text-xs text-slate-500 mt-2">Address/Name changes</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 hover:border-green-500/50 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              Biometric Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">
              {metrics.biometricCoverage.toFixed(1)}%
            </div>
            <p className="text-xs text-slate-500 mt-2">System health index</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 hover:border-red-500/50 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              High-Risk Districts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">
              {metrics.highRiskDistricts}
            </div>
            <p className="text-xs text-slate-500 mt-2">Requiring intervention</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-400" />
              Vulnerable Population
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400">
              {(metrics.vulnerablePopulation / 1000000).toFixed(0)}M
            </div>
            <p className="text-xs text-slate-500 mt-2">At-risk individuals</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 hover:border-yellow-500/50 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              Anomalies Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">
              {metrics.anomaliesDetected}
            </div>
            <p className="text-xs text-slate-500 mt-2">Data irregularities</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-700 mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">Overview</TabsTrigger>
          <TabsTrigger value="migration" className="data-[state=active]:bg-blue-600">Migration</TabsTrigger>
          <TabsTrigger value="vulnerability" className="data-[state=active]:bg-blue-600">Vulnerability</TabsTrigger>
          <TabsTrigger value="anomalies" className="data-[state=active]:bg-blue-600">Anomalies</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Time Series Chart */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">Enrolment Trend</CardTitle>
                <CardDescription>Monthly Aadhaar generation</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={timeSeriesData}>
                    <defs>
                      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUv)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Age Group Distribution */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">Age Group Distribution</CardTitle>
                <CardDescription>Enrolment by age category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ageGroupData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="ageGroup" angle={-45} textAnchor="end" height={80} stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    <Bar dataKey="enrolments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Geographic Heatmap */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg">Top States Performance</CardTitle>
              <CardDescription>Enrolment and update metrics by state</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-700">
                    <tr>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">State</th>
                      <th className="text-right py-3 px-4 text-slate-300 font-semibold">Enrolments</th>
                      <th className="text-right py-3 px-4 text-slate-300 font-semibold">Updates</th>
                      <th className="text-right py-3 px-4 text-slate-300 font-semibold">Migration Risk</th>
                      <th className="text-right py-3 px-4 text-slate-300 font-semibold">Vulnerability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {geographicData.map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="py-3 px-4">{row.state}</td>
                        <td className="text-right py-3 px-4 text-blue-400">{(row.enrolments / 1000000).toFixed(0)}M</td>
                        <td className="text-right py-3 px-4 text-cyan-400">{(row.updates / 1000000).toFixed(1)}M</td>
                        <td className="text-right py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${row.migrationRisk > 70 ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'}`}>
                            {row.migrationRisk}%
                          </span>
                        </td>
                        <td className="text-right py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${row.vulnerability > 65 ? 'bg-red-900/30 text-red-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                            {row.vulnerability}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Migration Tab */}
        <TabsContent value="migration" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle>Migration Risk Analysis</CardTitle>
              <CardDescription>Life-stage transitions and address changes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="enrolments" name="Enrolments" stroke="#94a3b8" />
                  <YAxis dataKey="migrationRisk" name="Migration Risk" stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
                  <Scatter name="States" data={geographicData} fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vulnerability Tab */}
        <TabsContent value="vulnerability" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Vulnerability Categories</CardTitle>
                <CardDescription>Social exclusion risk indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={vulnerabilityData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis type="number" stroke="#94a3b8" />
                    <YAxis dataKey="category" type="category" width={120} stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    <Bar dataKey="score" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Affected Population</CardTitle>
                <CardDescription>Count by vulnerability type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={vulnerabilityData} cx="50%" cy="50%" labelLine={false} label={({ category, count }) => `${category}: ${count}M`} outerRadius={100} fill="#8884d8" dataKey="count">
                      <Cell fill="#3b82f6" />
                      <Cell fill="#06b6d4" />
                      <Cell fill="#f59e0b" />
                      <Cell fill="#ef4444" />
                      <Cell fill="#8b5cf6" />
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Anomalies Tab */}
        <TabsContent value="anomalies" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle>Detected Anomalies</CardTitle>
              <CardDescription>Data irregularities requiring investigation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {anomalies.map((anomaly, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-slate-700/30 border-l-4" style={{ borderLeftColor: getSeverityColor(anomaly.severity) }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-200">{anomaly.district} ({anomaly.state})</h4>
                        <p className="text-sm text-slate-400 mt-1">Anomaly Score: {(anomaly.anomalyScore * 100).toFixed(1)}%</p>
                      </div>
                      <span className="px-2 py-1 rounded text-xs font-semibold" style={{ backgroundColor: getSeverityColor(anomaly.severity) + '20', color: getSeverityColor(anomaly.severity) }}>
                        {anomaly.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-slate-700 text-center text-sm text-slate-500">
        <p>Data updated: {new Date().toLocaleDateString()} | Last refresh: Just now</p>
        <p className="mt-2">For detailed insights and recommendations, refer to the comprehensive PDF report.</p>
      </div>
    </main>
  );
}
