# Model notes (draft)
One FIFO queue with c parallel servers. State: queue and completion events.
For the M/M/c baseline, Poisson arrivals with rate λ and exponential service times with rate μ per station.
Stability for infinite-horizon steady state: λ < c μ.
The empirical service-time model is M/G/c; M/M/c formulas are not its analytic benchmark.
Waiting-time uncertainty must be estimated across independent replications, not by treating correlated passengers as independent.

## Numerical metric convention (cross-language audit)
Time-weighted mean queue length is the area under the waiting-queue count divided by the **final departure time measured from simulation time 0**. Station utilisation is total occupied-station time divided by station count times the same observation horizon. This convention is shared by Python and JavaScript.
For stochastic experiments, customer waiting means exclude a warm-up prefix; this is different from the finite event-trace time-average counters, which are whole-trace descriptions.
