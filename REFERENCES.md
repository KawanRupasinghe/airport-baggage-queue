# References and data attribution

The references below follow the numbered citations used in the academic report. These are published external works, not endorsements or validation of the hypothetical staffing assumptions.

[1] S. Janssen, R. van der Sommen, A. Dilweg, and A. Sharpanskykh, “Data-Driven Analysis of Airport Security Checkpoint Operations,” *Aerospace*, vol. 7, no. 6, article 69, 2020. https://doi.org/10.3390/aerospace7060069

[2] S. Janssen, R. van der Sommen, A. Dilweg, and A. Sharpanskykh, *Airport Security Checkpoint Data*, TU Delft / 4TU.ResearchData, 2020. https://doi.org/10.4121/UUID:6246E6A6-D149-420F-A6A4-7AFD08F154B5

[3] A. Knol, A. Sharpanskykh, and S. Janssen, “Analyzing airport security checkpoint performance using cognitive agent models,” *Journal of Air Transport Management*, vol. 75, pp. 39–50, 2019. https://doi.org/10.1016/j.jairtraman.2018.11.003

[4] J. D. C. Little, “A Proof for the Queuing Formula: L = λW,” *Operations Research*, vol. 9, no. 3, pp. 383–387, 1961. https://doi.org/10.1287/opre.9.3.383

[5] D. Gross, J. F. Shortle, J. M. Thompson, and C. M. Harris, *Fundamentals of Queueing Theory*, 4th ed., Wiley, 2008.

[6] A. M. Law, *Simulation Modeling and Analysis*, 5th ed., McGraw-Hill Education, 2015.

[7] P. Heidelberger and P. D. Welch, “Simulation run length control in the presence of an initial transient,” *Operations Research*, vol. 31, no. 6, pp. 1109–1144, 1983. https://doi.org/10.1287/opre.31.6.1109

## Where these sources apply

- [1]–[2]: observational airport-checkpoint context and provenance for the original service-time records.
- [3]: related simulation approaches, not evidence that this project's shared FIFO queue exists at the source airport.
- [4]–[5]: queueing definitions and mathematical comparisons.
- [6]–[7]: simulation methodology, replications, uncertainty and initial-transient handling.

## Dataset attribution and research limits

The primary cleaned extract has 162 positive manual baggage-check service durations from 13 sessions documented in the source README. The original records are credited to the authors of [2] and provided under CC BY 4.0. The CSV is derivative data; its cleaning rules and exclusions are documented in [`data/README.md`](data/README.md). **No passenger queue-arrival series or actual station staffing levels were calibrated from this dataset**. Those are scenario assumptions. The project's MIT code licence does not supersede the dataset's attribution/licence obligations.
