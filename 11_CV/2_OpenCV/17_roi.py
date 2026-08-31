"""
ROI(Region of Interest)
이미지 전체가 아닌 특정 관심 영역만 선택해서 처리
"""

import cv2

img = cv2.imread("./images/sun.jpg")

x = 182
y = 20
w = 121
h = 112

roi = img[y:y+h, x:x+w]
roi_copy = roi.copy()

dst_x1 = x + w
dst_x2 = dst_x1 + w

img[y:y+h, dst_x1:dst_x2] = roi_copy
cv2.rectangle(img, (x, y), (dst_x2, y+h), (0, 255, 0), 3)

cv2.imshow("result", img)
cv2.imshow("ROI", roi)
cv2.waitKey(0)
cv2.destroyAllWindows()

