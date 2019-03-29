import java.util.HashMap;
import java.util.Map;

public class MyLinkedList {

    ListNode head = null;
    RandomListNode randomListHead = null;

    /**
     * 《剑指offer》面试题16：反转单链表，循环解法
     * @param head
     * @return
     */
    public ListNode reverseList(ListNode head) {
        if(head==null || head.next==null){
            return head;
        }
        ListNode node = head;
        ListNode preNode = null;
        ListNode nextNode = null;
        while(node!=null){
            nextNode = node.next;
            node.next = preNode;
            preNode = node;
            node = nextNode;
        }
        return preNode;
    }

    /**
     * 《剑指offer》面试题16：反转单链表，递归解法
     * @param head
     * @return
     */
    public ListNode reverseList1(ListNode head) {
        if(head==null || head.next==null){
            return head;
        }
        TowNode twoNode = new TowNode();
        twoNode.node1 = head;
        twoNode.node2 = head.next;
        ListNode node = recurse(twoNode);
        head.next = null;
        return node;
    }

    private ListNode recurse(TowNode nodes){
        if(nodes.node2==null){
            return nodes.node1;
        }
        TowNode twoNode = new TowNode();
        twoNode.node1 = nodes.node2;
        twoNode.node2 = nodes.node2.next;
        nodes.node2.next = nodes.node1;
        return recurse(twoNode);
    }

    /**
     * 《剑指offer》面试题17：合并两个排序的链表，循环解法
     * @param list1
     * @param list2
     * @return
     */
    public ListNode merge(ListNode list1,ListNode list2) {
        if(list1==null){
            return list2;
        }
        if(list2==null){
            return list1;
        }
        ListNode node = new ListNode(0);
        ListNode head = node;
        while(list1!=null && list2!=null){
            if(list1.val<list2.val){
                node.next = list1;
                list1 = list1.next;
            }else{
                node.next = list2;
                list2 = list2.next;
            }
            node = node.next;
        }
        if(list1!=null){
            node.next = list1;
        }
        if(list2!=null){
            node.next = list2;
        }
        return head.next;
    }

    /**
     * 《剑指offer》面试题17：合并两个排序的链表，递归解法
     * @param list1
     * @param list2
     * @return
     */
    public ListNode merge1(ListNode list1,ListNode list2) {
        if(list1==null){
            return list2;
        }
        if(list2==null){
            return list1;
        }
        ListNode head = null;
        if(list1.val<list2.val){
            head = list1;
            head.next=merge1(list1.next, list2);
        }else{
            head = list2;
            head.next = merge1(list1, list2.next);
        }
        return head;
    }

    /**
     * 《剑指offer》面试题26：复杂链表的复制
     * @param pHead
     * @return
     */
    public RandomListNode Clone(RandomListNode pHead) {
        if(pHead==null){
            return null;
        }
        RandomListNode index = pHead;
        while (index!=null){
            RandomListNode node = new RandomListNode(index.label);
            RandomListNode temp = index.next;
            index.next = node;
            node.next = temp;
            index = temp;
        }
        index = pHead;
        while (index!=null){
            if(index.random!=null){
                index.next.random = index.random.next;
            }else{
                index.next.random = null;
            }
            index = index.next.next;
        }
        index = pHead;
        RandomListNode newHead = pHead.next;
        RandomListNode result = newHead;
        while (newHead.next!=null){
            index.next = newHead.next;
            index = index.next;
            newHead.next = index.next;
            newHead=newHead.next;
        }
        return result;
    }

    public RandomListNode generateRandomList(int[] array1, int[] array2){
        if(array1==null || array1.length<=0){
            return null;
        }
        RandomListNode head = new RandomListNode(array1[0]);
        RandomListNode randomListNode = head;
        for(int i=1;i<array1.length;i++){
            RandomListNode temp = new RandomListNode(array1[i]);
            randomListNode.next = temp;
            randomListNode = randomListNode.next;
        }
        randomListNode=head;
        for(int i=0;i<array2.length;i++){
            if(array2[i]>0){
                try{
                    randomListNode.random = getIndex(head, array2[i]-1);
                }catch (Exception e){
                    System.err.println();
                }
            }
            randomListNode = randomListNode.next;
        }
        return head;
    }

    private RandomListNode getIndex(RandomListNode head, int index) throws Exception{
        for(int i=0;i<index;i++){
            if(head!=null){
                head = head.next;
            }else{
                throw new Exception("index out of list!");
            }
        }
        return head;
    }

    public ListNode addToTail(ListNode head, int val){
        ListNode node = new ListNode(val);
        if(head==null){
            return node;
        }
        ListNode temp = head;
        while (temp.next!=null){
            temp=temp.next;
        }
        temp.next=node;
        return head;
    }

    public void printLinkedList(ListNode head){
        if(head==null){
            System.out.println("LinkedList is null.");
        }
        while(head!=null){
            System.out.println(head.val);
            head=head.next;
        }
    }
}

class ListNode {
    int val;
    ListNode next = null;

    ListNode(int val) {
        this.val = val;
    }
}

class TowNode{
    ListNode node1;
    ListNode node2;
}

class RandomListNode {
    int label;
    RandomListNode next = null;
    RandomListNode random = null;

    RandomListNode(int label) {
        this.label = label;
    }
}