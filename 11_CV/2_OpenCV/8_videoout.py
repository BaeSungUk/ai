"""두 동영상을 순서대로 읽어 하나의 AVI 파일로 저장하는 예제입니다."""

# 정규 표현식 모듈을 불러오지만 현재 예제에서는 사용하지 않습니다.
import re

# 동영상 입출력과 크기 변경을 위해 OpenCV를 불러옵니다.
import cv2

# 입력 파일을 열지 못했을 때 프로그램을 종료하기 위해 sys를 불러옵니다.
import sys

# 첫 번째 입력 동영상을 여는 객체를 만듭니다.
cap1 = cv2.VideoCapture("./movies/232538_tiny.mp4")

# 두 번째 입력 동영상을 여는 객체를 만듭니다.
cap2 = cv2.VideoCapture("./movies/276624_tiny.mp4")

# 두 입력 동영상 중 하나라도 열지 못했는지 검사하려는 조건입니다.
# 주의: 실제 검사에는 cap1.isOpened()처럼 괄호를 붙여 메서드를 호출해야 합니다.
if not cap1.isOpened or not cap2.isOpened():
    # 입력 파일을 열 수 없다는 메시지를 출력합니다.
    print("입력 동영상 중 하나 이상을 열 수 없습니다.")

    # 이후 처리를 중단하고 프로그램을 종료합니다.
    sys.exit()

# 출력 영상의 기준 너비를 첫 번째 동영상에서 가져옵니다.
width = int(cap1.get(cv2.CAP_PROP_FRAME_WIDTH))

# 출력 영상의 기준 높이를 첫 번째 동영상에서 가져옵니다.
height = int(cap1.get(cv2.CAP_PROP_FRAME_HEIGHT))

# 첫 번째 동영상의 FPS를 가져옵니다.
fps1 = cap1.get(cv2.CAP_PROP_FPS)

# 두 번째 동영상의 FPS를 가져옵니다.
fps2 = cap2.get(cv2.CAP_PROP_FPS)

# 두 입력 영상의 크기와 FPS를 출력합니다.
print(f"너비: {width}, 높이: {height}, 첫 번째 FPS: {fps1}, 두 번째 FPS: {fps2}")

# fourcc는 동영상을 압축하고 저장할 코덱을 나타내는 네 글자 코드입니다.
# XVID 코덱을 나타내는 문자열을 VideoWriter용 정수 코드로 변환합니다.
fourcc = cv2.VideoWriter_fourcc(*"XVID")

# mix.avi에 첫 번째 영상의 FPS와 크기로 프레임을 저장할 객체를 만듭니다.
out = cv2.VideoWriter("mix.avi", fourcc, fps1, (width, height))

# 출력 파일을 정상적으로 만들었는지 확인합니다.
if not out.isOpened():
    # 오류가 발생했으므로 첫 번째 입력 파일 자원을 해제합니다.
    cap1.release()

    # 두 번째 입력 파일 자원도 해제합니다.
    cap2.release()

    # 출력 파일 생성 실패를 예외로 알립니다.
    raise RecursionError("출력 동영상 파일을 생성할 수 없습니다.")

# 첫 번째 영상 FPS를 화면 표시용 밀리초 지연 시간으로 바꿉니다.
delay = max(1, round(1000 / fps1))

# ESC로 전체 작업을 중단했는지 기록하는 변수입니다.
stop = False

# 첫 번째 동영상과 두 번째 동영상 객체를 차례대로 처리합니다.
for cap in (cap1, cap2):
    # 현재 동영상의 프레임을 끝까지 읽습니다.
    while True:
        # 현재 동영상에서 다음 프레임을 읽습니다.
        ret, frame = cap.read()

        # 동영상 끝에 도달하거나 읽기에 실패하면 안쪽 반복을 종료합니다.
        if not ret:
            break

        # 현재 프레임 크기가 출력 크기와 다른지 확인합니다.
        if frame.shape[1] != width or frame.shape[0] != height:
            # 크기가 다르면 출력 규격에 맞게 프레임 크기를 변경합니다.
            frame = cv2.resize(frame, (width, height))

        # 현재 프레임을 출력 동영상 파일에 기록합니다.
        out.write(frame)

        # 저장 중인 프레임을 'output' 창에서 미리 봅니다.
        cv2.imshow("output", frame)

        # ESC 키를 누르면 중단 상태를 기록하고 안쪽 반복을 종료합니다.
        if cv2.waitKey(delay) == 27:
            stop = True
            break

    # ESC로 중단한 경우 다음 동영상도 처리하지 않습니다.
    if stop:
        break

# 첫 번째 입력 동영상 자원을 해제합니다.
cap1.release()

# 두 번째 입력 동영상 자원을 해제합니다.
cap2.release()

# 출력 파일 기록을 마무리하고 자원을 해제합니다.
out.release()

# OpenCV가 만든 모든 창을 닫습니다.
cv2.destroyAllWindows()
