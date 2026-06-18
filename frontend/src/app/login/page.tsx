import { login, loginWithFacebook } from '../auth/actions'
import Link from 'next/link'

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; message?: string }> // ⚡ Added message here
}) {
    const { error, message } = await searchParams // ⚡ Destructured message here

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Sign In</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                {/* ⚡ Error and Success banners render right here */}
                {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
                {message && <p style={{ color: 'green', fontSize: '14px', backgroundColor: '#e6f4ea', padding: '8px', borderRadius: '4px' }}>{message}</p>}

                <div>
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                </div>

                <button formAction={login} style={{ padding: '10px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Log In
                </button>
            </form>    
                <div style={{ textAlign: 'center', color: '#888', margin: '10px 0' }}>or</div>
                    <form action={loginWithFacebook}>
                        <button type="submit" style={{ padding: '10px', background: '#1877F2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Continue with Facebook
                        </button>
                    </form>

            <p style={{ fontSize: '14px', marginTop: '15px' }}>
                Don't have an account? <Link href="/register" style={{ color: '#0070f3' }}>Register here</Link>
            </p>
        </div>
    )
}