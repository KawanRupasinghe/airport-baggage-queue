# Mathematical model and interpretation

## Problem formulation

The research model is a **hypothetical** single FIFO waiting line feeding `c` identical parallel manual baggage-inspection stations. The model studies how assumed demand and service-time variation affect queue waiting time. This is not a calibrated whole-airport checkpoint.

### Model families

- **M/M/c**: Poisson arrivals at rate `lambda` passengers/minute, independent exponentially distributed service times at rate `mu` per station, `c` stations, FIFO and unbounded waiting capacity. This analytically tractable baseline is used to verify code.
- **M/G/c**: the same assumed Poisson arrival model and FIFO station configuration, but service times are sampled **with replacement** from the 162 recorded manual baggage-check durations. This preserves the observed empirical duration distribution rather than imposing an exponential service distribution.

All queue simulation times are in minutes; the original cleaned service data are in seconds and are converted explicitly before simulation.

## Stability, capacity and experimental scenarios

For mean service duration `E[S]` (minutes) and `c` stations, nominal traffic intensity is

`rho = lambda * E[S] / c`.

A steady state requires `rho < 1` for this infinite-capacity work-conserving model. Scenarios with `rho >= 1` **do not have finite steady-state mean waits**; any finite-horizon waiting-time estimate from them must not be reported as a steady-state estimate. In this project's illustrative grid, the combination `lambda=0.85/min`, `c=1`, and a 1.2 service-time multiplier is unstable.

## Analytical reference: M/M/c

Let `a=lambda/mu` and `rho=lambda/(c*mu)`, with `rho < 1`. Then:

```
P0 = [ sum_{k=0}^{c-1}(a^k/k!) + a^c/(c!*(1-rho)) ]^(-1)
P(wait) = [ a^c/(c!*(1-rho)) ] * P0
E[Wq] = P(wait) / (c*mu-lambda)
```

For `c=1`, the M/M/1 reference simplifies to `E[Wq]=lambda/(mu*(mu-lambda))`. For example, `lambda=0.55/min` and `mu=1/min` imply `E[Wq]=1.222222... minutes`. These M/M/c formulas are **not exact formulas for the M/G/c empirical-service model**.

## Event-driven simulator

The simulator maintains a time-ordered future event list, FIFO queue of passenger indices, busy-server array and counters. A simulation clock jumps to the next arrival/departure event. Departures at a timestamp are processed before arrivals at the same timestamp. Waiting time is `start-of-service minus arrival` for each passenger.

At time `t`:

- `Q(t)` is the number waiting, excluding those already in service.
- `B(t)` is the number of occupied servers.
- The time-weighted queue average over `[0,T]` is `integral_0^T Q(t) dt / T`.
- Aggregate server utilisation over the same window is `integral_0^T B(t) dt / (c*T)`.
- The mean observed passenger wait is the average of included passenger waiting times; it is **not** the same as time-weighted queue length.

The browser's one-run cumulative counters, finite event-trace statistics and notebook's post-warm-up replication estimates serve different purposes. The browser does not present an across-replication confidence interval.

## Random sampling, verification and statistical inference

The notebook samples exponential interarrival intervals for Poisson traffic and independently resamples empirical service times for M/G/c experiments. It uses seeded experiments for reproducibility. The code is checked using hand-calculated deterministic traces, M/M/c analytical comparisons, independent FIFO calculations and cross-language consistency traces; no single test proves real-world predictive validity.

To reduce finite-run initialization effects, stochastic output analysis excludes a warm-up prefix before computing passenger-average queue waits. Independent replications, rather than individual passengers pooled across one run, are the units for Monte Carlo confidence intervals. The X2 study measures Monte Carlo error directly against the known M/M/1 mean and studies error as the number of independent replications changes.

## Input-data uncertainty and limitations

The 162 positive source service durations come from 13 documented collection sessions. Bootstrapping individual durations treats them as exchangeable; session-cluster resampling probes between-session uncertainty but does not correct for all sampling biases. The data do not identify the **arrival intensity**, actual queue topology, number of stations, abandonment, priorities, work shifts, service dependence or operator-specific heterogeneity. Consequently every staffing result is **conditional on the stated hypothetical assumptions** and is not a recommendation for the actual airport.

## Reproduction

Open [`notebook/airport-baggage-queue.ipynb`](notebook/airport-baggage-queue.ipynb) in Colab or run locally with `requirements.txt`. The original data provenance, exclusion rules and cleaning audit are in [`data/`](data/). See [`USER_GUIDE.md`](USER_GUIDE.md) for the browser demo.
