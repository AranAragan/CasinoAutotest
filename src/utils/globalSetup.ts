import dotenv from "dotenv"


function globalSetup() {
    if (process.env.test_env) {
        dotenv.config({
            path: `helper/env/.env.${process.env.test_env}`,
            override: true
        })

    }
}
export default globalSetup;