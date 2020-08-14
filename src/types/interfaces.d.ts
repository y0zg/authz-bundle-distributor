declare namespace Express {
    export interface Request {
        user: {
            sub: string;
            iss: string;
            jti: string;
            exp: number;
            iat: number;
            app_metadata: {
                user_id: string;
                role: string;
                district_id?: string;
                is_active: boolean;
                is_staff: boolean;
                is_superuser: boolean;
                is_test_user: boolean;
            };
        };
    }
}
