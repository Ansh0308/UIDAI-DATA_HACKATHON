# Integration Guide: Using Your Google Drive Datasets

This guide explains how to integrate your Aadhaar datasets from Google Drive with the analytics platform.

## Step 1: Access Your Google Drive Data

Your datasets are located at:
```
https://drive.google.com/drive/folders/1NHlDm3LdpXVobvU77IU5vHKFlT-o281-?usp=sharing
```

The folder contains 3 ZIP files:
1. **Aadhaar_Enrolment_Data.zip** - New enrolment records
2. **Aadhaar_Demographic_Updates.zip** - Address/name/DoB updates
3. **Aadhaar_Biometric_Updates.zip** - Fingerprint/iris/photo updates

## Step 2: Download & Extract Data

1. Download all 3 ZIP files from Google Drive
2. Extract them to your local machine
3. Create a `/data` directory in the project root:
   ```bash
   mkdir -p ./data
   ```
4. Move extracted CSV files to `/data`:
   ```bash
   cp ~/Downloads/enrolment.csv ./data/
   cp ~/Downloads/demographic.csv ./data/
   cp ~/Downloads/biometric.csv ./data/
   ```

## Step 3: Verify Data Format

Before processing, verify your CSV files match expected format:

### Enrolment Data Check
```python
import pandas as pd
enrol_df = pd.read_csv('./data/enrolment.csv')
print(enrol_df.head())
print(enrol_df.columns)
print(enrol_df.dtypes)
print(f"Shape: {enrol_df.shape}")
```

Expected columns:
```
State, District, Pin Code, Date, Month, Age_Group, Gender, 
Aadhaar Generated, Mobile Provided
```

### Demographic Data Check
```python
demo_df = pd.read_csv('./data/demographic.csv')
print(demo_df.head())
print(demo_df.columns)
```

Expected columns:
```
State, District, Pin Code, Date, Month, Update_Type, 
Update_Count, Age_Group
```

### Biometric Data Check
```python
bio_df = pd.read_csv('./data/biometric.csv')
print(bio_df.head())
print(bio_df.columns)
```

Expected columns:
```
State, District, Pin Code, Date, Month, Age_Group, 
Update_Type, Update_Count
```

## Step 4: Run Data Pipeline

### In Jupyter Notebook

Open `/notebooks/01_exploratory_data_analysis.ipynb` and add:

```python
from lib.data_pipeline import AadhaarDataPipeline

# Initialize pipeline
pipeline = AadhaarDataPipeline(data_dir='./data')

# Load datasets
datasets = pipeline.load_datasets(
    enrolment_path='./data/enrolment.csv',
    demographic_path='./data/demographic.csv',
    biometric_path='./data/biometric.csv'
)

# Clean data
pipeline.clean_enrolment_data()
pipeline.clean_demographic_data()
pipeline.clean_biometric_data()

print("Data loaded and cleaned successfully!")
```

### Via Python Script

Create `process_data.py`:

```python
#!/usr/bin/env python3
"""Process Aadhaar datasets from Google Drive"""

import sys
sys.path.insert(0, './lib')

from data_pipeline import AadhaarDataPipeline, DataValidator

def main():
    print("Starting data processing pipeline...")
    
    # Initialize pipeline
    pipeline = AadhaarDataPipeline()
    
    # Load datasets
    print("\n1. Loading datasets...")
    datasets = pipeline.load_datasets(
        enrolment_path='./data/enrolment.csv',
        demographic_path='./data/demographic.csv',
        biometric_path='./data/biometric.csv'
    )
    
    # Validate data quality
    print("\n2. Validating data quality...")
    validator = DataValidator()
    
    if pipeline.enrolment_df is not None:
        missing = validator.check_missing_values(pipeline.enrolment_df)
        print(f"Missing values in enrolment: {missing}")
    
    # Clean data
    print("\n3. Cleaning data...")
    pipeline.clean_enrolment_data()
    pipeline.clean_demographic_data()
    pipeline.clean_biometric_data()
    
    # Generate insights
    print("\n4. Generating insights...")
    insights = pipeline.generate_insights()
    
    # Export processed data
    print("\n5. Exporting processed data...")
    pipeline.export_processed_data('./data/processed')
    
    print("\n✓ Data processing complete!")
    print(f"Insights: {insights}")

if __name__ == "__main__":
    main()
```

Run with:
```bash
python process_data.py
```

## Step 5: Run ML Models

Update `/notebooks/02_ml_models_and_predictions.ipynb`:

```python
# After loading cleaned data
from ml_models import (
    AnomalyDetector, 
    VulnerabilityAnalyzer,
    TimeSeriesForecaster
)

# Get numeric features
numeric_features = pipeline.enrolment_df.select_dtypes(include=[np.number]).columns
X = pipeline.enrolment_df[numeric_features].fillna(0)

# Anomaly Detection
print("Running anomaly detection...")
detector = AnomalyDetector()
anomalies_if = detector.detect_isolation_forest(X)
anomaly_scores = detector.get_anomaly_scores(X)

# Vulnerability Analysis
print("Running vulnerability analysis...")
analyzer = VulnerabilityAnalyzer()
vulnerability_scores = analyzer.calculate_vulnerability_score(pipeline.enrolment_df)

# Migration Analysis
print("Calculating migration indicators...")
migration_df = pipeline.calculate_migration_indicators()

# Biometric Analysis
print("Analyzing biometric coverage...")
biometric_health = pipeline.calculate_biometric_quality()

print("✓ ML analysis complete!")
```

