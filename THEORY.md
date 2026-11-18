# Model notes (draft)
One FIFO queue with c parallel servers. State: queue and completion events.
For the M/M/c baseline, Poisson arrivals with rate λ and exponential service times with rate μ per station.
Stability for infinite-horizon steady state: λ < c μ.
The empirical service-time model is M/G/c; M/M/c formulas are not its analytic benchmark.
Waiting-time uncertainty must be estimated across independent replications, not by treating correlated passengers as independent.
