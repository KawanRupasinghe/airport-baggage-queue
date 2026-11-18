# Source and cleaning notes

- Original dataset: **Airport Security Checkpoint Data**, 4TU.ResearchData / TU Delft, licensed CC BY 4.0. Original `security_checkpoint_data.xlsx` and `README.pdf` were provided by the project author from the repository download; see the source repository for citation metadata.
- Field definitions: original README page 2, columns X (`Time Start Baggage Check`) and Y (`Time End Baggage Check`). These are *manual baggage-check service timestamps*, **not passenger arrival-to-queue timestamps**.
- Script: `src/clean_data.py` (reproduces CSV and audit from the original workbook when that workbook is supplied).
- Interpretation: one row per recorded traveller, optional baggage check. The primary extract uses session tabs listed in the source README and excludes two `2018_12_06*` tabs absent from its session table. These excluded tabs contain six additional positive durations, to be investigated rather than silently pooled.
- Times: HHMMSS (including numeric cells with omitted leading zeros), converted to seconds after midnight. Keep paired valid positive durations <=1800 seconds. No rollover or overnight records retained.
- No outlier trimming beyond this explicit plausibility ceiling. The ceiling did not exclude any paired record in the inspected workbook.
- Data file: `cleaned_baggage_check_durations.csv`; source sheet and Excel row retained for traceability; no names or personally identifying information.
- This is a **service-time calibration only**. Arrival intensity, identical parallel station assumption and queue topology are scenario assumptions and are not identified from these observations. Sampled times may be correlated in reality; the simulation assumes independent draws.
- Cite the original data repository and associated paper, and attribute CC BY 4.0 in the final README and report. This derived CSV is source-derived, not fabricated.
