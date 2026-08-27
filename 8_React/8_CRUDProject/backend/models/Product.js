import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "상품명은 필수입니다."], // 무조건 값이 들어가야한다
            trim: true
        },
        price: {
            type: Number,
            required: [true, "가격은 필수입니다."],
            min: [0, "가격은 0원 이상이어야 합니다."]
        }
    },
    {
        // 생성, 수정 시간을 자동으로 작성해줌
        timestamps: true
    }
)
// 컬렉션으로 등록 하게됨
const Product = mongoose.model("Product", productSchema)

export default Product