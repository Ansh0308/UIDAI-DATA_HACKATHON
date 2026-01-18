import { NextRequest, NextResponse } from 'next/server';

interface AnalyticsQuery {
  metric?: string;
  state?: string;
  dateRange?: string;
  format?: 'json' | 'csv';
}

// Mock data generators
function generateMockData(query: AnalyticsQuery) {
  const baseMetrics = {
    totalEnrolment: 1234567890,
    demographicUpdates: 98765432,
    biometricCoverage: 87.5,
    highRiskDistricts: 127,
    vulnerablePopulation: 45678901,
    anomaliesDetected: 234,
  };

  const geographicData = [
    {
      state: 'Uttar Pradesh',
      enrolments: 185000000,
      updates: 12500000,
      migrationRisk: 72,
      vulnerability: 68,
    },
    {
      state: 'Maharashtra',
      enrolments: 120000000,
      updates: 9800000,
      migrationRisk: 45,
      vulnerability: 42,
    },
    {
      state: 'Bihar',
      enrolments: 105000000,
      updates: 8200000,
      migrationRisk: 85,
      vulnerability: 78,
    },
    {
      state: 'West Bengal',
      enrolments: 95000000,
      updates: 7600000,
      migrationRisk: 68,
      vulnerability: 65,
    },
    {
      state: 'Madhya Pradesh',
      enrolments: 85000000,
      updates: 6800000,
      migrationRisk: 62,
      vulnerability: 58,
    },
  ];

  const ageGroupData = [
    { ageGroup: 'Child (0-5)', enrolments: 52000000, updates: 3200000, biometric: 45 },
    { ageGroup: 'Child (6-17)', enrolments: 125000000, updates: 8900000, biometric: 68 },
    { ageGroup: 'Youth (18-25)', enrolments: 180000000, updates: 15600000, biometric: 82 },
    { ageGroup: 'Adult (26-40)', enrolments: 450000000, updates: 38900000, biometric: 85 },
    { ageGroup: 'Senior (41-60)', enrolments: 280000000, updates: 22300000, biometric: 72 },
    { ageGroup: 'Elderly (60+)', enrolments: 147000000, updates: 9800000, biometric: 48 },
  ];

  const vulnerabilityData = [
    { category: 'Geographic Isolation', score: 78, count: 45 },
    { category: 'Age-Related Gaps', score: 82, count: 67 },
    { category: 'Biometric Deficiency', score: 65, count: 34 },
    { category: 'Migration Strain', score: 71, count: 52 },
    { category: 'Digital Exclusion', score: 88, count: 78 },
  ];

  const anomalies = [
    {
      district: 'District A',
      state: 'State 1',
      anomalyScore: 0.92,
      severity: 'critical',
    },
    {
      district: 'District B',
      state: 'State 2',
      anomalyScore: 0.78,
      severity: 'high',
    },
    {
      district: 'District C',
      state: 'State 3',
      anomalyScore: 0.65,
      severity: 'medium',
    },
  ];

  return {
    metrics: baseMetrics,
    geographic: geographicData,
    ageGroups: ageGroupData,
    vulnerability: vulnerabilityData,
    anomalies: anomalies,
    timestamp: new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const query: AnalyticsQuery = {
      metric: searchParams.get('metric') || 'all',
      state: searchParams.get('state') || 'all',
      dateRange: searchParams.get('dateRange') || '90days',
      format: (searchParams.get('format') as 'json' | 'csv') || 'json',
    };

    // Generate mock data
    const data = generateMockData(query);

    // Filter by specific metric if requested
    if (query.metric && query.metric !== 'all') {
      const metricData: Record<string, unknown> = {};
      if (query.metric === 'geographic') {
        metricData[query.metric] = data.geographic;
      } else if (query.metric === 'ageGroups') {
        metricData[query.metric] = data.ageGroups;
      } else if (query.metric === 'vulnerability') {
        metricData[query.metric] = data.vulnerability;
      }
      return NextResponse.json(metricData);
    }

    // Return full data
    return NextResponse.json(data);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request
    if (!body.type || !body.filters) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Generate custom report data based on filters
    const data = generateMockData(body.filters);

    return NextResponse.json({
      success: true,
      data: data,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Analytics POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process analytics request' },
      { status: 500 }
    );
  }
}
