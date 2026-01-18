"""
Machine Learning Models for Aadhaar Analysis
- Anomaly Detection (Isolation Forest, Local Outlier Factor)
- Time Series Forecasting (ARIMA, Prophet)
- Vulnerability Clustering (K-means, Hierarchical)
- Predictive Analytics
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Tuple, Optional
from datetime import datetime, timedelta
import logging
import warnings

warnings.filterwarnings('ignore')
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AnomalyDetector:
    """Detect anomalies in Aadhaar datasets using multiple algorithms"""
    
    def __init__(self):
        self.isolation_forest = None
        self.lof = None
        self.scaler = None
        self.feature_importance = {}
    
    def detect_isolation_forest(self, X: pd.DataFrame, 
                               contamination: float = 0.05) -> np.ndarray:
        """Detect anomalies using Isolation Forest"""
        try:
            from sklearn.ensemble import IsolationForest
            from sklearn.preprocessing import StandardScaler
            
            # Scale features
            scaler = StandardScaler()
            X_scaled = scaler.fit_transform(X.fillna(0))
            
            # Train model
            iso_forest = IsolationForest(
                contamination=contamination,
                random_state=42,
                n_estimators=100
            )
            predictions = iso_forest.fit_predict(X_scaled)
            
            # -1 = anomaly, 1 = normal
            self.isolation_forest = iso_forest
            self.scaler = scaler
            
            return predictions
        except Exception as e:
            logger.error(f"Error in Isolation Forest: {e}")
            return np.ones(len(X))
    
    def detect_lof(self, X: pd.DataFrame, n_neighbors: int = 20) -> np.ndarray:
        """Detect anomalies using Local Outlier Factor"""
        try:
            from sklearn.neighbors import LocalOutlierFactor
            from sklearn.preprocessing import StandardScaler
            
            scaler = StandardScaler()
            X_scaled = scaler.fit_transform(X.fillna(0))
            
            lof = LocalOutlierFactor(n_neighbors=n_neighbors)
            predictions = lof.fit_predict(X_scaled)
            
            self.lof = lof
            return predictions
        except Exception as e:
            logger.error(f"Error in LOF: {e}")
            return np.ones(len(X))
    
    def get_anomaly_scores(self, X: pd.DataFrame) -> np.ndarray:
        """Get anomaly scores (0-1, higher = more anomalous)"""
        try:
            from sklearn.preprocessing import StandardScaler
            
            scaler = StandardScaler()
            X_scaled = scaler.fit_transform(X.fillna(0))
            
            if self.isolation_forest is not None:
                scores = -self.isolation_forest.score_samples(X_scaled)
                # Normalize to 0-1
                scores = (scores - scores.min()) / (scores.max() - scores.min() + 1e-6)
                return scores
            else:
                return np.zeros(len(X))
        except Exception as e:
            logger.error(f"Error getting anomaly scores: {e}")
            return np.zeros(len(X))


class VulnerabilityAnalyzer:
    """Analyze vulnerability patterns in Aadhaar enrolment"""
    
    def __init__(self):
        self.vulnerability_model = None
        self.scaler = None
    
    def calculate_vulnerability_score(self, df: pd.DataFrame) -> pd.Series:
        """
        Calculate vulnerability score based on:
        - Age group (children < 18, elderly > 60)
        - Geographic isolation (low enrolment density)
        - Biometric gaps (missing updates)
        - Migration risk (address changes)
        """
        vulnerability_scores = pd.Series(0, index=df.index, dtype=float)
        
        # Age vulnerability (0-40 points)
        if 'Age_Group' in df.columns:
            age_vuln = df['Age_Group'].apply(self._age_vulnerability_score)
            vulnerability_scores += age_vuln * 0.4
        
        # Geographic vulnerability (0-30 points)
        if 'State' in df.columns and 'Enrolment_Count' in df.columns:
            geo_vuln = self._geographic_vulnerability(df['Enrolment_Count'])
            vulnerability_scores += geo_vuln * 0.3
        
        # Biometric vulnerability (0-20 points)
        if 'Biometric_Updates' in df.columns:
            bio_vuln = self._biometric_vulnerability(df['Biometric_Updates'])
            vulnerability_scores += bio_vuln * 0.2
        
        # Migration vulnerability (0-10 points)
        if 'Demographic_Updates' in df.columns:
            mig_vuln = self._migration_vulnerability(df['Demographic_Updates'])
            vulnerability_scores += mig_vuln * 0.1
        
        return vulnerability_scores
    
    def _age_vulnerability_score(self, age_group: str) -> float:
        """Score vulnerability by age group"""
        vulnerability_map = {
            'Child (0-5)': 1.0,    # Highest - No legal identity
            'Child (6-17)': 0.9,   # Very high - Limited documentation
            'Youth (18-25)': 0.3,  # Low
            'Adult (26-40)': 0.2,  # Very low
            'Senior (41-60)': 0.3, # Low
            'Elderly (60+)': 0.8,  # Very high - Digital exclusion
        }
        return vulnerability_map.get(age_group, 0.5)
    
    def _geographic_vulnerability(self, enrolment: pd.Series) -> np.ndarray:
        """Geographic vulnerability based on enrolment density"""
        # Lower enrolment = higher vulnerability
        normalized = (enrolment.max() - enrolment) / (enrolment.max() - enrolment.min() + 1e-6)
        return normalized.fillna(0.5).values
    
    def _biometric_vulnerability(self, biometric_updates: pd.Series) -> np.ndarray:
        """Biometric vulnerability based on update coverage"""
        # Lower updates = higher vulnerability
        normalized = 1 - (biometric_updates / (biometric_updates.max() + 1e-6))
        return normalized.fillna(0.5).values
    
    def _migration_vulnerability(self, demographic_updates: pd.Series) -> np.ndarray:
        """Migration vulnerability based on demographic changes"""
        # Higher updates = higher migration risk
        normalized = demographic_updates / (demographic_updates.max() + 1e-6)
        return normalized.fillna(0.5).values
    
    def identify_vulnerable_populations(self, df: pd.DataFrame,
                                       threshold: float = 0.7) -> pd.DataFrame:
        """Identify high-vulnerability populations"""
        df = df.copy()
        df['Vulnerability_Score'] = self.calculate_vulnerability_score(df)
        
        vulnerable = df[df['Vulnerability_Score'] >= threshold]
        return vulnerable.sort_values('Vulnerability_Score', ascending=False)


class TimeSeriesForecaster:
    """Forecast trends in Aadhaar enrolment and updates"""
    
    def __init__(self):
        self.arima_model = None
        self.prophet_model = None
    
    def prepare_time_series(self, df: pd.DataFrame, 
                          date_col: str, value_col: str) -> pd.DataFrame:
        """Prepare time series data"""
        ts_df = df[[date_col, value_col]].copy()
        ts_df[date_col] = pd.to_datetime(ts_df[date_col], errors='coerce')
        ts_df = ts_df.dropna()
        ts_df = ts_df.sort_values(date_col)
        ts_df = ts_df.set_index(date_col)
        
        return ts_df
    
    def forecast_arima(self, time_series: pd.Series, 
                      periods: int = 12, order: Tuple = (1, 1, 1)) -> Dict:
        """Forecast using ARIMA model"""
        try:
            from statsmodels.arima.model import ARIMA
            
            model = ARIMA(time_series, order=order)
            fitted_model = model.fit()
            
            forecast = fitted_model.get_forecast(steps=periods)
            forecast_df = forecast.conf_int()
            forecast_df['forecast'] = forecast.predicted_mean
            
            return {
                'model': fitted_model,
                'forecast': forecast_df,
                'aic': fitted_model.aic,
                'bic': fitted_model.bic
            }
        except Exception as e:
            logger.error(f"Error in ARIMA forecasting: {e}")
            return {}
    
    def forecast_prophet(self, df: pd.DataFrame, 
                        periods: int = 30) -> Optional[Dict]:
        """Forecast using Prophet model"""
        try:
            from prophet import Prophet
            
            # Prepare data for Prophet
            prophet_df = df[['Date', 'Value']].copy()
            prophet_df.columns = ['ds', 'y']
            prophet_df['ds'] = pd.to_datetime(prophet_df['ds'])
            
            model = Prophet(
                yearly_seasonality=True,
                weekly_seasonality=True,
                daily_seasonality=False,
                interval_width=0.95
            )
            model.fit(prophet_df)
            
            future = model.make_future_dataframe(periods=periods)
            forecast = model.predict(future)
            
            return {
                'model': model,
                'forecast': forecast,
                'components': model.plot_components(forecast)
            }
        except Exception as e:
            logger.error(f"Error in Prophet forecasting: {e}")
            return None


class PopulationClusterer:
    """Cluster populations for targeted interventions"""
    
    def __init__(self, n_clusters: int = 5):
        self.n_clusters = n_clusters
        self.kmeans_model = None
        self.scaler = None
    
    def cluster_regions(self, df: pd.DataFrame, 
                       features: List[str]) -> pd.DataFrame:
        """Cluster regions using K-means"""
        try:
            from sklearn.cluster import KMeans
            from sklearn.preprocessing import StandardScaler
            
            # Prepare features
            X = df[features].fillna(0)
            scaler = StandardScaler()
            X_scaled = scaler.fit_transform(X)
            
            # Fit K-means
            kmeans = KMeans(n_clusters=self.n_clusters, random_state=42, n_init=10)
            clusters = kmeans.fit_predict(X_scaled)
            
            self.kmeans_model = kmeans
            self.scaler = scaler
            
            df_result = df.copy()
            df_result['Cluster'] = clusters
            
            return df_result
        except Exception as e:
            logger.error(f"Error in clustering: {e}")
            return df
    
    def get_cluster_profiles(self, df: pd.DataFrame, 
                            features: List[str]) -> Dict:
        """Get characteristic profiles of each cluster"""
        profiles = {}
        
        for cluster_id in df['Cluster'].unique():
            cluster_data = df[df['Cluster'] == cluster_id]
            profile = {}
            
            for feature in features:
                if feature in cluster_data.columns:
                    profile[feature] = {
                        'mean': cluster_data[feature].mean(),
                        'median': cluster_data[feature].median(),
                        'std': cluster_data[feature].std(),
                        'count': len(cluster_data)
                    }
            
            profiles[f'Cluster_{cluster_id}'] = profile
        
        return profiles


class InsightGenerator:
    """Generate actionable insights from analysis"""
    
    def __init__(self):
        self.insights = []
    
    def generate_migration_insights(self, migration_df: pd.DataFrame) -> List[Dict]:
        """Generate migration pattern insights"""
        insights = []
        
        # High migration risk regions
        high_risk = migration_df.nlargest(10, 'Migration_Risk')
        if len(high_risk) > 0:
            insights.append({
                'category': 'Migration Patterns',
                'severity': 'HIGH',
                'finding': f"{len(high_risk)} districts show high migration risk",
                'details': high_risk[['State', 'District', 'Migration_Risk']].to_dict('records'),
                'recommendation': 'Strengthen digital accessibility and address update mechanisms'
            })
        
        return insights
    
    def generate_biometric_insights(self, biometric_df: pd.DataFrame) -> List[Dict]:
        """Generate biometric coverage insights"""
        insights = []
        
        # Low coverage states
        low_coverage = biometric_df[biometric_df['Biometric_Coverage'] < 30]
        if len(low_coverage) > 0:
            insights.append({
                'category': 'Biometric Coverage',
                'severity': 'CRITICAL',
                'finding': f"{len(low_coverage)} states have <30% biometric coverage",
                'details': low_coverage[['State', 'Biometric_Coverage']].to_dict('records'),
                'recommendation': 'Increase biometric enrollment facilities and mobile camps'
            })
        
        return insights
    
    def generate_age_group_insights(self, age_analysis: Dict) -> List[Dict]:
        """Generate age-group specific insights"""
        insights = []
        
        # Child coverage
        if 'enrolment_age' in age_analysis:
            child_enrol = age_analysis['enrolment_age']
            child_rows = child_enrol[child_enrol['Age_Group'].str.contains('Child', case=False)]
            if len(child_rows) > 0:
                total_child_aadhaar = child_rows['Aadhaar Generated'].sum()
                insights.append({
                    'category': 'Child Identity Coverage',
                    'severity': 'HIGH',
                    'finding': f"Only {total_child_aadhaar:,} children have Aadhaar",
                    'details': child_rows.to_dict('records'),
                    'recommendation': 'Launch school-based Aadhaar enrollment drives'
                })
        
        return insights
