import java.util.HashMap;
import java.util.Map;

public class MyLinkedList {

    ListNode head = null;

    public ListNode reverseList(ListNode head) {
        if(head==null || head.next==null){
            return head;
        }
        ListNode preNode = null;
        ListNode node = head;
        ListNode nextNode = head.next;
        while(nextNode!=null){
            node.next = preNode;
            preNode = node;
            node = nextNode;
            nextNode = nextNode.next;
        }
        node.next=preNode;
        return node;
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