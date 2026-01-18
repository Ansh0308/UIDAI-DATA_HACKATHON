# Quick Start Guide - Aadhaar Analytics Platform

## In 5 Minutes: Get Started

### 1. Prerequisites
```bash
# Verify installations
python --version        # 3.9+
node --version         # 18+
npm --version          # 9+
```

### 2. Download Data (from your Google Drive link)
```
https://drive.google.com/drive/folders/1NHlDm3LdpXVobvU77IU5vHKFlT-o281-
```
- Download all 3 ZIP files
- Extract to `/data` directory

### 3. Setup Project
```bash
# Install dependencies
npm install
pip install pandas numpy scikit-learn statsmodels prophet reportlab

# Verify structure
ls ./data/              # Should see: *.csv files
ls ./lib/               # Should see: data_pipeline.py, ml_models.py, pdf_generator.py
ls ./notebooks/         # Should see: 3 Jupyter notebooks
```

### 4. Process Data (Option A: Python)
```bash
python << 'EOF'
import sys
sys.path.insert(0, './lib')
from data_pipeline import AadhaarDataPipeline

pipeline = AadhaarDataPipeline()
datasets = pipeline.load_datasets(
    enrolment_path='./data/enrolment.csv',
    demographic_path='./data/demographic.csv',
    biometric_path='./data/biometric.csv'
)
pipeline.clean_enrolment_data()
pipeline.clean_demographic_data()
pipeline.clean_biometric_data()
print("✓ Data loaded and cleaned!")
EOF
```

### 5. Launch Dashboard
```bash
npm run dev
# Open http://localhost:3000/dashboard
```

---

## Key Components at a Glance

### `/lib/data_pipeline.py`
**What:** Data loading and preprocessing
**Use:** Process CSV files into analysis-ready format

### `/lib/ml_models.py`
**What:** Machine learning algorithms
**Use:** Detect anomalies, score vulnerability, forecast trends

### `/notebooks/01_*.ipynb`
**What:** Exploratory data analysis
**Use:** Understand data distributions and patterns

### `/notebooks/02_*.ipynb`
**What:** ML model training
**Use:** Run anomaly detection and clustering

### `/notebooks/03_*.ipynb`
**What:** Report generation
**Use:** Create PDF reports and recommendations

### `/app/dashboard/page.tsx`
**What:** Interactive analytics dashboard
**Use:** View real-time metrics and visualizations

---

## Commands Reference

### Data Processing
```bash
# Python quick processing
python -c "
from lib.data_pipeline import AadhaarDataPipeline
p = AadhaarDataPipeline()
p.load_datasets('./data/enrolment.csv', './data/demographic.csv', './data/biometric.csv')
p.clean_enrolment_data()
print('Done!')
"
```

### Notebook Execution
```bash
# Start Jupyter
jupyter notebook

# Then open:
# - notebooks/01_exploratory_data_analysis.ipynb
# - notebooks/02_ml_models_and_predictions.ipynb
# - notebooks/03_report_generation.ipynb
```

### Dashboard
```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

### Report Generation
```python
from lib.pdf_generator import AadhaarReportGenerator

gen = AadhaarReportGenerator()
gen.create_report(
    insights_data={'timestamp': '2024-01-18'},
    recommendations=[...],
    metrics={...}
)
```

---

## Dashboard Navigation

### Overview Tab
- Time series enrolment trend
- Age group distribution
- State-wise performance table

### Migration Tab
- Risk scatter plot
- Migration pattern analysis

### Vulnerability Tab
- Vulnerability categories
- Affected population breakdown

### Anomalies Tab
- Detected irregularities
- Severity classification

---

## Expected Output

After running the full pipeline:

```
/data/
├── enrolment.csv                    (input)
├── demographic.csv                  (input)
├── biometric.csv                    (input)
└── processed/
    ├── enrolment_processed.csv      (cleaned)
    ├── demographic_processed.csv    (cleaned)
    └── biometric_processed.csv      (cleaned)

