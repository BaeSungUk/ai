import cv2
from pathlib import Path
from time import perf_counter

BASE_DIR = Path(__file__).resolve().parent
FOREGROUND_VIDEO = str(BASE_DIR / "movies" / "woman.mp4")
BACKGROUND_VIDEO = str(BASE_DIR / "movies" / "sea.mp4")


def compose_chroma(foreground, background):
    # 배경 프레임을 전경 프레임 크기에 맞춥니다.
    if foreground.shape[:2] != background.shape[:2]:
        background = cv2.resize(
            background,
            (foreground.shape[1], foreground.shape[0]),
        )

    # HSV 색 공간에서 초록색 영역을 마스크로 만듭니다.
    hsv = cv2.cvtColor(foreground, cv2.COLOR_BGR2HSV)
    lower_green = (35, 60, 40)
    upper_green = (85, 255, 255)
    green_mask = cv2.inRange(hsv, lower_green, upper_green)

    # 작은 잡음을 지우고 경계를 부드럽게 처리합니다.
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    green_mask = cv2.morphologyEx(green_mask, cv2.MORPH_OPEN, kernel)
    green_mask = cv2.morphologyEx(green_mask, cv2.MORPH_CLOSE, kernel)
    green_mask = cv2.GaussianBlur(green_mask, (5, 5), 0)

    # 초록색 영역에는 배경을, 나머지 영역에는 전경을 넣습니다.
    alpha = green_mask.astype("float32") / 255.0
    alpha = alpha[:, :, None]
    result = foreground * (1.0 - alpha) + background * alpha

    return result.astype("uint8")


def main():
    foreground_cap = cv2.VideoCapture(FOREGROUND_VIDEO)
    background_cap = cv2.VideoCapture(BACKGROUND_VIDEO)

    if not foreground_cap.isOpened():
        print(f"전경 영상을 열 수 없습니다: {FOREGROUND_VIDEO}")
        return
    if not background_cap.isOpened():
        print(f"배경 영상을 열 수 없습니다: {BACKGROUND_VIDEO}")
        foreground_cap.release()
        return

    fps = foreground_cap.get(cv2.CAP_PROP_FPS)
    frame_duration = 1 / fps if fps > 0 else 1 / 30

    while True:
        frame_start = perf_counter()

        foreground_ok, foreground = foreground_cap.read()
        if not foreground_ok:
            break

        background_ok, background = background_cap.read()
        if not background_ok:
            # 배경 영상이 짧으면 처음부터 반복합니다.
            background_cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            background_ok, background = background_cap.read()
            if not background_ok:
                print("배경 영상의 프레임을 읽을 수 없습니다.")
                break

        result = compose_chroma(foreground, background)

        cv2.imshow("Chroma Key Result", result)

        processing_time = perf_counter() - frame_start
        remaining_time = frame_duration - processing_time
        wait_ms = max(1, round(remaining_time * 1000))

        if cv2.waitKey(wait_ms) & 0xFF == 27:
            break

    foreground_cap.release()
    background_cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
