# Airport Queue Explorer — web user guide

**Live browser demonstration:** https://kawanrupasinghe.github.io/airport-baggage-queue/

![Labelled screenshot of the actual deployed dashboard](figures/demo-screenshot-labelled.png)

The standalone HTML/CSS/JavaScript application works without a backend. No actual passenger records or personal information are uploaded by the demo. It shows **one event trace**, not an ensemble estimate.

## Controls and units

| Control | Meaning | Supported range / default |
|---|---|---|
| Arrival rate | **Assumed** Poisson passenger arrivals per minute | 0.05–10; default 0.8 |
| Inspection stations | Identical parallel servers feeding one shared FIFO line | 1–12; default 2 |
| Service-time model | Resampled observed durations or independent exponential baseline | Observed durations by default |
| Service-time multiplier | Scales every sampled inspection duration | 0.05–10; default 1.0 |
| Playback speed | Controls animation speed, not the queue's mathematical inputs | 1×–30×; initially 8× |
| Start | Rebuilds and begins a seeded, 60-minute arrival trace | — |
| Pause / Resume | Pauses / resumes the simulated-time playback | — |
| Reset | Clears the trace and all displayed statistics | — |
| Run reference trace | Fixed three-passenger scenario for an exact numerical check | — |

## Reading the page

- **Waiting queue:** green dots represent passengers waiting, *not yet in service*. The waiting count excludes occupied stations.
- **Inspection stations:** each station is either available or inspecting a numbered passenger.
- **Clock and progress bar:** minutes of simulated time, beginning at 00:00. Normal random arrivals stop after a **60-minute arrival window**, but final processing can extend beyond it.
- **Queue-occupancy chart:** a sampled visual history of the waiting count, updated from the displayed DOM; it is not the exact event-time integral.
- **Live cards:** arrived, completed, mean queue wait among passengers who have started service, time-weighted mean queue length, and aggregate station utilisation across the elapsed run.

## Try two scenarios

1. **Visible queue:** select Observed durations, 1.5 hypothetical arrivals/min, 2 stations and multiplier 1.0, then Start. This is intended to make queue activity visible, **not an empirically measured arrival rate**. Pause once the queue and occupied stations are visible.
2. **Capacity comparison:** Reset and repeat with 1 and then 3 stations while keeping other inputs fixed. The demonstration uses a fixed seed so these are reproducible visual scenarios, **not independent Monte Carlo replications**.

## Exact verification against the notebook

Click **Run reference trace**. The demo uses one station, arrivals at 0, 1 and 1.5 min and inspection times of 3, 2 and 1 min. Once all three finish, it must show a mean wait of **1.833 min**, which agrees with the notebook's hand-calculated reference `11/6 = 1.833333...` to the 3-decimal display precision. The time-weighted mean queue length for the completed reference is **5.5/6 = 0.9167 passengers**. This checks finite-trace arithmetic but does not independently verify airport realism.

For rigorous confidence intervals, stability checks, the analytical M/M/c benchmark and data-informed staffing comparisons, use the [research notebook](https://colab.research.google.com/github/KawanRupasinghe/airport-baggage-queue/blob/main/notebook/airport-baggage-queue.ipynb).

## Limitations and troubleshooting

The default browser trace uses a fixed deterministic pseudorandom seed and samples only the selected observed service-duration distribution. A browser run is finite; its evolving sample estimates are not guaranteed to be stationary and cannot be compared directly with long-run replication-based notebook confidence intervals. The model omits priorities, abandonment, operator changes, station closures and real airport demand calibration.

If the page appears unstyled, verify `docs/dashboard-v2.css` is present and reload without cache. For input errors, use arrival rate 0.05–10/min, positive multiplier 0.05–10, and 1–12 whole stations.

## Data source

Original **Airport Security Checkpoint Data**, TU Delft / 4TU.ResearchData, CC BY 4.0. See [data/README.md](data/README.md) and [REFERENCES.md](REFERENCES.md) for the extraction decisions and original attribution.
