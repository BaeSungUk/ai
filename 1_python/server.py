import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Query
from openai import AsyncOpenAI
from pydantic import BaseModel, Field
from pymongo import AsyncMongoClient
from dotenv import load_dotenv


# ==========================================
# 환경설정
# ==========================================
load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")

# 필요하면 환경변수로 다른 모델을 지정할 수 있음
OPENAI_MODEL = os.getenv(
    "OPENAI_MODEL",
    "gpt-5-nano",
)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# ==========================================
# MongoDB 연결
# ==========================================

mongo_client = AsyncMongoClient(
    MONGODB_URL,
    serverSelectionTimeoutMS=5000,
)

database = mongo_client["ai_ad_service"]
ad_collection = database["ads"]


# ==========================================
# OpenAI 연결
# ==========================================

# OPENAI_API_KEY 환경변수를 자동으로 사용
openai_client = AsyncOpenAI(
    api_key=OPENAI_API_KEY
)


# ==========================================
# FastAPI 요청/응답 모델
# ==========================================

class AdCreate(BaseModel):
    product_name: str = Field(
        min_length=1,
        max_length=100,
    )

    details: str = Field(
        min_length=1,
        max_length=1000,
    )

    # Gradio CheckboxGroup에서 리스트로 전달됨
    tone_and_manner: list[str] = Field(
        min_length=1,
    )


class AdItem(BaseModel):
    product_name: str
    details: str
    tone_and_manner: str
    ad: str


class AdGenerateResponse(BaseModel):
    # 이번에 생성된 광고 문구
    ad: str

    # MongoDB에서 조회한 최근 광고 목록
    datas: list[AdItem]


# ==========================================
# MongoDB 최근 목록 조회 함수
# ==========================================

async def find_recent_ads(
    limit: int = 10,
) -> list[dict]:

    cursor = (
        ad_collection
        .find(
            {},
            {
                "_id": 0,
                "created_at": 0,
            },
        )
        .sort("created_at", -1)
        .limit(limit)
    )

    return await cursor.to_list(length=limit)


# ==========================================
# FastAPI 시작/종료 처리
# ==========================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 서버 시작 시 MongoDB 연결 확인
    await mongo_client.admin.command("ping")
    print("MongoDB 연결 성공")

    yield

    # 서버 종료 시 MongoDB 연결 종료
    await mongo_client.close()


app = FastAPI(
    title="AI 광고 문구 생성 API",
    lifespan=lifespan,
)


# ==========================================
# 광고 문구 생성 및 저장 API
# ==========================================

@app.post(
    "/ads",
    response_model=AdGenerateResponse,
)
async def create_ad(payload: AdCreate):

    # 리스트를 문자열로 변환
    # ["재밌게", "참신하게"]
    # → "재밌게, 참신하게"
    tone_text = ", ".join(payload.tone_and_manner)

    instructions = (
        "당신은 한국어 광고 카피라이터입니다. "
        "입력된 제품 정보를 바탕으로 광고 문구를 정확히 한 문장만 작성하세요. "
        "제목, 설명, 번호, 따옴표, 마크다운은 작성하지 말고 "
        "광고 문구만 반환하세요."
    )

    user_input = (
        f"제품 이름: {payload.product_name}\n"
        f"제품 주요 내용: {payload.details}\n"
        f"원하는 광고 문구 스타일: {tone_text}"
    )

    try:
        # GPT API 호출
        response = await openai_client.responses.create(
            model=OPENAI_MODEL,
            instructions=instructions,
            input=user_input,

            # 광고 한 문장이므로 깊은 추론이 필요하지 않음
            reasoning={"effort": "minimal"},

            # 일반 텍스트 출력을 명시
            text={ "format": { "type": "text" }},

            # 추론 토큰까지 포함하므로 충분히 확보
            max_output_tokens=1000,
        )

        generated_ad = (
            response.output_text or ""
        ).strip()

        if not generated_ad:
            raise HTTPException(
                status_code=502,
                detail="GPT가 광고 문구를 반환하지 않았습니다.",
            )

        # MongoDB에 저장할 데이터
        document = {
            "product_name": payload.product_name,
            "details": payload.details,
            "tone_and_manner": tone_text,
            "ad": generated_ad,
        }

        # MongoDB 저장
        await ad_collection.insert_one(document)

        # 저장 후 최근 데이터 조회
        recent_ads = await find_recent_ads(limit=10)

        return {
            "ad": generated_ad,
            "datas": recent_ads,
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=(
                "광고 문구 생성 중 오류가 발생했습니다: "
                f"{error}"
            ),
        ) from error


# ==========================================
# 최근 광고 목록만 조회하는 API
# ==========================================

@app.get(
    "/ads/recent",
    response_model=list[AdItem],
)
async def get_recent_ads(
    limit: int = Query(
        default=10,
        ge=1,
        le=50,
    ),
):
    try:
        return await find_recent_ads(limit=limit)

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=(
                "최근 광고 조회 중 오류가 발생했습니다: "
                f"{error}"
            ),
        ) from error