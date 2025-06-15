export interface AppConfig {
    database: {
        host: string;
        port: number;
        database: string;
        type: string;
        username: string;
        password: string;
    }
    jwtConfig: string,
    s3:{
        name: string,
    },
    aws?: {
        accessKeyId: string,
        secretAccessKey: string
    }
}
