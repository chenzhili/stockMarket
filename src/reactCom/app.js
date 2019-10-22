import React from "react"

import styles from "./app.scss"


function App() {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis perspiciatis</h2>
            <div className={styles.content}>
                <div className={styles.left}>
                    左侧内容：Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis perspiciatis provident, necessitatibus quae labore, similique id dignissimos sit mollitia vero ullam repudiandae veniam molestias, ratione possimus magnam nihil nobis enim.
            </div>
                <div className={styles.main}>
                </div>
                <div
                    className={styles.right}
                >右侧内容：Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam nobis ullam voluptate. A maxime autem velit ducimus quos modi, natus esse molestias id officia inventore odit doloribus quod maiores deserunt?</div>
            </div >
        </div >
    )
}
export default App;
