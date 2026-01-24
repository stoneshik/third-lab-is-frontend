export interface JwtResponseDto {
    token: string;
    type: string;
    refreshToken: string;
    id: number;
    username: string;
    roles: string[];
}
