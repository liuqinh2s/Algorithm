import { DancingLinks } from "../DancingLinksX/DancingLinksX";

class SudoKu {
  /**
   * 生成数独解空间：729*324的01矩阵
   * 用舞蹈链来表示这个矩阵
   */
  build(matrix: Array<Array<0 | 1>>): Array<Array<0 | 1>> {
    // 行
    for (let i = 0; i < 9; i++) {
      // 列
      for (let j = 0; j < 9; j++) {
        // 9个数
        for (let k = 1; k <= 9; k++) {
          const section1 = new Array(81).fill(0);
          section1[i * 9 + j] = 1;
          const section2 = new Array(81).fill(0);
          section2[i * 9 + k - 1] = 1;
          const section3 = new Array(81).fill(0);
          section3[j * 9 + k - 1] = 1;
          const section4 = new Array(81).fill(0);
          section4[Math.floor(i / 3) + Math.floor(j / 3) * 3 + k - 1] = 1;
          matrix.push(...section1, ...section2, ...section3, ...section4);
        }
      }
    }
    return matrix;
  }

  sudoKu2ExactCoverLine(suduKu: Array<Array<number>>) {
    const section1 = new Array(81).fill(0);
    const section2 = new Array(81).fill(0);
    const section3 = new Array(81).fill(0);
    const section4 = new Array(81).fill(0);
    // 行
    for (let i = 0; i < 9; i++) {
      // 列
      for (let j = 0; j < 9; j++) {
        const k = suduKu[i][j];
        if (k > 0 && k <= 9) {
          section1[i * 9 + j] = 1;
          section2[i * 9 + k - 1] = 1;
          section3[j * 9 + k - 1] = 1;
          section4[Math.floor(i / 3) + Math.floor(j / 3) * 3 + k - 1] = 1;
        }
      }
    }
    return ([] as any).push(...section1, ...section2, ...section3, ...section4);
  }

  constructor(suduKu: Array<Array<number>>) {
    const matrix = [this.sudoKu2ExactCoverLine(suduKu)];
    this.build(matrix);
    new DancingLinks().matrix(matrix);
  }
}

function test() {
  const testData = [
    [4, 8, 9, 5, 0, 1, 0, 2, 0],
    [7, 5, 0, 0, 0, 0, 8, 1, 0],
    [0, 0, 0, 0, 2, 0, 5, 9, 4],
    [0, 0, 8, 0, 9, 0, 0, 7, 5],
    [5, 0, 0, 0, 0, 8, 0, 0, 0],
    [0, 0, 1, 0, 0, 3, 0, 0, 0],
    [1, 6, 0, 3, 7, 4, 0, 8, 2],
    [0, 0, 0, 0, 0, 5, 7, 3, 6],
    [0, 0, 3, 0, 6, 2, 4, 5, 0],
  ];
  new SudoKu(testData);
}

test();
