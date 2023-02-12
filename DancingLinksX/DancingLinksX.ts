// 舞蹈链节点
interface DancingLinksNode {
    left: DancingLinksNode;
    right: DancingLinksNode;
    up: DancingLinksNode;
    down: DancingLinksNode;
    row: number;
    column: number;
    value?: number;
}

// 链表的遍历方向
enum Direction {
    vertical = 'vertical',
    horizontal = 'horizontal'
}

class DancingLinks {
    head;   // 表头
    columnHeadArray;    // 列头
    rowHeadArray;   // 行头
    deleteNodes = [];    // 删除的节点
    ans: Array<number> = [];    // 答案记录
    isAllOne: boolean = false;  // 最后一次删除的行是否全1
    constructor(X: Array<number>, S: Array<Array<number>>) {
        const matrix = this.newMatrix(X, S);
        const head = this.build(matrix);
        const hasAns = this.dance(head)
        if (hasAns) {
            console.log('答案:', this.ans);
        } else {
            this.ans = [];
            console.log('No Answer');
        }
    }
    /**
     * 递归缩小问题规模
     * @param head 表头
     * @returns 
     */
    dance(head) {
        if (head.right === head || head.down === head) {
            // 矩阵为空
            if (this.isAllOne) {
                return true;
            } else {
                return false;
            }
        }
        let p = head.down;
        let res = false;
        while (p !== head) {
            console.log(p.row);
            this.ans.push(p.row);
            this.isAllOne = this.getMatrixWidth(head) === this.getMatrixWidth(p);
            // 删除操作
            const deleteNodes = this.remove(p, head);
            this.deleteNodes.push(deleteNodes);
            if (this.dance(head)) {
                res = true;
                break;
            }
            this.ans.pop();
            // 恢复操作
            this.recover(this.deleteNodes.pop());
            this.showMatrix(head);
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
    build(matrix: Array<Array<1 | 0>>) {
        // 先初始化一个表头元素
        const head = newHead();
        // 一组列头元素和行头元素
        const columnHeadArray = newColumnHead(matrix, head);
        const rowHeadArray = newRowHead(matrix, head);
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] == 1) {
                    const node: any = {
                        row: i,
                        column: j,
                        up: columnHeadArray[j].up,
                        down: columnHeadArray[j],
                        right: rowHeadArray[i],
                        left: rowHeadArray[i].left
                    }
                    // 修改上下左右节点的指针
                    // 左
                    rowHeadArray[i].left.right = node;
                    // 右
                    rowHeadArray[i].left = node;
                    rowHeadArray[i].count++;
                    // 上
                    columnHeadArray[j].up.down = node;
                    // 下
                    columnHeadArray[j].up = node;
                    columnHeadArray[j].count++;
                }
            }
        }
        this.head = head;
        this.columnHeadArray = columnHeadArray;
        this.rowHeadArray = rowHeadArray;
        this.showMatrix(head);
        return head;

        /**
        * 生成一个表头节点
        */
        function newHead() {
            const head: any = {
                right: null,
                left: null,
                up: null,
                down: null
            }
            head.right = head;
            head.left = head;
            head.up = head;
            head.down = head;
            return head;
        }
        /**
         * 生成列头
         */
        function newColumnHead(matrix: Array<Array<1 | 0>>, head) {
            const columnHeadArray: Array<any> = [];
            for (let i = 0; i < matrix[0].length; i++) {
                const node: any = {
                    count: 0,
                    column: i,
                    right: head,
                    left: head.left,
                    up: null,
                    down: null
                }
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
        function newRowHead(matrix: Array<Array<1 | 0>>, head) {
            const rowHeadArray: Array<any> = [];
            for (let i = 0; i < matrix.length; i++) {
                const node: any = {
                    count: 0,
                    row: i,
                    right: null,
                    left: null,
                    down: head,
                    up: head.up
                }
                node.right = node;
                node.left = node;
                head.up.down = node;
                head.up = node;
                rowHeadArray.push(node);
            }
            return rowHeadArray;
        }
    }
    newMatrix(X: Array<number>, S: Array<Array<number>>) {
        let res = [];
        for (let i = 0; i < S.length; i++) {
            let row = new Array(X.length).fill(0);
            for (let j = 0; j < S[i].length; j++) {
                row[X.indexOf(S[i][j])] = 1;
            }
            res.push(row);
        }
        console.log(res)
        return res;
    }
    /**
     * 获取一行数据
     * @param rowHead 
     */
    getRow(rowHead) {
        const matrixWidth = this.getMatrixWidth(this.head);
        console.log('matrixWidth:', matrixWidth);
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
        console.log('matrixHeight:', matrixHeight);
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
        this.showMatrix(head);
        // 删除相应行
        const nodes2: any = [...nodes1];
        for (let i = 0; i < nodes1.length; i++) {
            if (!nodes1[i].hasOwnProperty('row')) {
                const nodes = this.removeAllRow(nodes1[i]);
                nodes2.push(...nodes);
            }
        }
        this.showMatrix(head);
        return [...new Set(nodes2)];
    }
    /**
     * 删除某行关联的所有列
     * @param node 一行中的某个节点
     */
    removeAllColumn(node: DancingLinksNode) {
        console.log('removeAllColumn');
        let p = this.rowHeadArray[node.row];
        const res: any = [];
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
    removeAllRow(node: DancingLinksNode) {
        console.log('removeAllRow');
        let p = this.columnHeadArray[node.column];
        const res: any = [];
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
        if (!node || !node.hasOwnProperty('column')) {
            return [];
        }
        if (this.isColumnDeleted(node)) {
            return [];
        }
        const columnHead = this.columnHeadArray[node.column];
        let p = columnHead;
        const res: any = [];
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
        if (!node || !node.hasOwnProperty('row')) {
            return [];
        }
        if (this.isRowDeleted(node)) {
            return [];
        }
        const rowHead = this.rowHeadArray[node.row];
        let p = rowHead;
        const res: any = [];
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
        if (!node || !node.hasOwnProperty('row')) {
            console.error('节点不合理:', node);
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
        if (!node || !node.hasOwnProperty('column')) {
            console.error('节点不合理:', node);
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
            if (min > this.getLinkedListLength(curNode, Direction.vertical) - 1) {
                min = curNode.count;
                minColumnHead = curNode;
            }
        }
        return minColumnHead;
    }
    /**
     * 随便给定一个非表头节点，返回列头
     * @param node 
     */
    getColumnHead(node: DancingLinksNode) {
        let p = node;
        while (!p.hasOwnProperty('count')) {
            p = p.down;
        }
        return p;
    }
    /**
     * 随便给定一个非表头节点，返回行头
     * @param node 
     * @returns 
     */
    getRowHead(node: DancingLinksNode) {
        let p = node;
        while (!p.hasOwnProperty('count')) {
            p = p.right;
        }
        return p;
    }
    /**
     * 返回列头的坐标
     * @param columnHead 
     */
    getColumnIndex(columnHead: DancingLinksNode) {
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
    getRowIndex(rowHead: DancingLinksNode) {
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
        let res: any = [];
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
    getLinkedListLength(node, direction: Direction) {
        console.log('getLinkedListLength');
        if (!node) {
            return 0;
        }
        let p = node;
        let count = 0;
        while (true) {
            p = direction === Direction.horizontal ? p.right : p.down;
            count++;
            if (p === node) {
                break;
            }
        }
        return count;
    }
    /**
     * 获取当前矩阵的宽（一行多少个元素，包括0和1）
     * @param head 当前行的某个节点
     */
    getMatrixWidth(head) {
        console.log('getMatrixWidth');
        return this.getLinkedListLength(head, Direction.horizontal) - 1
    }
    /**
     * 获取当前矩阵的高（一列多少个元素，包括0和1）
     * @param head 当前行的某个节点
     */
    getMatrixHeight(head) {
        console.log('getMatrixHeight');
        return this.getLinkedListLength(head, Direction.vertical) - 1
    }
}

function test() {
    const testData = [{
        input: {
            X: [1, 3, 5, 8, 9, 17, 119],
            S: [[5, 9, 17], [1, 8, 119], [3, 5, 17], [1, 8], [3, 119], [8, 9, 119]],
        },
        output: [0, 3, 4]
    }, {
        input: {
            X: [1, 2, 3, 4, 5, 6],
            S: [[1, 3, 5], [2, 4], [2, 3, 4, 5, 6], [2, 4, 6]],
        },
        output: [0, 3]
    }, {
        input: {
            X: [1, 2, 3, 4, 5, 6, 7],
            S: [[1, 4, 7], [1, 4], [4, 5, 7], [3, 5, 6], [2, 3, 6, 7], [2, 7]]
        },
        output: [1, 3, 5]
    }, {
        input: {
            X: [1, 2, 3, 4, 5, 6, 7],
            S: [[1, 4, 7], [1, 5], [4, 5, 7], [3, 5, 6], [2, 3, 6, 7], [2, 7]]
        },
        output: []
    }]
    for (let i = 0; i < testData.length; i++) {
        const { input, output } = testData[i];
        const { X, S } = input;
        const dancingLinks = new DancingLinks(X, S);
        if (!arrayIsEqual(dancingLinks.ans, output)) {
            console.error(input, '\n期望输出:\n', output, '\n实际输出:\n', dancingLinks);
            return;
        }
    }
    console.log('AC')

    function arrayIsEqual(arr1, arr2) {
        return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
    }
}

test();