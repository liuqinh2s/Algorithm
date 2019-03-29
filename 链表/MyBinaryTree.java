import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.Queue;

public class MyBinaryTree {

    TreeNode root;

    /**
     * 接收一个整形数组，是某个二叉树的层次遍历，并用负数代表结点为空，正数的值会成为结点的值
     *
     * @param array
     * @return
     */
    public TreeNode generateTreeByArray(int[] array) {
        ArrayList<TreeNode> treeNodes = new ArrayList<>();
        if (array == null || array.length <= 0 || array[0] < 0) {
            return null;
        }
        TreeNode treeNode = new TreeNode(array[0]);
        treeNodes.add(treeNode);
        int indexParent = 0;
        int indexChild = 1;
        while (indexChild < array.length) {
            if (treeNodes.get(indexParent) != null) {
                if (array[indexChild] >= 0) {
                    treeNodes.get(indexParent).left = new TreeNode(array[indexChild]);
                    treeNodes.add(treeNodes.get(indexParent).left);
                }
                if (indexChild + 1 < array.length && array[indexChild + 1] >= 0) {
                    treeNodes.get(indexParent).right = new TreeNode(array[indexChild + 1]);
                    treeNodes.add(treeNodes.get(indexParent).right);
                }
                indexParent++;
                indexChild += 2;
            }
        }
        return treeNode;
    }

    /**
     * 《剑指offer》面试题18：树的子结构
     *
     * @param root1
     * @param root2
     * @return
     */
    public boolean HasSubtree(TreeNode root1, TreeNode root2) {
        boolean result = false;
        if (root1 != null && root2 != null) {
            result = doesTree1HaveTree2(root1, root2);
            if (!result) {
                result = HasSubtree(root1.left, root2);
            }
            if (!result) {
                result = HasSubtree(root1.right, root2);
            }
        }
        return result;
    }

    private boolean doesTree1HaveTree2(TreeNode root1, TreeNode root2) {
        if (root2 == null) {
            return true;
        }
        if (root1 == null) {
            return false;
        }
        if (root1.val != root2.val) {
            return false;
        }
        return doesTree1HaveTree2(root1.left, root2.left) && doesTree1HaveTree2(root1.right, root2.right);
    }

    /**
     * 《剑指offer》面试题23：从上往下打印二叉树
     *
     * @param root
     * @return
     */
    public ArrayList<Integer> PrintFromTopToBottom(TreeNode root) {
        ArrayList<Integer> arrayList = new ArrayList<>();
        if (root == null) {
            return arrayList;
        }
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            arrayList.add(node.val);
            if (node.left != null) {
                queue.offer(node.left);
            }
            if (node.right != null) {
                queue.offer(node.right);
            }
        }
        return arrayList;
    }

    /**
     * 《剑指offer》面试题24：二叉搜索树的后序遍历序列
     *
     * @param sequence
     * @return
     */
    public boolean VerifySquenceOfBST(int[] sequence) {
        if (sequence == null || sequence.length <= 0) {
            return false;
        }
        return VerifySquenceOfBST(sequence, 0, sequence.length - 1);
    }

    private boolean VerifySquenceOfBST(int[] sequence, int begin, int end) {
        if (begin >= end) {
            return true;
        }
        int rootValue = sequence[end];
        int i = begin;
        for (; i < end; i++) {
            if (sequence[i] > rootValue) {
                break;
            }
        }
        int index = i;
        for (; index < end; index++) {
            if (sequence[index] < rootValue) {
                return false;
            }
        }
        return VerifySquenceOfBST(sequence, begin, i - 1) && VerifySquenceOfBST(sequence, i, end - 1);
    }

    /**
     * 《剑指offer》面试题25：二叉树中和为某一值的路径
     * @param root
     * @param target
     * @return
     */
    public ArrayList<ArrayList<Integer>> FindPath(TreeNode root, int target) {
        ArrayList<ArrayList<Integer>> result = new ArrayList<>();
        if (root == null) {
            return result;
        }
        ArrayList<Integer> arrayList = new ArrayList<>();
        FindPath(root, target, 0, arrayList, result);
        return result;
    }

    public void FindPath(TreeNode root, int target, int sum, ArrayList<Integer> currentArray, ArrayList<ArrayList<Integer>> result) {
        currentArray.add(root.val);
        sum+=root.val;
        if (root.left==null && root.right==null) {
            if(sum==target){
                ArrayList<Integer> temp = new ArrayList<>(currentArray);
                result.add(temp);
            }
            currentArray.remove(currentArray.size()-1);
            return;
        }
        if(root.left!=null){
            FindPath(root.left, target, sum, currentArray, result);
        }
        if(root.right!=null){
            FindPath(root.right, target, sum, currentArray, result);
        }
        currentArray.remove(currentArray.size()-1);
    }
}

class TreeNode {
    int val = 0;
    TreeNode left = null;
    TreeNode right = null;

    public TreeNode(int val) {
        this.val = val;
    }
}