# CAP AR-native Training: Evidence

## Public evidence boundary

The canonical article uses representative autoregressive and continuous-generation work to motivate an architectural comparison. Those sources do not by themselves prove that the complete proposed CAP stack has been implemented or benchmarked.

## Route inferences

- An explicit AR strategy trace may reuse the training and inference habits of language and multimodal models.
- Matching training targets to inference-time strategy steps may reduce representation translation and improve observability.
- Continuous-generation methods can remain valuable for trajectories and lower-level action without owning high-level strategy.

## Claims to verify

- Quality and sample efficiency against matched FM or diffusion strategy baselines.
- Whether explicit traces improve diagnosis and recovery rather than merely adding verbosity.
- The performance cost of discrete strategy generation in time-sensitive tasks.
