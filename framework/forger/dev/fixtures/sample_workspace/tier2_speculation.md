# Tier 2 Speculation

## tier2_entry: 'Cache eviction via Bloom filter'
- idea: 'Use a Bloom filter to short-circuit cache lookups before key hashing.'
- why_speculative: 'Not in production lane sources; mechanism unverified for this workload.'
- validation_plan: 'Prototype with N=100k keys, compare hit-rate vs direct lookup.'
- frontier_seed_refs: []
- promoted_at: null
