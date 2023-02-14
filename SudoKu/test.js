/**
 * 这个舞蹈链数据结构的设计如下：
 * 1. 只存1节点（稀疏矩阵）
 * 2. 辅助节点：总表头head（一个节点，可以看做是整个表格的起点），列头columnHead（每一列都有一个列头节点），行头rowHead（每一行都有一个行头节点）
 */
// 链表的遍历方向
var Direction;
(function (Direction) {
    Direction["vertical"] = "vertical";
    Direction["horizontal"] = "horizontal";
})(Direction || (Direction = {}));
class DancingLinks {
    constructor(sudoKu) {
        this.deleteNodes = []; // 删除的节点
        this.ans = []; // 答案记录
        this.isAllOne = false; // 最后一次删除的行是否全1
        this.sudoKu = sudoKu;
    }
    inputMatrix(matrix) {
        const head = this.build(matrix);
        const hasAns = this.dance(head);
        if (hasAns) {
            console.log("答案:", this.ans);
        }
        else {
            this.ans = [];
            console.log("No Answer");
        }
        return this;
    }
    inputSet(X, S) {
        const matrix = this.newMatrix(X, S);
        this.inputMatrix(matrix);
        return this;
    }
    /**
     * 递归缩小问题规模
     * @param head 表头
     * @returns
     */
    dance(head) {
        if (head.right === head || head.down === head) {
            console.log("矩阵为空:", "宽是0:", head.right === head, "高是0:", head.down === head);
            console.log("目前答案:", this.ans);
            SudoKu.exactCoverMatrix2SudoKuMatrix(this.matrix, this.ans, this.sudoKu);
            // 矩阵为空
            if (this.isAllOne) {
                return true;
            }
            else {
                return false;
            }
        }
        let p = head.down;
        let res = false;
        while (p !== head) {
            // console.log(p.row);
            this.ans.push(p.row);
            const matrixWidth = this.getMatrixWidth(head);
            this.isAllOne = matrixWidth === this.getMatrixWidth(p);
            // 删除操作
            const deleteNodes = this.remove(p, head);
            this.deleteNodes.push(deleteNodes);
            // console.log(
            //   "删除后:",
            //   "宽:",
            //   this.getMatrixWidth(head),
            //   " 高:",
            //   this.getMatrixHeight(head),
            //   this.ans
            // );
            // this.showMatrix(head);
            if (this.dance(head)) {
                res = true;
                break;
            }
            this.ans.pop();
            // 恢复操作
            this.recover(this.deleteNodes.pop());
            // console.log(
            //   "恢复后:",
            //   "宽:",
            //   this.getMatrixWidth(head),
            //   " 高:",
            //   this.getMatrixHeight(head),
            //   this.ans
            // );
            // this.showMatrix(head);
            p = p.down;
        }
        return res;
    }
    /**
     * 根据01矩阵，新建一个dancing links
     * dancing links只记录1
     * @param row 行数
     * @param column 列数
     */
    build(matrix) {
        this.matrix = matrix;
        // 先初始化一个表头元素
        const head = newHead();
        // 一组列头元素和行头元素
        const columnHeadArray = newColumnHead(matrix, head);
        const rowHeadArray = newRowHead(matrix, head);
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] == 1) {
                    const node = {
                        row: i,
                        column: j,
                        up: columnHeadArray[j].up,
                        down: columnHeadArray[j],
                        right: rowHeadArray[i],
                        left: rowHeadArray[i].left,
                    };
                    // 修改上下左右节点的指针
                    // 左
                    rowHeadArray[i].left.right = node;
                    // 右
                    rowHeadArray[i].left = node;
                    // 上
                    columnHeadArray[j].up.down = node;
                    // 下
                    columnHeadArray[j].up = node;
                }
            }
        }
        this.head = head;
        this.columnHeadArray = columnHeadArray;
        this.rowHeadArray = rowHeadArray;
        // this.showMatrix(head);
        return head;
        /**
         * 生成一个表头节点
         */
        function newHead() {
            const head = {
                right: null,
                left: null,
                up: null,
                down: null,
            };
            head.right = head;
            head.left = head;
            head.up = head;
            head.down = head;
            return head;
        }
        /**
         * 生成列头
         */
        function newColumnHead(matrix, head) {
            const columnHeadArray = [];
            for (let i = 0; i < matrix[0].length; i++) {
                const node = {
                    column: i,
                    right: head,
                    left: head.left,
                    up: null,
                    down: null,
                };
                node.up = node;
                node.down = node;
                head.left.right = node;
                head.left = node;
                columnHeadArray.push(node);
            }
            return columnHeadArray;
        }
        /**
         * 生成行头
         */
        function newRowHead(matrix, head) {
            const rowHeadArray = [];
            for (let i = 0; i < matrix.length; i++) {
                const node = {
                    row: i,
                    right: null,
                    left: null,
                    down: head,
                    up: head.up,
                };
                node.right = node;
                node.left = node;
                head.up.down = node;
                head.up = node;
                rowHeadArray.push(node);
            }
            return rowHeadArray;
        }
    }
    newMatrix(X, S) {
        let res = [];
        for (let i = 0; i < S.length; i++) {
            let row = new Array(X.length).fill(0);
            for (let j = 0; j < S[i].length; j++) {
                row[X.indexOf(S[i][j])] = 1;
            }
            res.push(row);
        }
        // console.log(res);
        return res;
    }
    /**
     * 获取一行数据
     * @param rowHead
     */
    getRow(rowHead) {
        const matrixWidth = this.getMatrixWidth(this.head);
        // console.log("matrixWidth:", matrixWidth);
        if (matrixWidth < 1) {
            return [];
        }
        let row = new Array(matrixWidth).fill(0);
        let node = rowHead.right;
        while (node !== rowHead) {
            const columnHead = this.getColumnHead(node);
            const index = this.getColumnIndex(columnHead);
            row[index] = 1;
            node = node.right;
        }
        return row;
    }
    /**
     * 获取一列数据
     * @param columnHead
     */
    getColumn(columnHead) {
        const matrixHeight = this.getMatrixHeight(this.head);
        // console.log("matrixHeight:", matrixHeight);
        if (matrixHeight < 1) {
            return [];
        }
        let res = new Array(matrixHeight).fill(0);
        let node = columnHead.down;
        while (node !== columnHead) {
            const rowHead = this.getRowHead(node);
            const index = this.getRowIndex(rowHead);
            res[index] = 1;
            node = node.down;
        }
        return res;
    }
    remove(p, head) {
        // 删除相应的列
        const nodes1 = this.removeAllColumn(p);
        // this.showMatrix(head);
        // 删除相应行
        const nodes2 = [...nodes1];
        for (let i = 0; i < nodes1.length; i++) {
            if (!nodes1[i].hasOwnProperty("row")) {
                const nodes = this.removeAllRow(nodes1[i]);
                nodes2.push(...nodes);
            }
        }
        // this.showMatrix(head);
        return [...new Set(nodes2)];
    }
    /**
     * 删除某行关联的所有列
     * @param node 一行中的某个节点
     */
    removeAllColumn(node) {
        // console.log("removeAllColumn");
        let p = this.rowHeadArray[node.row];
        const res = [];
        while (true) {
            const deleteNodes = this.removeColumn(p);
            res.push(...deleteNodes);
            p = p.right;
            if (p === node) {
                break;
            }
        }
        return res;
    }
    /**
     * 删除某列关联的所有行
     * @param node
     */
    removeAllRow(node) {
        // console.log("removeAllRow");
        let p = this.columnHeadArray[node.column];
        const res = [];
        while (true) {
            const deleteNodes = this.removeRow(p);
            res.push(...deleteNodes);
            p = p.down;
            if (p === node) {
                break;
            }
        }
        return res;
    }
    /**
     * 删除一列
     * @param curNode 一列中的某个节点
     */
    removeColumn(node) {
        // 给定这个节点不能为空，且必须有column属性（行头没有column属性，不应该删除行表头那一列）
        if (!node || !node.hasOwnProperty("column")) {
            return [];
        }
        if (this.isColumnDeleted(node)) {
            return [];
        }
        const columnHead = this.columnHeadArray[node.column];
        let p = columnHead;
        const res = [];
        while (true) {
            if (p.left.right === p && p.right.left === p) {
                p.left.right = p.right;
                p.right.left = p.left;
                res.push(p);
            }
            p = p.down;
            if (p === columnHead) {
                break;
            }
        }
        return res;
    }
    /**
     * 删除一行
     * @param node 一行中的某个节点
     * @returns
     */
    removeRow(node) {
        if (!node || !node.hasOwnProperty("row")) {
            return [];
        }
        if (this.isRowDeleted(node)) {
            return [];
        }
        const rowHead = this.rowHeadArray[node.row];
        let p = rowHead;
        const res = [];
        while (true) {
            if (p.up.down === p && p.down.up === p) {
                p.up.down = p.down;
                p.down.up = p.up;
                res.push(p);
            }
            p = p.right;
            if (p == rowHead) {
                break;
            }
        }
        return res;
    }
    /**
     * 判断一行是否已经移除
     * @param rowHead
     */
    isRowDeleted(node) {
        if (!node || !node.hasOwnProperty("row")) {
            console.error("节点不合理:", node);
        }
        const rowHead = this.rowHeadArray[node.row];
        let p = this.head.down;
        while (p !== this.head) {
            if (p === rowHead) {
                return false;
            }
            p = p.down;
        }
        return true;
    }
    /**
     * 判断一列是否被移除
     * @param node
     * @returns
     */
    isColumnDeleted(node) {
        if (!node || !node.hasOwnProperty("column")) {
            console.error("节点不合理:", node);
        }
        const columnHead = this.columnHeadArray[node.column];
        let p = this.head.right;
        while (p !== this.head) {
            if (p === columnHead) {
                return false;
            }
            p = p.right;
        }
        return true;
    }
    /**
     * 恢复节点
     * @param columnHead 列头节点
     * @returns
     */
    recover(nodes) {
        for (let i = 0; i < nodes.length; i++) {
            const p = nodes[i];
            p.left.right = p;
            p.right.left = p;
            p.down.up = p;
            p.up.down = p;
        }
    }
    /**
     * 获取1最少的列
     * @param head
     * @returns 返回该列的列头节点
     */
    getMinColumn(head) {
        let curNode = head.right;
        let min = this.getLinkedListLength(curNode, Direction.vertical) - 1;
        let minColumnHead = curNode;
        while (curNode !== head) {
            curNode = curNode.right;
            const length = this.getLinkedListLength(curNode, Direction.vertical) - 1;
            if (min > length) {
                min = length;
                minColumnHead = curNode;
            }
        }
        return minColumnHead;
    }
    /**
     * 随便给定一个非表头节点，返回列头
     * @param node
     */
    getColumnHead(node) {
        let p = node;
        while (p.hasOwnProperty("row")) {
            p = p.down;
        }
        return p;
    }
    /**
     * 随便给定一个非表头节点，返回行头
     * @param node
     * @returns
     */
    getRowHead(node) {
        let p = node;
        while (p.hasOwnProperty("column")) {
            p = p.right;
        }
        return p;
    }
    /**
     * 返回列头的坐标
     * @param columnHead
     */
    getColumnIndex(columnHead) {
        let p = this.head;
        let index = -1;
        while (p !== columnHead) {
            p = p.right;
            index++;
        }
        return index;
    }
    /**
     * 返回行头的坐标
     * @param rowHead
     * @returns
     */
    getRowIndex(rowHead) {
        let p = this.head;
        let index = -1;
        while (p !== rowHead) {
            p = p.down;
            index++;
        }
        return index;
    }
    /**
     * 打印当前矩阵
     * @param head
     */
    showMatrix(head) {
        let p = head.down;
        let res = [];
        while (p !== head) {
            const rowCount = this.getMatrixWidth(head);
            if (rowCount > 0) {
                const row = this.getRow(p);
                res.push(row);
            }
            p = p.down;
        }
        console.log(res);
    }
    /**
     * 获取链表长度
     * @param node 当前行的某个节点
     */
    getLinkedListLength(node, direction) {
        // console.log("getLinkedListLength");
        if (!node) {
            return 0;
        }
        let p = node;
        let length = 0;
        while (true) {
            p = direction === Direction.horizontal ? p.right : p.down;
            length++;
            if (p === node) {
                break;
            }
        }
        return length;
    }
    /**
     * 获取当前矩阵的宽（一行多少个元素，包括0和1）
     * @param head 当前行的某个节点
     */
    getMatrixWidth(head) {
        // console.log("getMatrixWidth");
        return this.getLinkedListLength(head, Direction.horizontal) - 1;
    }
    /**
     * 获取当前矩阵的高（一列多少个元素，包括0和1）
     * @param head 当前行的某个节点
     */
    getMatrixHeight(head) {
        // console.log("getMatrixHeight");
        return this.getLinkedListLength(head, Direction.vertical) - 1;
    }
}
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
        SudoKu.exactCoverMatrix2SudoKuMatrix(matrix, dancingLinks.ans, sudoKu);
        console.log(sudoKu);
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