/reports/
├── Aadhaar_Analytics_*.pdf          (report)
├── executive_summary.json           (summary)
├── migration_analysis.csv           (export)
├── vulnerable_populations.csv       (export)
└── detected_anomalies.csv           (export)
```

---

## Dashboard Metrics Explained

| Metric | What It Means | What to Look For |
|--------|--------------|------------------|
| **Total Enrolment** | Aadhaar holders | Should be 1.23B+ |
| **Demographic Updates** | Address changes | Indicates migration |
| **Biometric Coverage** | System health | Target: >85% |
| **High-Risk Districts** | Needs support | Lower is better |
| **Vulnerable Population** | At-risk groups | Children, elderly, rural |
| **Anomalies Detected** | Data issues | Should be investigated |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Module not found" | `pip install -r requirements.txt` |
| "File not found" | Verify `/data/*.csv` exist |
| "Memory error" | Process data in chunks |
| "Dashboard blank" | Check API at `/api/analytics` |
| "Report won't generate" | Verify ReportLab: `pip install reportlab` |

---

## Key Insights to Look For

Once data is processed, check these insights:

1. **Child Enrolment** (0-5 age group)
   - Target: Should see enrollment patterns
   - Action: If low, recommend school programs

2. **Elderly Coverage** (60+ age group)
   - Target: Should show biometric gaps
   - Action: If low, improve accessibility

3. **Migration Risk** (address updates)
   - Target: High in migration corridors
   - Action: Regional-specific support

4. **Biometric Quality** (state-wise)
   - Target: Variance < 20 percentage points
   - Action: Standardize processes

5. **Anomalies** (statistical outliers)
   - Target: Should identify 2-3% of records
   - Action: Investigate root causes

---

## Performance Notes

- Small dataset (100k records): < 1 minute
- Medium dataset (10M records): 5-10 minutes
- Large dataset (500M+ records): 30-60 minutes

Monitor system resources:
```bash
# In another terminal
watch -n 1 'free -h && du -sh ./data'
```

---

## Next Steps After Quick Start

1. ✓ Get dashboard running
2. ✓ Verify metrics load
3. → Run Jupyter notebooks for detailed analysis
4. → Generate PDF report
5. → Export results for stakeholders

---

## File Locations

**Important Directories:**
- `/data/` - Input CSV files (you add these)
- `/lib/` - Python modules (already included)
- `/notebooks/` - Jupyter notebooks (already included)
- `/app/dashboard/` - Dashboard page (already included)
- `/reports/` - Output reports (generated)

**Key Files:**
- `README.md` - Full documentation
- `INTEGRATION_GUIDE.md` - Data integration steps
- `PROJECT_SUMMARY.md` - System overview
- `QUICK_START.md` - This file

---

## Getting Help

1. **Data issues?** → See INTEGRATION_GUIDE.md
2. **System overview?** → See PROJECT_SUMMARY.md
3. **Full docs?** → See README.md
4. **Specific errors?** → Check error message in console
5. **Need quick help?** → This file!

---

## Success Checklist

- [ ] Python 3.9+ installed
- [ ] Node.js 18+ installed
- [ ] Datasets downloaded from Google Drive
- [ ] CSV files in `/data` directory
- [ ] `npm install` completed
- [ ] `pip install` completed
- [ ] Data processing successful
- [ ] Dashboard loads at localhost:3000/dashboard
- [ ] Metrics appear on dashboard
- [ ] Notebooks run without errors
- [ ] PDF report generates
- [ ] All exports complete

---

## Ready? Start Here:

```bash
# 1. Extract data to /data/
# 2. Run this:
npm run dev

# 3. Open browser:
# http://localhost:3000/dashboard

# 4. See the data!
```

**That's it! You're ready to analyze Aadhaar data.**

---

*Last Updated: January 18, 2026*
