class Node:
    def __init__(self, value):
        self.value = value
        self.prev = None
        self.next = None


class DoubleLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None

    def append(self, value):
        # TODO: 리스트의 맨 뒤에 새 노드를 추가한다.
        new_node = Node(value)

        if self.head is None:
            self.head = new_node
            self.tail = new_node
        else : 
            self.tail.next = new_node
            new_node.prev = self.tail
            self.tail = new_node

    def prepend(self, value):
        # TODO: 리스트의 맨 앞에 새 노드를 추가한다.
        new_node = Node(value)
        if self.head is None:
            self.head = new_node
            self.tail = new_node
        else:
            new_node.next = self.head
            self.head.prev = new_node
            self.head = new_node

    def insert(self, index, value):
        # TODO: 원하는 인덱스에 새 노드를 삽입한다.
        new_node = Node(value)
        if self.head is None:
            self.prepend(value)
            return True
    
        if index == 0:
            self.prepend(value)
            return True

        if index == self.length():
            self.append(value)
            return True
        

        
        current = self.head
        count = 0
        while current is not None and count < index:
            current = current.next
            count += 1
            
            if count == index:
                current.prev.next = new_node
                new_node.prev = current.prev
                new_node.next = current
                current.prev = new_node
                
                return True
            
        
        return False
    def delete(self, value):
        # TODO: 입력한 값을 가진 첫 번째 노드를 삭제한다.
        
        current = self.head
        while current is not None:
            
            if current.value == value:
                if current.prev is None:
                    self.head = current.next
                    current.next.prev = None
                    return True
                elif current.next is None:
                    self.tail = current.prev
                    current.prev.next = None
                    return True
                else : 
                    current.prev.next = current.next
                    current.next.prev = current.prev
                    
                    return True
                
            current = current.next
        return False



    def find(self, value):
        # TODO: 입력한 값이 저장된 첫 번째 인덱스를 찾는다.
        pass

    def get(self, index):
        # TODO: 입력한 인덱스에 저장된 값을 반환한다.
        pass

    def get_next(self, index):
        node = self.get_node(index)

        if node is None:
            return None

        return node.next

    def get_prev(self, index):
        node = self.get_node(index)

        if node is None:
            return None

        return node.prev

    def get_node(self, index):
        if index < 0:
            return None

        current = self.head
        current_index = 0

        while current is not None:
            if current_index == index:
                return current

            current = current.next
            current_index += 1

        return None

    def length(self):
        count = 0
        current = self.head

        while current is not None:
            count += 1
            current = current.next

        return count

    def display(self):
        if self.head is None:
            return "HEAD -> None"

        result = ["HEAD"]
        current = self.head

        while current is not None:
            result.append(f"[{current.value}]")
            current = current.next

        result.append("None")
        return " <-> ".join(result)

    def display_reverse(self):
        if self.tail is None:
            return "TAIL -> None"

        result = ["TAIL"]
        current = self.tail

        while current is not None:
            result.append(f"[{current.value}]")
            current = current.prev

        result.append("None")
        return " <-> ".join(result)
