def quick_sort(arr):
    # 종료 조건
    # 배열의 길이가 1 이하이면 이미 정렬된 상태
    if len(arr) <= 1:
        return arr

    # 첫 번째 값을 피벗으로 선택
    pivot = arr[0]

    # 피벗을 제외한 나머지 값들
    rest = arr[1:]

    # 피벗보다 작거나 같은 값들을 담을 리스트
    left = []

    # 피벗보다 큰 값들을 담을 리스트
    right = []

    # 나머지 값들을 하나씩 확인
    for value in rest:
        if value <= pivot:
            left.append(value)
        else:
            right.append(value)

    # 왼쪽 정렬 + 피벗 + 오른쪽 정렬
    return quick_sort(left) + [pivot] + quick_sort(right)


data = [5, 3, 8, 4, 2, 7, 1, 6]

print("원본:", data)
print("정렬:", quick_sort(data))