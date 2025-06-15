import { AppConfig } from "./app-config.interface";

export const getConfig = (): AppConfig => ({
    database: {
        host: "localhost",
        port: 3306,
        database: "master",
        type: "mysql",
        username: "admin",
        password: "typefaceadmin"
    },
    jwtConfig: "typeface",
    s3: {
        name: "zono-media-public-stage"
    }
})