/**
 * Promise 처리 관련 유틸리티 함수들
 */

/**
 * Promise를 반환하는 함수들을 청크 단위로 나누어 순차적으로 병렬 실행하는 헬퍼 함수
 *
 * 대량의 API 호출 시 서버 부하를 줄이기 위해 청크 단위로 나누어 실행합니다.
 * 각 청크는 병렬로 실행되지만, 청크 간에는 순차적으로 실행됩니다.
 *
 * @example
 * ```typescript
 * const userIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 * const fetchFunctions = userIds.map(id => () => fetchUser(id));
 * const results = await runPromisesInChunks(fetchFunctions, 3);
 * // 3개씩 병렬 실행: [1,2,3] -> [4,5,6] -> [7,8,9] -> [10]
 * ```
 *
 * @param promiseFunctions 실행할 Promise를 반환하는 함수들의 배열
 * @param chunkSize 한 번에 병렬로 실행할 Promise의 개수
 * @returns 모든 Promise의 결과가 병합된 배열
 */
export async function runPromisesInChunks<T>(
  promiseFunctions: (() => Promise<T>)[],
  chunkSize: number
): Promise<T[]> {
  const results: T[] = [];

  // promises 배열을 chunkSize 크기의 청크로 나눕니다.
  for (let i = 0; i < promiseFunctions.length; i += chunkSize) {
    const chunk = promiseFunctions.slice(i, i + chunkSize);

    // Promise.all을 사용하여 현재 청크의 요청들을 병렬로 실행합니다.
    const chunkResults = await Promise.all(chunk.map(fn => fn()));

    // 결과를 병합합니다.
    results.push(...chunkResults);
  }

  return results;
}
