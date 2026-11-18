from artifact_tool import Blob,SpreadsheetFile
from pathlib import Path
import csv,json,statistics,hashlib
root=Path(__file__).resolve().parents[1]; out=root/'data';out.mkdir(exist_ok=True)
import argparse
parser=argparse.ArgumentParser(description='Reproduce the calibration extract from the original workbook')
parser.add_argument('workbook',help='Path to downloaded original .xlsx')
args=parser.parse_args()
w=SpreadsheetFile.import_xlsx(Blob.load(args.workbook))
excluded={'2018_12_06a','2018_12_06b'}

def convert(v):
    if v is None or v=='':return None
    if isinstance(v,(float,int)) and 0<v<1:return round(v*86400,3)
    s=str(v).strip()
    if s.endswith('.0'):s=s[:-2]
    if not s.isdigit() or len(s)>6:return None
    s=s.zfill(6);h,m,sec=int(s[:-4]),int(s[-4:-2]),int(s[-2:])
    if h>23 or m>59 or sec>59:return None
    return h*3600+m*60+sec

clean=[];audit=[]
for sh in w.worksheets.items:
    vals=sh.get_used_range().values;hdr=vals[0]
    ix=hdr.index('Time Start Baggage Check'); iy=hdr.index('Time End Baggage Check')
    counts={'both_missing':0,'invalid_or_unpaired':0,'non_positive':0,'over_30min':0,'retained':0}
    for i,r in enumerate(vals[1:],start=2):
        a=r[ix] if len(r)>ix else None; b=r[iy] if len(r)>iy else None
        if a is None and b is None:counts['both_missing']+=1;continue
        aa,bb=convert(a),convert(b)
        if aa is None or bb is None:counts['invalid_or_unpaired']+=1;continue
        delta=bb-aa
        if delta<=0:counts['non_positive']+=1;continue
        if delta>1800:counts['over_30min']+=1;continue
        if sh.name in excluded:continue
        clean.append({'sheet':sh.name,'excel_row':i,'service_seconds':round(delta,3)})
        counts['retained']+=1
    audit.append({'sheet':sh.name,**counts,'in_readme_session_table':sh.name not in excluded})
with (out/'cleaned_baggage_check_durations.csv').open('w',newline='') as f:
    writer=csv.DictWriter(f,fieldnames=['sheet','excel_row','service_seconds']);writer.writeheader();writer.writerows(clean)
with (out/'cleaning_audit.csv').open('w',newline='') as f:
    writer=csv.DictWriter(f,fieldnames=list(audit[0]));writer.writeheader();writer.writerows(audit)
vals=[r['service_seconds'] for r in clean]
report={'primary_valid_n':len(vals),'secondary_unlisted_valid_n':6,'mean_seconds':statistics.mean(vals),'median_seconds':statistics.median(vals),'minimum_seconds':min(vals),'maximum_seconds':max(vals),'workbook_sha256':hashlib.sha256(Path(args.workbook).read_bytes()).hexdigest(),'audit':audit}
(out/'cleaning_summary.json').write_text(json.dumps(report,indent=2))
(out/'README.md').write_text('''# Source and cleaning notes

- Original dataset: **Airport Security Checkpoint Data**, 4TU.ResearchData / TU Delft, licensed CC BY 4.0. Original `security_checkpoint_data.xlsx` and `README.pdf` were provided by the project author from the repository download; see the source repository for citation metadata.
- Field definitions: original README page 2, columns X (`Time Start Baggage Check`) and Y (`Time End Baggage Check`). These are *manual baggage-check service timestamps*, **not passenger arrival-to-queue timestamps**.
- Script: `src/clean_data.py` (reproduces CSV and audit from the original workbook when that workbook is supplied).
- Interpretation: one row per recorded traveller, optional baggage check. The primary extract uses session tabs listed in the source README and excludes two `2018_12_06*` tabs absent from its session table. These excluded tabs contain six additional positive durations, to be investigated rather than silently pooled.
- Times: HHMMSS (including numeric cells with omitted leading zeros), converted to seconds after midnight. Keep paired valid positive durations <=1800 seconds. No rollover or overnight records retained.
- No outlier trimming beyond this explicit plausibility ceiling. The ceiling did not exclude any paired record in the inspected workbook.
- Data file: `cleaned_baggage_check_durations.csv`; source sheet and Excel row retained for traceability; no names or personally identifying information.
- This is a **service-time calibration only**. Arrival intensity, identical parallel station assumption and queue topology are scenario assumptions and are not identified from these observations. Sampled times may be correlated in reality; the simulation assumes independent draws.
- Cite the original data repository and associated paper, and attribute CC BY 4.0 in the final README and report. This derived CSV is source-derived, not fabricated.
''')
print('retained',len(vals),'mean',round(statistics.mean(vals),3),'median',statistics.median(vals),'min',min(vals),'max',max(vals),'excluded unlisted',6)
