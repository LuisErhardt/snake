export function initGrid(size: number): boolean[][] {
  const grid: boolean[][] = [];
  for (let i = 0; i < size; i++) {
    grid[i] = [];
    for (let j = 0; j < size; j++) {
      grid[i][j] = false;
    }
  }
  return grid;
}

export function randomAntPosition(size: number) {
  return { x: Math.floor(Math.random() * size), y: Math.floor(Math.random() * size) };
}
