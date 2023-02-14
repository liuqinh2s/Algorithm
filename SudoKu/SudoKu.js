import { DancingLinks } from "../DancingLinksX/DancingLinksX";
class SudoKu {
    /**
     * 生成数独解空间：729*324的01矩阵
     * 用舞蹈链来表示这个矩阵
     */
    build(matrix) {
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
                    section4[(Math.floor(i / 3) + Math.floor(j / 3) * 3) * 9 + k - 1] = 1;
                    matrix.push([...section1, ...section2, ...section3, ...section4]);
                }
            }
        }
        return matrix;
    }
    /**
     * 把数独图转为精确覆盖问题01矩阵的一行
     * @param sudoKu
     * @returns
     */
    sudoKu2ExactCoverLine(sudoKu) {
        const section1 = new Array(81).fill(0);
        const section2 = new Array(81).fill(0);
        const section3 = new Array(81).fill(0);
        const section4 = new Array(81).fill(0);
        // 行
        for (let i = 0; i < 9; i++) {
            // 列
            for (let j = 0; j < 9; j++) {
                const k = sudoKu[i][j];
                if (k > 0 && k <= 9) {
                    section1[i * 9 + j] = 1;
                    section2[i * 9 + k - 1] = 1;
                    section3[j * 9 + k - 1] = 1;
                    section4[(Math.floor(i / 3) + Math.floor(j / 3) * 3) * 9 + k - 1] = 1;
                }
            }
        }
        return [...section1, ...section2, ...section3, ...section4];
    }
    /**
     * 根据精确覆盖问题01矩阵和答案反推数独图
     * @param sudoKu
     * @param matrix
     * @param ans
     */
    static exactCoverMatrix2SudoKuMatrix(matrix, ans, sudoKu) {
        if (!sudoKu) {
            sudoKu = SudoKu.buildEmptySudoKu();
        }
        else {
            sudoKu = JSON.parse(JSON.stringify(sudoKu));
        }
        for (let i = 1; i < ans.length; i++) {
            const line = matrix[ans[i]];
            let row, column;
            for (let j = 0; j < 81; j++) {
                // 从坐标区域找某个坐标是否填了数字
                if (line[j] === 1) {
                    row = Math.floor(j / 9);
                    column = j % 9;
                }
            }
            let number;
            // 从行区域找某行填了哪个数字
            for (let j = 81 + row * 9; j < 81 + row * 9 + 9; j++) {
                if (line[j] === 1) {
                    number = j - 81 - row * 9 + 1;
                }
            }
            if (number > 0) {
                sudoKu[row][column] = number;
            }
        }
        console.log("数独图:", JSON.stringify(sudoKu));
        return sudoKu;
    }
    /**
     * 创建空的数独
     */
    static buildEmptySudoKu() {
        let res = [];
        for (let i = 0; i < 9; i++) {
            res.push(new Array(9).fill(0));
        }
        return res;
    }
    constructor(sudoKu) {
        const matrix = [this.sudoKu2ExactCoverLine(sudoKu)];
        this.build(matrix);
        const dancingLinks = new DancingLinks(sudoKu).inputMatrix(matrix);
        const res = SudoKu.exactCoverMatrix2SudoKuMatrix(matrix, dancingLinks.ans, sudoKu);
        console.log(res);
    }
}
function test() {
    // 43个空格
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
