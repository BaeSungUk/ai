import cv2 
import matplotlib.pyplot as plt
import numpy as np

# img = cv2.imread("./images/dog.bmp")
# img = cv2.imread("./images/gaussian_noise.jpg")
img = cv2.imread("./images/noise.bmp")

"""
블러링
픽셀 주변의 픽셀들을 같이 보고 새로운 픽셀 값을 결정하는 것
"""

img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

# 1. 평균 블러
# 현재 픽셀 주변의 값을 모두 더한 다음 평균을 구함(예: 7*7)
# cv2.blur(입력 이미지, 커널 크기, 결과 저장할 배열, 커널의 기준점, 이미지 가장자리 처리방법)
# 중요한 경계와 노이즈를 구별하지 않음
# Mean Blur보다 Gaussian Blur를 더 많이 사용 > 중앙에 가장 큰 가중치를 주고, 중앙에서 멀어질수록 가중치를 작게 만드는 방식
mean_blur = cv2.blur(img, (20, 20))

# 2. Bilateral Filter (양쪽 필터)
# 공간적으로 가까운지, 픽셀 색상/밝기가 비슷한지를 확인
# 가까운데 색이 비슷: 많이 반영, 가깝지만 색이 매우 다름: 적게 반영
# cv2.bilateralFilter(이미지, 지름, 시그마컬러, 시그마스페이스)
# 시그마컬러: 픽셀 값 또는 색상 차이를 얼마나 허용할지 결정(예: 값을 적게 줌 > 색상이 조금만 달라도 다른 영역이라고 판단)
# 시그마스페이스: 공간적으로 얼마나 떨어진 픽셀까지 영향을 줄지 결정(예: 값을 크게 줌 > 더 멀리 있는 픽셀까지 고려할 수 있음)
# 처리 속도가 많이 느릴 수 있음
bilateral = cv2.bilateralFilter(img, 12, 100, 100)

# 3. Canny Edge Detection
# Edge: 픽셀 값이 급격하게 변하는 위치
# 컬러 이미지를 그레이스케일로 변환 > 밝기가 갑자기 변화하는 위치를 찾음
# 이미지 밝기의 중앙값을 기준으로 threshold를 정하는 휴리스틱(경험적 방법)를 통해서 Canny threshold를 조절하거나 다른 방법으로 threshold를 결정하는 경우가 많음(lower, upper)
# cv2.Canny(이미지, 낮은 임계값, 높은 임계값, 커널크기)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
median_value = np.median(gray)
lower = int(max(0, 0.7 * median_value))
upper = int(min(255, 1.3 * median_value))
print("Cannt lower threshold", lower)
print("Cannt upper threshold", upper)

# Canny 전에 가볍게 Gaussian Blur를 적용해 잡음 영향을 줄임
edge_input = cv2.GaussianBlur(gray, (3, 3), 0)

canny_edge = cv2.Canny(edge_input, lower, upper, 20) 

# 4. 직접 평균 커널 만들기
# filter2D()를 사용하면 사용자가 직접 만든 커널을 적용할 수 있음
plt.figure(figsize=(10, 5))
for i, k in enumerate([5, 7, 9]):
    kernel = np.ones((k, k), dtype=np.float32) / (k * k)
    # -1: 출력 영상의 데이터 타입을 입력 영상과 같게 유지
    filtered = cv2.filter2D(img_rgb, -1, kernel)

    plt.subplot(1, 3, i+1)
    plt.imshow(filtered)
    plt.title(f'kernel size: {k} x {k}')
    plt.axis('off')
plt.tight_layout()
plt.show()


cv2.imshow("original", img)
cv2.imshow("mean_blur", mean_blur)
cv2.imshow("bilateral", bilateral)
cv2.imshow("canny_edge", canny_edge)
cv2.imshow("edge_input", edge_input)

cv2.waitKey(0)
cv2.destroyAllWindows()
