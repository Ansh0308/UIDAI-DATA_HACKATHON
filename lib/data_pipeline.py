"""
Aadhaar Enrolment & Updates Data Pipeline
Handles data loading, preprocessing, and feature engineering for multi-dataset analysis
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
import logging
from pathlib import Path
import warnings

warnings.filterwarnings('ignore')
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AadhaarDataPipeline:
    """Main data pipeline for Aadhaar enrolment, demographic, and biometric datasets"""
    
    def __init__(self, data_dir: str = None):
        """Initialize pipeline with data directory"""
        self.data_dir = Path(data_dir) if data_dir else Path("./data")
        self.enrolment_df = None
        self.demographic_df = None
        self.biometric_df = None
        self.processed_data = {}
        self.feature_engineering_done = False
        
    def load_datasets(self, 
                     enrolment_path: str = None,
                     demographic_path: str = None,
                     biometric_path: str = None) -> Dict[str, pd.DataFrame]:
        """Load all three datasets from CSV files"""
        try:
            if enrolment_path:
                self.enrolment_df = pd.read_csv(enrolment_path)
                logger.info(f"Loaded enrolment data: {self.enrolment_df.shape}")
                
            if demographic_path:
                self.demographic_df = pd.read_csv(demographic_path)
                logger.info(f"Loaded demographic data: {self.demographic_df.shape}")
                
            if biometric_path:
                self.biometric_df = pd.read_csv(biometric_path)
                logger.info(f"Loaded biometric data: {self.biometric_df.shape}")
                
            return {
                'enrolment': self.enrolment_df,
                'demographic': self.demographic_df,
                'biometric': self.biometric_df
            }
        except Exception as e:
            logger.error(f"Error loading datasets: {e}")
            raise
    
    def clean_enrolment_data(self) -> pd.DataFrame:
        """Clean and preprocess enrolment dataset"""
        if self.enrolment_df is None:
            raise ValueError("Enrolment data not loaded")
            
        df = self.enrolment_df.copy()
        
        # Handle missing values
        df = df.fillna(method='ffill').fillna(method='bfill')
        
        # Convert date columns to datetime
        date_cols = [col for col in df.columns if 'date' in col.lower() or 'month' in col.lower()]
        for col in date_cols:
            try:
                df[col] = pd.to_datetime(df[col], errors='coerce')
            except:
                pass
        
        # Remove duplicates
        df = df.drop_duplicates()
        
        # Handle numeric columns
        numeric_cols = df.select_dtypes(include=['object']).columns
        for col in numeric_cols:
            if df[col].dtype == 'object':
                try:
                    df[col] = pd.to_numeric(df[col], errors='coerce')
                except:
                    pass
        
        self.enrolment_df = df
        logger.info("Enrolment data cleaned")
        return df
    
    def clean_demographic_data(self) -> pd.DataFrame:
        """Clean and preprocess demographic dataset"""
        if self.demographic_df is None:
            raise ValueError("Demographic data not loaded")
            
        df = self.demographic_df.copy()
        
        # Handle missing values
        df = df.fillna(method='ffill').fillna(method='bfill')
        
        # Convert date columns
        date_cols = [col for col in df.columns if 'date' in col.lower() or 'month' in col.lower()]
        for col in date_cols:
            try:
                df[col] = pd.to_datetime(df[col], errors='coerce')
            except:
                pass
        
        # Remove duplicates
        df = df.drop_duplicates()
        
        self.demographic_df = df
        logger.info("Demographic data cleaned")
        return df
    
    def clean_biometric_data(self) -> pd.DataFrame:
        """Clean and preprocess biometric dataset"""
        if self.biometric_df is None:
            raise ValueError("Biometric data not loaded")
            
        df = self.biometric_df.copy()
        
        # Handle missing values
        df = df.fillna(method='ffill').fillna(method='bfill')
        
        # Convert date columns
        date_cols = [col for col in df.columns if 'date' in col.lower() or 'month' in col.lower()]
        for col in date_cols:
            try:
                df[col] = pd.to_datetime(df[col], errors='coerce')
            except:
                pass
        
        # Remove duplicates
        df = df.drop_duplicates()
        
        self.biometric_df = df
        logger.info("Biometric data cleaned")
        return df
    
    def aggregate_by_state_district(self, df: pd.DataFrame, value_col: str) -> pd.DataFrame:
        """Aggregate data by state and district"""
        if 'State' not in df.columns or 'District' not in df.columns:
            logger.warning("State or District column not found")
            return df
            
        agg_df = df.groupby(['State', 'District'])[value_col].sum().reset_index()
        agg_df.columns = ['State', 'District', value_col]
        return agg_df
    
    def calculate_migration_indicators(self) -> pd.DataFrame:
        """Calculate migration patterns and indicators"""
        if self.enrolment_df is None or self.demographic_df is None:
            raise ValueError("Required datasets not loaded")
        
        # Merge enrolment and demographic updates
        merged = pd.merge(
            self.enrolment_df,
            self.demographic_df,
            on=['State', 'District', 'Pin Code'],
            how='left',
            suffixes=('_enrol', '_demo')
        )
        
        # Calculate migration indicators
        migration_df = pd.DataFrame()
        
        if 'Aadhaar Generated_enrol' in merged.columns and 'Update_count' in merged.columns:
            migration_df['State'] = merged['State']
            migration_df['District'] = merged['District']
            migration_df['Enrolment'] = merged['Aadhaar Generated_enrol']
            migration_df['Updates'] = merged['Update_count']
            migration_df['Update_Rate'] = (migration_df['Updates'] / 
                                          (migration_df['Enrolment'] + 1)) * 100
            migration_df['Migration_Risk'] = self._calculate_migration_risk(migration_df)
        
        return migration_df
    
    def _calculate_migration_risk(self, df: pd.DataFrame) -> np.ndarray:
        """Calculate migration risk score (0-100)"""
        update_rate = df['Update_Rate'].fillna(0)
        # Normalize to 0-100 scale
        risk_score = ((update_rate - update_rate.min()) / 
                     (update_rate.max() - update_rate.min() + 1e-6) * 100)
        return risk_score.fillna(50)
    
    def calculate_biometric_quality(self) -> pd.DataFrame:
        """Calculate biometric system health indicators"""
        if self.biometric_df is None:
            raise ValueError("Biometric data not loaded")
        
        df = self.biometric_df.copy()
        
        biometric_health = pd.DataFrame()
        
        # Group by state and calculate quality metrics
        if 'State' in df.columns:
            biometric_health = df.groupby('State').agg({
                'Update_Count': ['sum', 'mean'],
                'Age_Group': 'count'
            }).reset_index()
            
            biometric_health.columns = ['State', 'Total_Updates', 'Avg_Updates', 'Individuals_Updated']
            
            # Calculate update rate
            if 'Individuals_Updated' in biometric_health.columns:
                biometric_health['Biometric_Coverage'] = (
                    biometric_health['Total_Updates'] / 
                    (biometric_health['Individuals_Updated'] + 1e-6)
                ) * 100
        
        return biometric_health
    
    def calculate_age_group_analysis(self) -> Dict[str, pd.DataFrame]:
        """Analyze patterns by age group"""
        analysis = {}
        
        # Enrolment by age group
        if self.enrolment_df is not None and 'Age_Group' in self.enrolment_df.columns:
            analysis['enrolment_age'] = self.enrolment_df.groupby('Age_Group').agg({
                'Aadhaar Generated': 'sum'
            }).reset_index()
        
        # Demographic updates by age group
        if self.demographic_df is not None and 'Age_Group' in self.demographic_df.columns:
            analysis['demographic_age'] = self.demographic_df.groupby('Age_Group').agg({
                'Update_Count': 'sum'
            }).reset_index()
        
        # Biometric updates by age group
        if self.biometric_df is not None and 'Age_Group' in self.biometric_df.columns:
            analysis['biometric_age'] = self.biometric_df.groupby('Age_Group').agg({
                'Update_Count': 'sum'
            }).reset_index()
        
        return analysis
    
    def identify_anomalies(self, df: pd.DataFrame, column: str, 
                          threshold: float = 2.5) -> pd.DataFrame:
        """Identify statistical anomalies using Z-score"""
        from scipy import stats
        
        df = df.copy()
        z_scores = np.abs(stats.zscore(df[column].fillna(0)))
        anomalies = df[z_scores > threshold]
        
        return anomalies
    
    def generate_insights(self) -> Dict[str, any]:
        """Generate comprehensive insights from all datasets"""
        insights = {
            'timestamp': datetime.now(),
            'datasets_loaded': {
                'enrolment': self.enrolment_df is not None,
                'demographic': self.demographic_df is not None,
                'biometric': self.biometric_df is not None
            },
            'summary_stats': {},
            'anomalies': {},
            'key_metrics': {}
        }
        
        # Enrolment insights
        if self.enrolment_df is not None:
            insights['summary_stats']['enrolment'] = {
                'total_records': len(self.enrolment_df),
                'states': self.enrolment_df['State'].nunique() if 'State' in self.enrolment_df.columns else 0,
                'districts': self.enrolment_df['District'].nunique() if 'District' in self.enrolment_df.columns else 0,
            }
        
        # Demographic insights
        if self.demographic_df is not None:
            insights['summary_stats']['demographic'] = {
                'total_records': len(self.demographic_df),
                'states': self.demographic_df['State'].nunique() if 'State' in self.demographic_df.columns else 0,
                'update_types': self.demographic_df['Update_Type'].nunique() if 'Update_Type' in self.demographic_df.columns else 0,
            }
        
        # Biometric insights
        if self.biometric_df is not None:
            insights['summary_stats']['biometric'] = {
                'total_records': len(self.biometric_df),
                'states': self.biometric_df['State'].nunique() if 'State' in self.biometric_df.columns else 0,
            }
        
        return insights
    
    def export_processed_data(self, output_dir: str) -> None:
        """Export all processed datasets"""
        output_path = Path(output_dir)
        output_path.mkdir(exist_ok=True)
        
        if self.enrolment_df is not None:
            self.enrolment_df.to_csv(output_path / "enrolment_processed.csv", index=False)
            
        if self.demographic_df is not None:
            self.demographic_df.to_csv(output_path / "demographic_processed.csv", index=False)
            
        if self.biometric_df is not None:
            self.biometric_df.to_csv(output_path / "biometric_processed.csv", index=False)
        
        logger.info(f"Processed data exported to {output_path}")


class DataValidator:
    """Validate data quality and integrity"""
    
    @staticmethod
    def check_missing_values(df: pd.DataFrame) -> Dict[str, float]:
        """Check percentage of missing values"""
        missing = (df.isnull().sum() / len(df) * 100).to_dict()
        return {k: v for k, v in missing.items() if v > 0}
    
    @staticmethod
    def check_data_types(df: pd.DataFrame) -> Dict[str, str]:
        """Check data types"""
        return df.dtypes.astype(str).to_dict()
    
    @staticmethod
    def check_outliers(df: pd.DataFrame, numeric_cols: List[str]) -> Dict[str, int]:
        """Check for outliers using IQR method"""
        from scipy import stats
        outliers = {}
        
        for col in numeric_cols:
            if col in df.columns and df[col].dtype in [np.int64, np.float64]:
                z_scores = np.abs(stats.zscore(df[col].fillna(0)))
                outlier_count = (z_scores > 3).sum()
                if outlier_count > 0:
                    outliers[col] = outlier_count
        
        return outliers
