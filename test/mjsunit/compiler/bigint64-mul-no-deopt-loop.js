// Copyright 2022 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Flags: --allow-natives-syntax --turbofan --no-always-turbofan

(function OptimizeAndTestOverflow() {
  function f(x, y) {
    return x * y;
  }
  %PrepareFunctionForOptimization(f);
  assertEquals(0n, f(0n, 1n));
  assertEquals(18n, f(2n, 9n));
  %OptimizeFunctionOnNextCall(f);
  assertEquals(70n, f(14n, 5n));
  assertOptimized(f);
  assertEquals(-(2n ** 63n), f(-(2n ** 32n), 2n ** 31n));
  assertOptimized(f);
  // CheckedBigInt64Mul will trigger deopt due to overflow.
  assertEquals(-(2n ** 63n) - 1n, f(-77158673929n, 119537721n));
  if (%Is64Bit()) {
    assertUnoptimized(f);

    %PrepareFunctionForOptimization(f);
    assertEquals(0n, f(0n, 1n));
    assertEquals(18n, f(2n, 9n));
    %OptimizeFunctionOnNextCall(f);
    assertEquals(70n, f(14n, 5n));
    assertOptimized(f);
    // Ensure there is no deopt loop.
    assertEquals(-(2n ** 63n) - 1n, f(-77158673929n, 119537721n));
    assertOptimized(f);
  }
})();
