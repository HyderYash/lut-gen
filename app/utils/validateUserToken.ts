interface ApiResponse {
    success: boolean;
    message: string;
    decoded?: { [key: string]: any };
}

export async function validateUserToken(token: string): Promise<boolean> {
    try {
        const response = await fetch('/api/validate-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });

        const data: ApiResponse = await response.json();

        if (data.success) {
            console.log('Token is valid:', data.decoded);
            return true;
        } else {
            console.error('Token validation failed:', data.message);
            return false;
        }
    } catch (error) {
        console.error('Error validating token:', error);
        return false;
    }
}