## Step 6: Generate Report

Update `/notebooks/03_report_generation.ipynb`:

```python
from pdf_generator import AadhaarReportGenerator, InsightExtractor

# Initialize report generator
report_gen = AadhaarReportGenerator(output_dir='./reports')

# Compile metrics
report_metrics = {
    'totalEnrolment': f"{pipeline.enrolment_df['Aadhaar Generated'].sum():,.0f}",
    'demographicUpdates': f"{pipeline.demographic_df['Update_Count'].sum():,.0f}",
    'biometricCoverage': f"{(pipeline.biometric_df['Update_Count'].sum() / pipeline.enrolment_df['Aadhaar Generated'].sum() * 100):.1f}%",
    'highRiskDistricts': str(len(migration_df[migration_df['Migration_Risk'] > 70])),
    'vulnerablePopulation': f"{(vulnerability_scores > 0.7).sum():,.0f}",
    'anomaliesDetected': str((anomaly_scores > 0.7).sum())
}

# Generate recommendations
recommendations = [
    {
        'title': 'Strengthen Child Enrollment Programs',
        'description': 'Launch school-based Aadhaar enrollment drives...'
    },
    # Add more recommendations...
]

# Create report
report_path = report_gen.create_report(
    insights_data={'timestamp': datetime.now()},
    recommendations=recommendations,
    metrics=report_metrics,
    filename='Aadhaar_Analytics_Full_Report.pdf'
)

print(f"Report generated: {report_path}")
```

## Step 7: Launch Dashboard

The dashboard automatically pulls from your processed data:

```bash
npm run dev
# Navigate to http://localhost:3000/dashboard
```

The dashboard will display:
- Real-time metrics from your data
- Geographic performance maps
- Age group distributions
- Migration risk analysis
- Vulnerability assessments
- Detected anomalies

## Step 8: Export Results

Export analysis results for stakeholders:

```python
# Export CSV files
migration_df.to_csv('./reports/migration_analysis.csv', index=False)
biometric_health.to_csv('./reports/biometric_analysis.csv', index=False)

# Export JSON for API
import json
with open('./reports/analysis_results.json', 'w') as f:
    json.dump({
        'metrics': report_metrics,
        'migration_risks': migration_df.to_dict('records'),
        'vulnerable_areas': biometric_health.to_dict('records')
    }, f, indent=2)
```

## Troubleshooting

### Issue: "File not found" error

**Solution:**
```bash
# Verify files exist
ls -la ./data/

# Check file permissions
chmod +r ./data/*.csv
```

### Issue: "Column not found" error

**Solution:**
1. Check actual column names:
   ```python
   df = pd.read_csv('./data/enrolment.csv')
   print(df.columns.tolist())
   ```
2. Update column names in `data_pipeline.py` to match your data

### Issue: Memory error with large datasets

**Solution:**
```python
# Process in chunks
chunk_size = 50000
for chunk in pd.read_csv('./data/enrolment.csv', chunksize=chunk_size):
    process_chunk(chunk)
```

### Issue: Data type mismatches

**Solution:**
```python
# Specify data types when loading
dtypes = {
    'Aadhaar Generated': 'int64',
    'Age_Group': 'string',
    'Date': 'datetime64[ns]'
}
df = pd.read_csv('./data/enrolment.csv', dtype=dtypes)
```

## Data Quality Checklist

Before running full analysis, ensure:

- [ ] All CSV files present in `/data` directory
- [ ] CSV files have headers and consistent columns
- [ ] No corrupted or incomplete records
- [ ] Date formats consistent (YYYY-MM-DD preferred)
- [ ] State/District names standardized
- [ ] Age groups properly categorized
- [ ] Numeric fields contain valid numbers
- [ ] No sensitive personal information in exports

## Performance Tips

1. **For large datasets (>500M records):**
   - Run notebooks in Jupyter with kernel restart
   - Process data in batches
   - Use filtering to analyze specific states/periods

2. **For faster analysis:**
   - Use sampled data (1-10%) for initial exploration
   - Run models on processed subsets
   - Cache intermediate results

3. **For better dashboard performance:**
   - Pre-compute aggregations
   - Store results in cache
   - Use API pagination for large result sets

## Next Steps

1. **Load your data** following Step 1-3
2. **Run EDA notebook** to explore patterns
3. **Execute ML models** for insights
4. **Generate PDF report** for stakeholders
5. **View dashboard** for interactive analysis
6. **Export results** in desired formats

## Support

For issues with data integration:
1. Check file format and column names
2. Verify data types and ranges
3. Test with sample data first
4. Check system memory and disk space
5. Review error messages in console logs

---

**Last Updated:** January 18, 2026
