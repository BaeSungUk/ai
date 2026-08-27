import gradio as gr
import requests


# FastAPI 서버 주소
API_BASE_URL = "http://127.0.0.1:5000"


# ==========================================
# 최근 데이터를 Gradio 표 형태로 변환
# ==========================================

def to_table_rows(
    datas: list[dict],
) -> list[list[str]]:

    return [
        [
            item.get("product_name", ""),
            item.get("details", ""),
            item.get("tone_and_manner", ""),
            item.get("ad", ""),
        ]
        for item in datas
    ]


# ==========================================
# FastAPI 오류 메시지 가져오기
# ==========================================

def get_error_message(
    response: requests.Response,
) -> str:

    try:
        body = response.json()
        return str(body.get("detail", body))

    except ValueError:
        return response.text or "알 수 없는 서버 오류"


# ==========================================
# 최근 광고 목록 조회
# ==========================================

def load_recent_ads() -> list[list[str]]:

    try:
        response = requests.get(
            f"{API_BASE_URL}/ads/recent",
            params={
                "limit": 10,
            },
            timeout=10,
        )

        response.raise_for_status()

        return to_table_rows(
            response.json()
        )

    except requests.RequestException:
        return []


# ==========================================
# 광고 문구 생성 요청
# ==========================================

def generate_ad(
    product_name: str,
    details: str,
    tone_and_manner: list[str],
):
    # 간단한 입력 검증
    if not product_name.strip():
        return (
            "제품 이름을 입력해주세요.",
            load_recent_ads(),
        )

    if not details.strip():
        return (
            "제품 주요 내용을 입력해주세요.",
            load_recent_ads(),
        )

    if not tone_and_manner:
        return (
            "광고 문구의 느낌을 한 개 이상 선택해주세요.",
            load_recent_ads(),
        )

    payload = {
        "product_name": product_name.strip(),
        "details": details.strip(),
        "tone_and_manner": tone_and_manner,
    }

    try:
        response = requests.post(
            f"{API_BASE_URL}/ads",
            json=payload,

            # GPT 생성 시간을 고려해 여유 있게 설정
            timeout=120,
        )

        if not response.ok:
            return (
                f"서버 오류: {get_error_message(response)}",
                load_recent_ads(),
            )

        result = response.json()

        return (
            result["ad"],
            to_table_rows(result["datas"]),
        )

    except requests.RequestException as error:
        return (
            f"FastAPI 서버에 연결할 수 없습니다: {error}",
            load_recent_ads(),
        )


# ==========================================
# Gradio 화면
# ==========================================

with gr.Blocks(
    title="AI 광고 문구 생성기",
) as demo:

    gr.Markdown(
        "# GPT API 기반 AI 광고 문구 생성기"
    )

    product_name = gr.Textbox(
        label="제품 이름",
        placeholder="제품 이름을 입력하세요",
    )

    details = gr.Textbox(
        label="제품 주요 내용",
        placeholder=(
            "제품 주요 내용을 입력하세요"
        ),
        lines=4,
    )

    tone_and_manner = gr.CheckboxGroup(
        choices=[
            "재밌게",
            "과장스럽게",
            "참신하게",
            "고급스럽게",
            "센스있게",
            "신선하게",
            "전문성있게",
        ],
        label="광고 문구의 느낌",
    )

    generate_button = gr.Button(
        "광고 문구 생성",
        variant="primary",
    )

    generated_ad = gr.Textbox(
        label="생성된 광고 문구",
        lines=3,
        interactive=False,
    )

    recent_ads = gr.Dataframe(
        headers=[
            "제품 이름",
            "제품 주요 내용",
            "광고 문구 스타일",
            "생성된 광고 문구",
        ],
        datatype=[
            "str",
            "str",
            "str",
            "str",
        ],
        label="MongoDB 최근 광고 문구",
        interactive=False,
    )

    # 광고 문구 생성 버튼 클릭
    generate_button.click(
        fn=generate_ad,
        inputs=[
            product_name,
            details,
            tone_and_manner,
        ],
        outputs=[
            generated_ad,
            recent_ads,
        ],
    )

    # Gradio 페이지가 열릴 때 최근 목록 조회
    demo.load(
        fn=load_recent_ads,
        outputs=recent_ads,
    )


if __name__ == "__main__":
    demo.launch()