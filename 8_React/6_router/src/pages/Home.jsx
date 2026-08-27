import styles from "./Home.module.css"
import "../App.css"

export default function Home() {
    return (
        <div>
            {/*styles.button를 사용하게되면 Home.jsx 에서만 사용가능하고 유니크하게 클레스네임이 적용됨 */}
            Home <button className={styles.button}>버튼1</button>
            <button className="button">버튼2</button>
        </div>
    )
}