class PriorityQueue<T> {
    arr: T[];
    compare: (a: T, b: T)=>number;
    constructor(props: {compare: (a: T, b: T)=>number}) {
        const { compare } = props;
        this.compare = compare;
        this.arr = [];
    }
    swap(arr, index1, index2) {
        const temp = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = temp;
    }
    enqueue(a) {
        this.arr.push(a);
        this.bubbleUp(this.arr.length - 1);
    }
    dequeue() {
        this.delete(0);
    }
    bubbleUp(index) {
        if (this.arr.length <= 1 || index <= 0) {
            return;
        }
        const pre = Math.floor((index - 1) / 2);
        if (this.compare(this.arr[index], this.arr[pre]) > 0) {
            this.swap(this.arr, pre, index);
            this.bubbleUp(pre);
        }
    }
    delete(index) {
        this.swap(this.arr, index, this.arr.length - 1);
        this.arr.pop();
        this.sinkDown(index);
    }
    sinkDown(index) {
        if (this.arr.length <= 1 || index >= this.arr.length - 1) {
            return;
        }
        if (index * 2 + 1<this.arr.length && this.compare(this.arr[index], this.arr[index * 2 + 1]) < 0 || index * 2 + 2 < this.arr.length && this.compare(this.arr[index], this.arr[index * 2 + 2]) < 0) {
            if (index * 2 + 2 >= this.arr.length || this.compare(this.arr[index * 2 + 1], this.arr[index * 2 + 2])>0) {
                this.swap(this.arr, index, index * 2 + 1);
                this.sinkDown(index * 2 + 1);
            }
            else {
                this.swap(this.arr, index, index * 2 + 2);
                this.sinkDown(index * 2 + 2);
            }
        }
    }
    front() {
        return this.arr[0];
    }
    size(){
        return this.arr.length;
    }
}

const p = new PriorityQueue({compare: (a: number,b: number)=>{
    return a-b;
}});
p.enqueue(1);
console.log(p.arr)
p.enqueue(2);
console.log(p.arr)
p.enqueue(3);
console.log(p.arr)
p.enqueue(80);
console.log(p.arr)
p.enqueue(70);
console.log(p.arr)
p.enqueue(60);
console.log(p.arr)
p.enqueue(8);
console.log(p.arr)
p.enqueue(7);
console.log(p.arr)
p.enqueue(6);
console.log(p.arr)