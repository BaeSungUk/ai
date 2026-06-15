class MinHeap:
    def __init__(self):
        self.heap = []

    # 부모 인덱스 구하기
    def parent(self, index):
        return (index - 1) // 2

    # 왼쪽 자식 인덱스 구하기
    def left_child(self, index):
        return index * 2 + 1

    # 오른쪽 자식 인덱스 구하기
    def right_child(self, index):
        return index * 2 + 2

    # 데이터 삽입
    def insert(self, value):
        # 1. 새 값을 배열 마지막에 추가
        self.heap.append(value)

        # 2. 마지막 인덱스부터 시작
        current = len(self.heap) - 1

        # 3. 부모보다 현재 값이 작으면 교환
        while current > 0:
            parent_index = self.parent(current)

            if self.heap[current] < self.heap[parent_index]:
                self.heap[current], self.heap[parent_index] = self.heap[parent_index], self.heap[current]
                current = parent_index
            else:
                break

    # 루트 삭제
    def delete(self):
        if len(self.heap) == 0:
            print("힙이 비어 있습니다.")
            return None

        if len(self.heap) == 1:
            return self.heap.pop()

        # 1. 루트 값 저장
        root = self.heap[0]

        # 2. 마지막 값을 루트로 이동
        self.heap[0] = self.heap.pop()

        # 3. 아래로 내려가며 힙 정리
        self.heapify_down(0)

        return root

    # 아래로 내려가며 힙 정리
    def heapify_down(self, index):
        size = len(self.heap)

        while True:
            left = self.left_child(index)
            right = self.right_child(index)
            smallest = index

            # 왼쪽 자식이 더 작으면 smallest 변경
            if left < size and self.heap[left] < self.heap[smallest]:
                smallest = left

            # 오른쪽 자식이 더 작으면 smallest 변경
            if right < size and self.heap[right] < self.heap[smallest]:
                smallest = right

            # smallest가 바뀌었다면 교환
            if smallest != index:
                self.heap[index], self.heap[smallest] = self.heap[smallest], self.heap[index]
                index = smallest
            else:
                break

    # 힙 출력
    def print_heap(self):
        print(self.heap)


min_heap = MinHeap()

min_heap.insert(50)
min_heap.insert(30)
min_heap.insert(40)
min_heap.insert(10)
min_heap.insert(60)

min_heap.print_heap()