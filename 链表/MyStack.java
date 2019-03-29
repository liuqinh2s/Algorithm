import java.util.Stack;

public class MyStack {
    /**
     * 《剑指offer》面试题22：栈的压入、弹出序列
     * @param pushA
     * @param popA
     * @return
     */
    public boolean IsPopOrder(int [] pushA,int [] popA) {
        if(pushA==null || popA==null || pushA.length<=0 || popA.length<=0){
            return false;
        }
        Stack<Integer> stack = new Stack<>();
        int i=0;
        int j=0;
        while(j<pushA.length){
            if(stack.empty() || popA[i]!=stack.peek()){
                stack.push(pushA[j++]);
            }else {
                stack.pop();
                i++;
            }
        }
        while (!stack.empty() && stack.peek()==popA[i]){
            i++;
            stack.pop();
        }
        if(i!=popA.length){
            return false;
        }else{
            return true;
        }
    }
}
