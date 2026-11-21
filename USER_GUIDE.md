# Airport Queue Explorer — user guide

## Open the live interactive demo

**Live site:** https://kawanrupasinghe.github.io/airport-baggage-queue/

The standalone site is served from [`docs/`](docs/) by GitHub Pages. It uses HTML, CSS and JavaScript without sending personal passenger data to a server. The redesigned page has a **Scenario controls** panel, **Inspection flow** display, **Live statistics** cards, a queue history graphic and a methodology section.

## Reproduce a demonstration

1. Open the site in an up-to-date browser. If a previous stylesheet is cached, hard-refresh or open a private window.
2. Under **Scenario controls**, set an assumed arrival rate (passengers/minute), choose the number of parallel **Inspection stations**, and choose **Observed durations** (empirical) or **Exponential baseline** as the service-time model.
3. Optionally set the service-time multiplier; `1.0` leaves the observed durations unchanged. Adjust **Playback speed** for a faster or slower animation.
4. Press **Start simulation**. Inspect the shared waiting queue, active stations, simulation clock, queue-occupancy chart and the live metric cards.
5. Press **Pause** and **Resume** as needed, or **Reset** to begin again. Simulation arrivals occur over a 60-minute model window, after which the simulator allows the remaining queue to drain.
6. Press **Run reference trace** to verify a deterministic example. With one station, arrivals at 0, 1 and 1.5 minutes and service durations of 3, 2 and 1 minutes produce waits of 0, 2 and 3.5 minutes; mean `11/6 = 1.8333` minutes.

## Model interpretation

- The **Observed durations** model samples 162 measured manual baggage-check service durations from 13 documented sessions. These are service durations **only**.
- Passenger arrivals are intentionally **assumed** Poisson scenarios; there is no measured arrival stream to the hypothetical pooled secondary-inspection queue.
- The interactive chart and cards describe **one realised run**, not steady-state estimates or confidence intervals.
- For repeated simulation runs, formal uncertainty analysis and stability-aware staffing comparisons, use the [Colab notebook](https://colab.research.google.com/github/KawanRupasinghe/airport-baggage-queue/blob/main/notebook/airport-baggage-queue.ipynb).
- Overloaded (`rho >= 1`) scenarios must not be treated as having a finite long-run steady-state mean queue wait.

## Example configuration for a screenshot/video

Choose **Observed durations**, two stations, multiplier `1.0` and an explicitly hypothetical arrival rate such as `1.5` arrivals/minute to make queue activity visible. Run and pause during observable queue activity, then capture both the configuration and the numerical statistics. This does **not** mean `1.5` is an observed rate for the source airport.

## Troubleshooting

- **Page looks unstyled:** force reload. The corrected dashboard HTML references `dashboard-v2.css`; verify that this file exists in `docs/` and GitHub Pages has deployed it.
- **No activity yet:** start a new run, or increase playback speed. The appearance depends on the sampled event sequence and model settings.
- **Large queue:** lower arrival intensity or add stations; for long-run claims, assess stability and check the notebook's replicated analysis.
- **Expected mean wait absent at the start:** the dashboard shows no estimate until a passenger has started service.

## Source and attribution

Original dataset: *Airport Security Checkpoint Data*, Janssen et al., TU Delft / 4TU.ResearchData, CC BY 4.0. Source details and cleaning choices are documented in [`data/README.md`](data/README.md), with citations in [`REFERENCES.md`](REFERENCES.md).
