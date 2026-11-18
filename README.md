# Airport Baggage Inspection Queue Simulator

[Open in Google Colab](https://colab.research.google.com/github/KawanRupasinghe/airport-baggage-queue/blob/main/notebook/airport-baggage-queue.ipynb) | [Interactive Web Demo](https://kawanrupasinghe.github.io/airport-baggage-queue/)

## 1. Overview

A data-informed discrete-event simulation investigating how staffing levels affect passenger waiting times at a hypothetical airport secondary baggage-inspection queue.

The model combines an analytical M/M/c baseline with an empirical-service M/G/c simulation.

## 2. Research Question

How does the number of parallel baggage-inspection stations affect waiting times under different assumed passenger arrival rates and observed inspection-service durations?

## 3. Mathematical Model

The system consists of a single FIFO queue feeding multiple identical inspection stations.

- Passenger arrivals follow a Poisson process.
- The M/M/c baseline uses exponentially distributed service times.
- The M/G/c model samples service times from an empirical dataset.
- Queue stability, waiting times, queue length and station utilisation are investigated.

The M/M/c baseline is verified against analytical queueing formulas. These formulas are not treated as exact solutions for the empirical M/G/c model.

## 4. Data Sources

The project uses [Airport Security Checkpoint Data](https://research.tudelft.nl/en/datasets/airport-security-checkpoint-data/), published through TU Delft and 4TU.ResearchData.

After documented cleaning, 162 valid manual baggage-inspection durations were retained.

- Mean duration: 59.97 seconds
- Median duration: 42 seconds
- Minimum duration: 3 seconds
- Maximum duration: 276 seconds

The dataset is used to calibrate service durations only. Arrival rates, staffing arrangements and shared-queue configuration are scenario assumptions.

The original dataset is licensed under CC BY 4.0.

## 5. Implementation

The numerical simulation is implemented in Python and supports independent seeded replications.

The interactive browser demonstration uses HTML, CSS and JavaScript and runs without a server.

## 6. Reproducibility

Install the Python dependencies:

```bash
python -m pip install -r requirements.txt
```

Execute Python tests:

```bash
python -m pytest -q
```

Execute browser numerical tests:

```bash
node tests/test_browser.js
```

The Colab notebook contains the simulator, analytical checks, experiments and confidence intervals. It loads the published cleaned CSV when necessary.

## 7. Verification

Verification includes:

- Hand-calculated event traces
- FIFO ordering and conservation checks
- M/M/c analytical comparisons
- M/M/1 analytical verification
- Monte Carlo sampling-error scaling
- Deterministic Python–JavaScript consistency tests

Cross-language comparisons use identical arrival and service-time traces rather than assuming equivalent random-number generators.

## 8. Experiments

The experiments investigate:

- Arrival rates of 0.40, 0.65 and 0.85 passengers/minute
- One, two and three inspection stations
- Service-time multipliers of 0.8, 1.0 and 1.2

Repeated simulations generate waiting-time estimates and confidence intervals.

A 0.5-minute average waiting-time target is used for an illustrative staffing decision.

## 9. Web Demonstration

The [interactive web demo](https://kawanrupasinghe.github.io/airport-baggage-queue/) provides adjustable parameters, a live queue visualisation and numerical statistics.

It supports Start, Pause/Resume, Reset and a deterministic reference scenario.

## 10. Project Structure

```text
airport-baggage-queue/
├── data/
├── docs/
├── notebook/
├── src/
├── tests/
├── README.md
├── THEORY.md
├── USER_GUIDE.md
├── REFERENCES.md
├── requirements.txt
└── LICENSE
```

## 11. Limitations

The dataset contains selected baggage-inspection service timestamps, not observed arrivals to the hypothetical queue.

The model assumes independent service times, identical stations and Poisson arrivals. It omits priority processing, passenger abandonment, operator breaks and full checkpoint interactions.

Results are conditional on model assumptions and must not be interpreted as validated staffing recommendations for an actual airport.

## 12. Documentation

- [Theory and assumptions](THEORY.md)
- [User guide](USER_GUIDE.md)
- [Data cleaning methodology](data/README.md)
- [References](REFERENCES.md)

## 13. Licensing and Acknowledgements

Original project software is licensed under the [MIT License](LICENSE).

The dataset and its derivative records are attributed to their original researchers through TU Delft/4TU.ResearchData under CC BY 4.0.

AI assistance contributed to the development of software and documentation. Numerical outputs and academic conclusions remain subject to independent review.
