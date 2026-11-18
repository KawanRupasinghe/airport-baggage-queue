# Browser user guide

Open `docs/index.html` locally (double-click) or visit the GitHub Pages website.
1. Choose **Observed durations** for empirical manual baggage-check times or **Exponential baseline** for the analytical-family model.
2. Set arrivals (passengers/minute), service-time multiplier and number of stations.
3. Press Start and watch the FIFO queue drain after the 60-minute arrival window. Pause and Resume or Reset as needed.
4. **Run reference trace** reproduces fixed arrivals `[0, 1, 1.5]` min, services `[3, 2, 1]` min on one station: waits `[0, 2, 3.5]` min, mean `1.8333` min.
5. Results are from a single realised run and do not provide statistical confidence intervals. Consult the notebook for replicated experiments.

Only service times are calibrated from selected manual baggage-inspection observations. Arrival rates and identical shared stations are assumptions.

Screenshots to add when final browser UI is verified.
