# TEST_STRATEGY.md

## Testing the "Limit Order" Trigger Logic

### Approach

1. **Unit Tests**
   - Added tests in `__tests__/orderExecution.test.ts` to verify:
     - Limit orders cannot be placed if the user does not have enough balance (for BUY) or holdings (for SELL).
     - Limit orders are executed automatically when the mock price engine updates the price to the trigger value.

2. **Mock Price Engine Simulation**
   - Simulated price updates by manually invoking the `tick` function in the Zustand store.
   - Checked that pending limit orders are executed when the price matches or exceeds the trigger price.

3. **State Validation**
   - Verified that portfolio balances and holdings are updated correctly after limit order execution.
   - Ensured that executed orders are moved from 'PENDING' to 'EXECUTED' status.

4. **Edge Cases**
   - Tested scenarios where multiple limit orders are pending for the same ticker.
   - Checked that only eligible orders are executed when the price condition is met.

### Manual Testing
- Used the UI to place limit orders and observed live price updates.
- Confirmed that orders execute automatically and portfolio updates instantly.

### Summary
- Limit order logic is covered by both unit tests and manual UI testing.
- The mock price engine and state management ensure reliable and consistent execution.
