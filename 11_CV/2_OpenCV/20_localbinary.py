import cv2
import numpy as np

img = cv2.imread("./images/sudoku.jpg", cv2.IMREAD_GRAYSCALE)

# 전역 Otsu 이진화
otsu_threshold, global_otsu = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)

print("otsu_threshold", otsu_threshold)
# 지역 Otsu 이진화
# 지역마다 서로 다른 임계값을 사용함
local_otsu = np.zeros_like(img)
rows = 4
cols = 4

# np.linspace()
# 시작값부터 끝값까지 일정한 간격으로 원하는 개수만큼 숫자를 만들어주는 함수
# np.linspace(start, stop, num)
y_edges = np.linspace(0, img.shape[0], rows+1, dtype=int)
x_edges = np.linspace(0, img.shape[1], rows+1, dtype=int)

for row in range(rows):
    for col in range(cols):
        y1 = y_edges[row]
        y2 = y_edges[row + 1]
        x1 = x_edges[col]
        x2 = x_edges[col + 1]
        block = img[y1:y2, x1:x2]
        _, block_binary = cv2.threshold(block, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
        local_otsu[y1:y2, x1:x2] = block_binary

# 적응형 이진화
# adaptiveThreshold():픽셀마다 주변 영역을 보고 임게값을 계산
# adaptiveThreshold(img, maxValue, blockSize, C)
# maxValue: 조건을 만족한 픽셀에 넣을 값
# blockSize: 주변 영역의 크기. 반드시 3이상의 홀수
# C: 계산된 주변 기준값에서 빼는 상수
# T = 주변 평균(또는 가중 평균) - C 
# C가 커지면 임계값 T가 낮아지므로 같은 영상에서는 흰색으로 판정되는 픽셀리 많아질 수 있음
block_size = 9
C = 5
# 주변 픽셀의 단순 평균을 기준으로 사용
adaptive_maen = cv2.adaptiveThreshold(img, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, block_size, C)

# 주변 픽셀에 Gaussian 가중치를 적용한 평균을 기준으로 사용
adaptive_gaussian = cv2.adaptiveThreshold(img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, block_size, C)

cv2.imshow("original", img)
cv2.imshow("global_otsu", global_otsu)
cv2.imshow("local_otsu", local_otsu)
cv2.imshow("adaptive_maen", adaptive_maen)
cv2.imshow("adaptive_gaussian", adaptive_gaussian)

cv2.waitKey(0)
cv2.destroyAllWindows()