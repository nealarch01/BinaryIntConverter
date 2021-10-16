class Stack {
    constructor() {
        this.list = [];
        this.stackCount = 0;
    }

    push(item) {
        this.list.push(item);
    }

    get pop() {
        if(this.stackCount === 0) {
            throw new Error("Stack Underflow");
        }
        var stackItem = list[0];
        this.pop();
        return stackItem;
    }
}

export default Stack;