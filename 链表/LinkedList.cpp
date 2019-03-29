#include<iostream>
#include<stack>

using namespace std;

struct ListNode {
    int value;
    ListNode *pNext;
};

void reverse(ListNode **pHead) {
    if (pHead == NULL || *pHead == NULL || (*pHead)->pNext == NULL) {
        return;
    }
    ListNode *pNode1 = *pHead;
    ListNode *pNode2 = (*pHead)->pNext;
    while (pNode1 != NULL && pNode2 != NULL) {
        ListNode *pTempNode = pNode2->pNext;
        pNode2->pNext = pNode1;
        pNode1 = pNode2;
        pNode2 = pTempNode;
    }
    (*pHead)->pNext = NULL;
    *pHead = pNode1;
}

void printList(ListNode *pHead) {
    ListNode *pNode = pHead;
    while (pNode != NULL) {
        cout << pNode->value << "  ";
        pNode = pNode->pNext;
    }
    cout << endl;
}

void reversePrintList(ListNode *pHead) {
    stack<int> stack;
    ListNode *pNode = pHead;
    while (pNode != NULL) {
        stack.push(pNode->value);
        pNode = pNode->pNext;
    }
    while (!stack.empty()) {
        cout << stack.top() << endl;
        stack.pop();
    }
}

void recursePrintList(ListNode *pHead) {
    if (pHead == NULL) {
        return;
    }
    recursePrintList(pHead->pNext);
    cout << pHead->value << endl;
}

void addToTail(ListNode **pHead, int value) {
    ListNode *pNew = new ListNode();
    pNew->value = value;
    pNew->pNext = NULL;

    if (*pHead == NULL) {
        *pHead = pNew;
    } else {
        ListNode *pNode = *pHead;
        while (pNode->pNext != NULL) {
            pNode = pNode->pNext;
        }
        pNode->pNext = pNew;
    }
}

void removeNode(ListNode **pHead, int value) {
    if (pHead == NULL || *pHead == NULL) {
        return;
    }
    ListNode *pNode = *pHead;
    if ((*pHead)->value == value) {
        *pHead = (*pHead)->pNext;
        delete pNode;
    } else {
        while (pNode->pNext != NULL && pNode->pNext->value != value) {
            pNode = pNode->pNext;
        }
        if (pNode->pNext != NULL) {
            ListNode *pTempNode = pNode->pNext;
            pNode->pNext = pNode->pNext->pNext;
            delete pTempNode;
        }
    }
}

/**
 * 《剑指offer》面试题13：在O(1)时间删除链表结点
 * 给定头结点和要删除的结点，在O(1)时间内删除该结点
 * @param pListHead
 * @param pToBeDeleted
 */
void DeleteNode(ListNode **pListHead, ListNode *pToBeDeleted) {
    if (pListHead == NULL || *pListHead == NULL || pToBeDeleted == NULL) {
        return;
    }
    if (pToBeDeleted->pNext == NULL) {
        if(*pListHead==pToBeDeleted){
            *pListHead = NULL;
        }else{
            ListNode *head = *pListHead;
            while (head->pNext != NULL && head->pNext != pToBeDeleted) {
                head = head->pNext;
            }
            head->pNext = NULL;
        }
    } else {
        ListNode *temp = pToBeDeleted->pNext;
        pToBeDeleted->value = pToBeDeleted->pNext->value;
        pToBeDeleted->pNext = pToBeDeleted->pNext->pNext;
        delete (temp);
    }
}

int main() {
    ListNode *pHead = NULL;
    for (int i = 0; i < 10; i++) {
        addToTail(&pHead, i);
    }
    printList(pHead);
    ListNode* node = pHead;
    for(int i=0;i<9;i++){
        node=node->pNext;
    }
    DeleteNode(&pHead, node);
    printList(pHead);
//    reverse(&pHead);
//    printList(pHead);
//    reversePrintList(pHead);
//    recursePrintList(pHead);
    return 0;
}