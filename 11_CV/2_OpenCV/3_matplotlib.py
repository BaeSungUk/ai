import cv2
import matplotlib.pyplot as plt
# bmp 사진 크기 548 * 364
img_gray = cv2.imread("./images/dog.bmp", cv2.IMREAD_GRAYSCALE)
img_color = cv2.imread("./images/dog.bmp", cv2.IMREAD_COLOR) 

"""
OpenCV RGB 색상 채널 순서: BGR
Matplotlib RGB 색상 채널 순서: RGB
"""

# 색상 채널 순서 변경
img_color_rgb = cv2.cvtColor(img_color, cv2.COLOR_BGR2RGB)

plt.subplot(1, 2, 1)
plt.axis("off")
plt.title("Grayscale")
plt.imshow(img_gray, cmap="gray")

plt.subplot(1, 2, 2)
plt.axis("off")
plt.title("Colr")
plt.imshow(img_color_rgb)

plt.tight_layout()
plt.show()